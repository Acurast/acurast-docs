#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

const defaults = {
  baseUrl: "http://localhost:3000",
  sitemap: path.join(__dirname, "main-sitemap.xml"),
  currentSitemap: path.join(__dirname, "..", "build", "sitemap.xml"),
  buildDir: path.join(__dirname, "..", "build"),
  timeout: 10000,
  concurrency: 8,
  maxRedirects: 8,
};

function parseArgs(args) {
  const options = { ...defaults };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--base-url") options.baseUrl = args[++index];
    else if (arg === "--sitemap") options.sitemap = args[++index];
    else if (arg === "--current-sitemap") options.currentSitemap = args[++index];
    else if (arg === "--build-dir") options.buildDir = args[++index];
    else if (arg === "--timeout") options.timeout = Number(args[++index]);
    else if (arg === "--concurrency") options.concurrency = Number(args[++index]);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  options.baseUrl = options.baseUrl.replace(/\/+$/, "");
  options.sitemap = path.resolve(options.sitemap);
  options.currentSitemap = path.resolve(options.currentSitemap);
  options.buildDir = path.resolve(options.buildDir);
  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/check-links.js [options]

Checks every URL in the baseline sitemap against a locally served docs site.
Each URL must resolve directly or through redirects to a valid non-404 page.

Options:
  --base-url <url>       Local docs URL to check (default: ${defaults.baseUrl})
  --sitemap <path>       Sitemap URL source (default: scripts/main-sitemap.xml)
  --current-sitemap <path>
                         Current build sitemap used to validate final routes
                         (default: build/sitemap.xml)
  --build-dir <path>     Current build directory used to resolve static
                         Docusaurus redirect pages (default: build)
  --timeout <ms>         Request timeout in milliseconds (default: ${defaults.timeout})
  --concurrency <n>      Number of parallel checks (default: ${defaults.concurrency})
  -h, --help             Show this help text
`);
}

function urlsFromSitemap(sitemapPath) {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]))].sort();
}

function routePath(inputUrl) {
  const url = new URL(inputUrl);
  let route = decodeURI(url.pathname);
  if (route.length > 1) route = route.replace(/\/+$/, "");
  return route || "/";
}

function localUrlForRoute(route, baseUrl) {
  const url = new URL(baseUrl);
  url.pathname = route;
  url.search = "";
  url.hash = "";
  return url.href;
}

function routesFromSitemap(sitemapPath) {
  return new Set(urlsFromSitemap(sitemapPath).map(routePath));
}

function toLocalUrl(sourceUrl, baseUrl) {
  const source = new URL(sourceUrl);
  const local = new URL(baseUrl);
  local.pathname = source.pathname;
  local.search = source.search;
  local.hash = "";
  return local.href;
}

function requestHtml(url, options) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const client = parsed.protocol === "https:" ? https : http;
    const request = client.request(
      parsed,
      {
        method: "GET",
        timeout: options.timeout,
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "user-agent": "acurast-docs-link-checker",
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve({
            status: response.statusCode,
            location: response.headers.location,
            html: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    request.on("timeout", () => request.destroy(new Error("request timed out")));
    request.on("error", (error) => resolve({ error: error.message }));
    request.end();
  });
}

function getClientRedirect(html, currentUrl) {
  if (!html) return null;

  const metaRefresh = html.match(
    /<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["']/i,
  );
  if (metaRefresh) return new URL(metaRefresh[1].trim(), currentUrl).href;

  const locationAssign = html.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
  if (locationAssign) return new URL(locationAssign[1].trim(), currentUrl).href;

  return null;
}

function htmlFileForRoute(route, buildDir) {
  if (route === "/") return path.join(buildDir, "index.html");
  return path.join(buildDir, route.replace(/^\/+/, ""), "index.html");
}

function getStaticRedirectRoute(route, buildDir) {
  const file = htmlFileForRoute(route, buildDir);
  if (!fs.existsSync(file)) return null;

  const html = fs.readFileSync(file, "utf8");
  const target = getClientRedirect(html, `https://docs.acurast.com${route}`);
  return target ? routePath(target) : null;
}

function resolveStaticRedirectRoute(route, options) {
  const chain = [route];
  let currentRoute = route;

  for (let redirectCount = 0; redirectCount <= options.maxRedirects; redirectCount += 1) {
    const targetRoute = getStaticRedirectRoute(currentRoute, options.buildDir);
    if (!targetRoute) return { route: currentRoute, chain };
    if (chain.includes(targetRoute)) {
      return { route: targetRoute, chain: [...chain, targetRoute], loop: true };
    }
    currentRoute = targetRoute;
    chain.push(currentRoute);
  }

  return { route: currentRoute, chain, tooManyRedirects: true };
}

function isPageNotFound(html) {
  if (!html) return false;

  return (
    /<title[^>]*>\s*Page Not Found\s*\|/i.test(html) ||
    /<meta[^>]+property=["']og:title["'][^>]+content=["']Page Not Found\s*\|/i.test(html) ||
    /<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']*\/404(?:\.html)?["']/i.test(html) ||
    /<h1[^>]*>\s*Page Not Found\s*<\/h1>/i.test(html) ||
    /This page could not be found/i.test(html)
  );
}

async function resolveUrl(url, options, validRoutes) {
  const chain = [url];
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= options.maxRedirects; redirectCount += 1) {
    const response = await requestHtml(currentUrl, options);
    if (response.error) return { ok: false, reason: response.error, chain };
    if (typeof response.status !== "number") {
      return { ok: false, reason: "Invalid response without HTTP status", chain };
    }

    if (response.status >= 300 && response.status < 400 && response.location) {
      currentUrl = new URL(response.location, currentUrl).href;
      chain.push(currentUrl);
      continue;
    }

    if (response.status < 200 || response.status >= 300) {
      return { ok: false, reason: `HTTP ${response.status}`, chain };
    }

    if (!response.html) {
      return { ok: false, reason: "Empty response body", chain };
    }

    const clientRedirect = getClientRedirect(response.html, currentUrl);
    if (clientRedirect) {
      currentUrl = clientRedirect;
      chain.push(currentUrl);
      continue;
    }

    if (isPageNotFound(response.html)) {
      return { ok: false, reason: "Page Not Found", chain };
    }

    const finalRoute = routePath(currentUrl);
    if (validRoutes.has(finalRoute)) {
      return { ok: true, chain };
    }

    const staticRedirect = resolveStaticRedirectRoute(finalRoute, options);
    if (staticRedirect.loop) {
      return { ok: false, reason: `Static redirect loop: ${staticRedirect.chain.join(" -> ")}`, chain };
    }
    if (staticRedirect.tooManyRedirects) {
      return { ok: false, reason: `Too many static redirects (${options.maxRedirects})`, chain };
    }
    if (validRoutes.has(staticRedirect.route)) {
      return {
        ok: true,
        chain: [
          ...chain,
          ...staticRedirect.chain.slice(1).map((route) => localUrlForRoute(route, options.baseUrl)),
        ],
      };
    }

    return {
      ok: false,
      reason: `Route is not in current build sitemap: ${staticRedirect.route}`,
      chain: [
        ...chain,
        ...staticRedirect.chain.slice(1).map((route) => localUrlForRoute(route, options.baseUrl)),
      ],
    };
  }

  return { ok: false, reason: `Too many redirects (${options.maxRedirects})`, chain };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const validRoutes = routesFromSitemap(options.currentSitemap);
  const checks = urlsFromSitemap(options.sitemap).map((sourceUrl) => ({
    sourceUrl,
    localUrl: toLocalUrl(sourceUrl, options.baseUrl),
  }));
  const failures = [];
  let cursor = 0;

  async function worker() {
    while (cursor < checks.length) {
      const check = checks[cursor];
      cursor += 1;
      const result = await resolveUrl(check.localUrl, options, validRoutes);
      if (!result.ok) failures.push({ ...check, ...result });
    }
  }

  await Promise.all(Array.from({ length: options.concurrency }, worker));

  console.log(`Checked ${checks.length} sitemap URLs against ${options.baseUrl}`);
  console.log(`Loaded ${validRoutes.size} valid current route(s) from ${options.currentSitemap}`);

  if (failures.length === 0) {
    console.log("All sitemap URLs resolve to valid pages.");
    return;
  }

  console.error(`Found ${failures.length} broken sitemap URL(s):`);
  for (const failure of failures.sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl))) {
    console.error(`\n${failure.sourceUrl}`);
    console.error(`  ${failure.reason}`);
    console.error(`  ${failure.chain.join(" -> ")}`);
  }
  process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
