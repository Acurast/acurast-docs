// Wrapper to handle mermaid import for server-side rendering
let mermaid;

if (typeof window !== 'undefined') {
  mermaid = require('mermaid');
}

module.exports = mermaid || {};