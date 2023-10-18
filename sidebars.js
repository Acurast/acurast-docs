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
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  docs: [
    "introduction",
    {
      type: "category",
      label: "Consumers",
      items: ["developers/get-started", "developers/create-address", "developers/api-reference"],
      collapsed: false,
    },
    "acurast-processors",
    "acurast-orchestrator",
    {
      type: "category",
      label: "Acurast Protocol",
      items: [
        {
          type: "category",
          label: "Architecture",
          items: [
            "acurast-protocol/architecture/architecture",
            "acurast-protocol/architecture/end-to-end",
            "acurast-protocol/architecture/application-layer",
            "acurast-protocol/architecture/execution-layer",
            "acurast-protocol/architecture/consensus-layer",
          ],
          collapsed: true,
        },
        "acurast-protocol/networks",
        {
          type: "category",
          label: "Modules",
          items: [
            "acurast-protocol/modules/enterprise",
            "acurast-protocol/modules/hyperdrive",
            "acurast-protocol/modules/singularity",
            "acurast-protocol/modules/mesh",
          ],
          collapsed: false,
        },
        "acurast-protocol/node-setup",
      ],
      collapsed: false,
    },
    {
      type: "category",
      label: "Ecosystems & Integrations",
      items: [
        "integrations/introduction",
        "integrations/evm",
        "integrations/substrate",
        "integrations/substrate-wasm",
        "integrations/tezos",
      ],
      collapsed: false,
    },
  ],
};

module.exports = sidebars;
