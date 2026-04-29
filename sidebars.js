/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    "introduction",
    {
      type: "category",
      label: "Developers",
      collapsed: false,
      link: { type: "doc", id: "developers/hub" },
      items: [
        {
          type: "category",
          label: "Getting Started",
          collapsed: false,
          items: [
            "developers/getting-started/quickstart",
            "developers/deploy-first-app",
            "developers/getting-started/examples",
          ],
        },
        {
          type: "category",
          label: "Build",
          collapsed: true,
          items: [
            "developers/build/deployment-config",
            "developers/build/environment-variables",
            "developers/build/runtime-environment",
            "developers/build/on-demand-deployments",
            "developers/build/llm-on-acurast",
          ],
        },
        {
          type: "category",
          label: "Tools",
          collapsed: true,
          items: [
            "developers/tools/cli",
            "developers/tools/sdk",
            "developers/tools/devtools",
            "developers/tools/deploy-agent",
          ],
        },
        {
          type: "category",
          label: "Reference",
          collapsed: true,
          items: [
            {
              type: "link",
              label: "Protocol Architecture",
              href: "/acurast-protocol/architecture/architecture",
            },
            {
              type: "link",
              label: "Networks",
              href: "/acurast-protocol/networks",
            },
            {
              type: "link",
              label: "Ecosystems & Integrations",
              href: "/acurast-protocol/integrations",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Compute Providers",
      collapsed: true,
      link: { type: "doc", id: "processors/hub" },
      items: [
        {
          type: "doc",
          id: "processors/become-compute-provider",
          label: "Become a Compute Provider",
        },
        "processors/acurast-processors",
        "processors/multiple-processors",
        "processors/rewards",
        "processors/benchmarks",
      ],
    },
    {
      type: "category",
      label: "Token Holders",
      collapsed: true,
      link: { type: "doc", id: "token-holders/hub" },
      items: [
        {
          type: "category",
          label: "Wallets",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "token-holders/wallets/wallet-overview",
              label: "Overview",
            },
            {
              type: "doc",
              id: "token-holders/wallets/wallets-airgap",
              label: "AirGap",
            },
            "token-holders/wallets/wallets-talisman",
            {
              type: "doc",
              id: "token-holders/wallets/wallets-subwallet",
              label: "SubWallet",
            },
            {
              type: "doc",
              id: "token-holders/wallets/wallets-base",
              label: "Base Wallet",
            },
            {
              type: "doc",
              id: "token-holders/wallets/wallets-ledger",
              label: "Ledger (coming soon)",
            },
          ],
        },
        {
          type: "doc",
          id: "token-holders/claiming-acu",
          label: "Claim Vested ACU",
        },
        {
          type: "category",
          label: "Stake & Delegate",
          collapsed: true,
          items: [
            "token-holders/staking/overview",
            "token-holders/staking/how-to-stake",
            "token-holders/staking/staking-mechanics",
            "token-holders/staking/slashing",
            "token-holders/staking/mainnet-vs-canary",
            "token-holders/staking/staking-faq",
            "token-holders/staking/staking-glossary",
          ],
        },
        {
          type: "link",
          label: "Governance",
          href: "/acurast-protocol/governance",
        },
      ],
    },
    {
      type: "category",
      label: "Discover Acurast",
      collapsed: true,
      link: { type: "doc", id: "investors/hub" },
      items: [
        "investors/acurast-token",
        "investors/tokenomics",
        "investors/roadmap",
        "investors/metrics",
        {
          type: "link",
          label: "Use Cases & Ecosystems",
          href: "/acurast-protocol/integrations",
        },
        {
          type: "link",
          label: "Audits",
          href: "/acurast-protocol/audits",
        },
        {
          type: "link",
          label: "Whitepapers",
          href: "/acurast-protocol/whitepapers",
        },
      ],
    },
    {
      type: "category",
      label: "Protocol & Reference",
      collapsed: true,
      items: [
        {
          type: "category",
          label: "Architecture",
          collapsed: true,
          link: { type: "doc", id: "acurast-protocol/architecture/architecture" },
          items: [
            "acurast-protocol/architecture/end-to-end",
            "acurast-protocol/architecture/application-layer",
            "acurast-protocol/architecture/execution-layer",
            "acurast-protocol/architecture/consensus-layer",
            "acurast-protocol/architecture/instances",
            {
              type: "link",
              label: "Matcher",
              href: "/acurast-protocol/architecture/architecture#matcher",
            },
          ],
        },
        "acurast-protocol/node-setup",
        "acurast-protocol/governance",
        "acurast-protocol/deployment-pricing",
        "acurast-protocol/networks",
        "acurast-protocol/integrations",
        "acurast-protocol/audits",
        "acurast-protocol/whitepapers",
        {
          type: "category",
          label: "From Canary To Mainnet",
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "acurast-protocol/from-canary-to-mainnet/overview",
              label: "Overview",
            },
            {
              type: "doc",
              id: "acurast-protocol/from-canary-to-mainnet/token-transfers",
              label: "Transfers on Canary",
            },
          ],
        },
      ],
    },
    "faq",
  ],
};

module.exports = sidebars;
