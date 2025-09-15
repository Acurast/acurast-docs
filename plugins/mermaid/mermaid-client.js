import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  let mermaid;
  
  // Function to render Mermaid diagrams
  async function renderMermaidDiagrams() {
    if (!mermaid) {
      const mermaidModule = await import('mermaid');
      mermaid = mermaidModule.default;
      
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#1e2128',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#404040',
          lineColor: '#ffffff',
          sectionBkgColor: '#1e2128',
          altSectionBkgColor: '#2d2d2d',
          gridColor: '#404040',
          secondaryColor: '#2d2d2d',
          tertiaryColor: '#404040',
        },
        securityLevel: 'loose',
      });
    }

    const mermaidCodeBlocks = document.querySelectorAll('code.language-mermaid');
    
    mermaidCodeBlocks.forEach(async (block, index) => {
      const parent = block.parentElement;
      if (parent.tagName === 'PRE') {
        const mermaidDiv = document.createElement('div');
        mermaidDiv.className = 'mermaid';
        mermaidDiv.textContent = block.textContent;
        mermaidDiv.id = `mermaid-${index}-${Date.now()}`;
        
        parent.parentNode.replaceChild(mermaidDiv, parent);
        
        // Render this specific diagram
        try {
          const { svg } = await mermaid.render(mermaidDiv.id + '-svg', block.textContent);
          mermaidDiv.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          mermaidDiv.innerHTML = `<pre><code>${block.textContent}</code></pre>`;
        }
      }
    });
  }

  // Render diagrams when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMermaidDiagrams);
  } else {
    setTimeout(renderMermaidDiagrams, 100);
  }

  // Re-render on navigation (for SPA behavior)
  window.addEventListener('popstate', () => {
    setTimeout(renderMermaidDiagrams, 100);
  });
}