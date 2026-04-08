// Mock the chrome object before requiring content.js
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
};

// Polyfill innerText for JSDOM
if (Object.defineProperty) {
  Object.defineProperty(global.Element.prototype, 'innerText', {
    get() {
      return this.textContent;
    },
    set(value) {
      this.textContent = value;
    },
    configurable: true
  });
}

describe('DOM Extraction Logic', () => {
  let extractMetadata, extractLinks, extractHeadings, getArchitecturalParent, extractSection, extractData;

  beforeEach(() => {
    jest.resetModules();
    const content = require('../scripts/content.js');
    extractMetadata = content.extractMetadata;
    extractLinks = content.extractLinks;
    extractHeadings = content.extractHeadings;
    getArchitecturalParent = content.getArchitecturalParent;
    extractSection = content.extractSection;
    extractData = content.extractData;
  });

  test('extractSection should correctly identify and label architectural parent', () => {
    // Setup a clean DOM
    document.body.innerHTML = `
      <main>
        <div id="content-container">
           <p>Inner content</p>
        </div>
      </main>
    `;
    
    // Test direct extraction with parent label
    const result = extractSection('#content-container', true);
    
    // Should find MAIN because DIV is in the list but we want the highest relevant?
    // Wait, the logic finds the *immediate* architectural parent.
    // In this case, DIV is in the list, so it should return DIV.
    expect(result).toContain('[ARCHITECTURAL PARENT: MAIN]');
    expect(result).toContain('[P] Inner content');
  });

  test('getArchitecturalParent should handle BODY tag', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.getElementById('target');
    // Parent of DIV is BODY
    expect(getArchitecturalParent(target)).toBe('BODY');
  });

  test('extractMetadata should extract page title', () => {
    document.title = 'Test Page';
    const metadata = extractMetadata();
    expect(metadata.title).toBe('Test Page');
  });

  test('extractLinks should extract links from a container', () => {
    document.body.innerHTML = `
      <nav id="test-nav">
        <a href="https://example.com/1">Link 1</a>
        <a href="https://example.com/2">Link 2</a>
      </nav>
    `;
    const links = extractLinks('#test-nav');
    expect(links.length).toBe(2);
    expect(links[0].text).toBe('Link 1');
    expect(links[0].url).toBe('https://example.com/1');
  });

  test('extractHeadings should extract all levels of headings', () => {
    document.body.innerHTML = `
      <h1>H1</h1>
      <h2>H2</h2>
      <h3>H3</h3>
    `;
    const headings = extractHeadings();
    expect(headings.length).toBe(3);
    expect(headings[0].level).toBe('1');
    expect(headings[0].text).toBe('H1');
  });
});
