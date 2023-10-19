// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const path = require("path");

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Acurast Docs",
  tagline: "On Demand Oracle Machine",
  url: "https://docs.acurast.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.svg",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "acurast", // Usually your GitHub org/user name.
  projectName: "acurast-docs", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/acurast/acurast-docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: "UO421L1YVM",
        apiKey: "13fccdc821ae6dd593e9cad8bb442ab7",
        indexName: "acurast",
        searchParameters: {},
      },
      colorMode: {
        defaultMode: "dark",
      },
      navbar: {
        title: "Docs",
        logo: {
          alt: "Acurast",
          src: "img/acurast_logo_dark.svg",
          srcDark: "img/acurast_logo_light.svg",
        },
        items: [
          {
            href: "https://console.acurast.com/",
            label: "Acurast Console",
            position: "right",
          },
          {
            href: "https://faucet.acurast.com/",
            label: "Faucet",
            position: "right",
          },
          {
            href: "https://github.com/acurast/",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/",
              },
              {
                label: "Developers",
                to: "developers/get-started",
              },
              {
                label: "Processors",
                to: "acurast-processors",
              },
              {
                label: "Integrations",
                to: "integrations/introduction",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/wqgC6b6aKe",
              },
              {
                label: "Telegram",
                href: "https://t.me/acurastnetwork",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/Acurast",
              },
              {
                label: "Medium",
                href: "https://acurast.medium.com/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/acurast/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Acurast Association`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["rust", "solidity"],
      },
      image: "img/social-preview.png",
    }),
  plugins: [
    path.join(__dirname, "/plugins/monaco-editor"),
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            to: "/acurast-protocol/introduction",
            from: "/acurast-protocol/architecture",
          },
          {
            to: "/acurast-processors",
            from: "/acurast-transmitters",
          },
          {
            to: "/acurast-protocol/modules/enterprise",
            from: "/acurast-protocol/interoperability/enterprise",
          },
          {
            to: "/acurast-protocol/modules/hyperdrive",
            from: "/acurast-protocol/interoperability/hyperdrive",
          },
          {
            to: "/acurast-protocol/modules/mesh",
            from: "/acurast-protocol/interoperability/mesh",
          },
          {
            to: "/acurast-protocol/modules/singularity",
            from: "/acurast-protocol/interoperability/singularity",
          },
        ],
      },
    ],
  ],
};

module.exports = config;
