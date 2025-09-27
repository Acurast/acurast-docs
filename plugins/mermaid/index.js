const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-mermaid',
    configureWebpack(config, isServer) {
      if (isServer) {
        return {};
      }
      return {
        resolve: {
          alias: {
            mermaid: path.resolve(__dirname, 'mermaid-wrapper.js'),
          },
        },
      };
    },
    getClientModules() {
      return [path.resolve(__dirname, 'mermaid-client.js')];
    },
  };
};