/**
 * MKdownSEO - Content Script Extractor (jaguardluz 2026)
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
      sendResponse({ status: 'ready' });
      return true;
  }

  if (request.action === 'extract') {
    const data = extractData(request.preferences);
    sendResponse(data);
  }
  return true;
});

function extractData(prefs) {
  const output = {
    url: window.location.href,
    metadata: prefs.metadata ? extractMetadata() : null,
    tech: prefs.tech ? detectTech() : null,
    schema: prefs.schema ? extractSchema() : null,
    headings: prefs.headings ? extractHeadings() : null,
    sections: {}
  };

  const commonSelectors = {
    header: 'header, [role="banner"], .header, #header, .top-bar',
    nav: 'nav, [role="navigation"], .nav, #nav, .menu',
    body: 'main, [role="main"], article, .main, #main, .content, #content, body',
    footer: 'footer, [role="contentinfo"], .footer, #footer'
  };

  if (prefs.header) output.sections.header = extractSection(commonSelectors.header);
  if (prefs.nav) output.sections.nav = {
      links: extractLinks(commonSelectors.nav),
      html: extractSection(commonSelectors.nav)
  };
  if (prefs.body) output.sections.body = extractSection(commonSelectors.body, true);
  if (prefs.bodyMarkdown) output.sections.bodyMarkdown = extractSectionRaw(commonSelectors.body);
  if (prefs.bodyText) output.sections.bodyText = extractSectionText(commonSelectors.body);
  if (prefs.bodyCleanHTML) output.sections.bodyCleanHTML = extractSectionCleanHTML(commonSelectors.body);
  if (prefs.bodyLinks) output.sections.bodyLinks = extractBodyLinks(commonSelectors.body);
  if (prefs.footer) output.sections.footer = {
      links: extractLinks(commonSelectors.footer),
      html: extractSection(commonSelectors.footer)
  };

  return output;
}

/**
 * Extracts links specifically from the body, excluding header and footer descendants.
 */
function extractBodyLinks(selector) {
    const container = findDeep(selector);
    if (!container) return [];
    
    const links = [];
    const walkLinks = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            
            // Discrimination: Skip header and footer entirely
            const isNoise = ['header', 'footer', 'nav'].includes(tag) || 
                            node.closest('header, [role="banner"], footer, [role="contentinfo"], nav');
            
            if (isNoise) return;

            if (tag === 'a') {
                const text = node.innerText.trim() || 'Sin texto';
                if (node.href.startsWith('http')) {
                    links.push({ text, url: node.href });
                }
            }
            if (node.shadowRoot) Array.from(node.shadowRoot.childNodes).forEach(walkLinks);
            Array.from(node.childNodes).forEach(walkLinks);
        }
    };
    walkLinks(container);
    return links;
}

/**
 * Extracts a section as clean HTML, removing all attributes except href, src, and alt.
 */
function extractSectionCleanHTML(selector) {
  const element = findDeep(selector);
  if (!element) return '';
  
  const clone = element.cloneNode(true);
  
  const clean = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (['script', 'style', 'input', 'button', 'svg', 'noscript', 'iframe'].includes(tag)) {
        node.remove();
        return;
      }
      
      const attrs = Array.from(node.attributes);
      attrs.forEach(attr => {
        if (!['href', 'src', 'alt'].includes(attr.name.toLowerCase())) {
          node.removeAttribute(attr.name);
        }
      });
      
      if (node.shadowRoot) Array.from(node.shadowRoot.childNodes).forEach(clean);
      Array.from(node.childNodes).forEach(clean);
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Collapse multiple spaces/newlines in text nodes to a single space
      node.textContent = node.textContent.replace(/\s+/g, ' ');
    }
  };
  
  clean(clone);
  
  // Final string cleanup: Remove spaces between tags and collapse remaining whitespace
  return clone.innerHTML
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s{2,}/g, ' ')  // Collapse multiple spaces to one
    .trim();
}

/**
 * Finds an element globally, even inside open Shadow Roots.
 * Vital for JS-heavy frameworks and Web Components.
 */
function findDeep(selector, root = document) {
    let element = root.querySelector(selector);
    if (element) return element;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
    let n;
    while (n = walker.nextNode()) {
        if (n.shadowRoot) {
            element = findDeep(selector, n.shadowRoot);
            if (element) return element;
        }
    }
    return null;
}

function extractLinks(selector) {
    const container = findDeep(selector);
    if (!container) return [];
    
    // Manual traversal to capture links inside shadow roots within the container
    const links = [];
    const walkLinks = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'a') {
                const text = node.innerText.trim() || 'Sin texto';
                if (node.href.startsWith('http')) {
                    links.push({ text, url: node.href });
                }
            }
            if (node.shadowRoot) Array.from(node.shadowRoot.childNodes).forEach(walkLinks);
            Array.from(node.childNodes).forEach(walkLinks);
        }
    };
    walkLinks(container);
    return links;
}

function extractHeadings() {
  const headings = [];
  const walkHeadings = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          if (/^h[1-6]$/.test(tag)) {
              headings.push({ level: tag.substring(1), text: node.innerText.trim() });
          }
          if (node.shadowRoot) Array.from(node.shadowRoot.childNodes).forEach(walkHeadings);
          Array.from(node.childNodes).forEach(walkHeadings);
      }
  };
  walkHeadings(document.body);
  return headings;
}

function extractMetadata() {
  // Direct reading of DOM for dynamic metadata (React Helmet, Next.js)
  return {
    title: document.title,
    lang: document.documentElement.lang || '',
    description: getMeta('description'),
    robots: getMeta('robots'),
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    ogTitle: getMeta('og:title', 'property'),
    ogDesc: getMeta('og:description', 'property'),
    twitterCard: getMeta('twitter:card'),
    twitterTitle: getMeta('twitter:title'),
    twitterDesc: getMeta('twitter:description')
  };
}

function getMeta(name, attr = 'name') {
    return document.querySelector(`meta[${attr}="${name}"]`)?.content || '';
}

function extractSchema() {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(script => {
      try { return JSON.parse(script.innerText); } 
      catch (e) { return null; }
    }).filter(s => s !== null);
}

function detectTech() {
    const tech = { CMS: [], Ecommerce: [], Frameworks: [], Analytics: [], Tools: [] };

    // Preparation of data sources
    const html = document.documentElement.outerHTML.toLowerCase();
    const metas = Array.from(document.querySelectorAll('meta')).map(m => ({
        name: m.getAttribute('name')?.toLowerCase() || '',
        content: m.getAttribute('content')?.toLowerCase() || '',
        property: m.getAttribute('property')?.toLowerCase() || ''
    }));
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src?.toLowerCase() || '');
    const links = Array.from(document.querySelectorAll('link')).map(l => l.href?.toLowerCase() || '');

    const signatures = [
        // CMS & Platforms
        { cat: 'CMS', name: 'WordPress', pattern: /wp-content|wp-includes/i, meta: { name: 'generator', value: 'wordpress' } },
        { cat: 'CMS', name: 'Webflow', pattern: /data-wf-page/i, meta: { name: 'generator', value: 'webflow' } },
        { cat: 'CMS', name: 'Wix', pattern: /wixstatic\.com/i, meta: { name: 'generator', value: 'wix.com' } },
        { cat: 'CMS', name: 'HubSpot CMS', pattern: /js\.hs-scripts\.com|hs-script-loader/i, meta: { name: 'generator', value: 'hubspot' } },
        { cat: 'CMS', name: 'Drupal', pattern: /drupal\.behaviors|drupal\.settings/i, meta: { name: 'generator', value: 'drupal' } },
        { cat: 'CMS', name: 'Joomla', pattern: /joomla/i, meta: { name: 'generator', value: 'joomla' } },
        { cat: 'CMS', name: 'Ghost', pattern: /ghost/i, meta: { name: 'generator', value: 'ghost' } },
        { cat: 'CMS', name: 'Squarespace', pattern: /squarespace\.com|static1\.squarespace/i },

        // Ecommerce (Shopify can be CMS too)
        { cat: 'Ecommerce', name: 'Shopify', pattern: /cdn\.shopify\.com|shopify-checkout/i, meta: { name: 'shopify', value: '' } },
        { cat: 'Ecommerce', name: 'Magento', pattern: /x-magento-|\/mage\/|magento_/i, meta: { name: 'generator', value: 'magento' } },
        { cat: 'Ecommerce', name: 'PrestaShop', pattern: /prestashop/i, meta: { name: 'generator', value: 'prestashop' } },
        { cat: 'Ecommerce', name: 'WooCommerce', pattern: /woocommerce/i },

        // Frameworks
        { cat: 'Frameworks', name: 'Next.js', pattern: /_next\/static|__next_data__/i },
        { cat: 'Frameworks', name: 'React', pattern: /reactroot|react\.production/i },
        { cat: 'Frameworks', name: 'Vue.js', pattern: /vue\.js|data-v-/i },
        { cat: 'Frameworks', name: 'Angular', pattern: /angular\.js|ng-version|ng-app/i },
        { cat: 'Frameworks', name: 'Tailwind CSS', pattern: /tailwind/i },
        { cat: 'Frameworks', name: 'Bootstrap', pattern: /bootstrap/i },

        // Analytics
        { cat: 'Analytics', name: 'Google Analytics', pattern: /googletagmanager\.com\/gtag|google-analytics\.com/i },
        { cat: 'Analytics', name: 'Facebook Pixel', pattern: /connect\.facebook\.net/i },
        { cat: 'Analytics', name: 'Hotjar', pattern: /static\.hotjar\.com/i },

        // Tools
        { cat: 'Tools', name: 'Google Tag Manager', pattern: /googletagmanager\.com\/gtm\.js/i },
        { cat: 'Tools', name: 'Adobe Launch', pattern: /assets\.adobedtm\.com/i }
    ];

    signatures.forEach(s => {
        let detected = false;

        // 1. Check Meta Tags
        if (s.meta) {
            detected = metas.some(m => {
                const nameMatch = m.name === s.meta.name || m.property === s.meta.name;
                const valueMatch = s.meta.value === '' || m.content.includes(s.meta.value);
                return nameMatch && valueMatch;
            });
        }

        // 2. Check Scripts
        if (!detected) detected = scripts.some(src => s.pattern.test(src));

        // 3. Check Links
        if (!detected) detected = links.some(href => s.pattern.test(href));

        // 4. Check Global HTML (last resort)
        if (!detected) detected = s.pattern.test(html);

        if (detected) {
            tech[s.cat].push(s.name);
            // Special case: Shopify is often the CMS too
            if (s.name === 'Shopify') tech.CMS.push('Shopify CMS');
        }
    });

    for (let cat in tech) tech[cat] = [...new Set(tech[cat])];
    return tech;
}

function extractSectionRaw(selector) {
  const element = findDeep(selector);
  if (!element) return '';
  const clone = element.cloneNode(true);
  clone.querySelectorAll('script, style, input, button, svg, noscript, iframe').forEach(el => el.remove());
  return clone.innerHTML;
}

function extractSectionText(selector) {
  return findDeep(selector)?.innerText.trim() || '';
}

function extractSection(selector, includeParent = false) {
  const element = findDeep(selector);
  if (!element) return '';
  
  const output = [];
  if (includeParent) {
    output.push(`[ARCHITECTURAL PARENT: ${getArchitecturalParent(element)}]\n`);
  }

  // Use a temporary container for semantic processing to avoid DOM pollution
  const temp = document.createElement('div');
  temp.innerHTML = element.innerHTML;
  temp.querySelectorAll('script, style, input, button, svg, noscript, iframe').forEach(el => el.remove());
  
  output.push(processSemanticDOM(element)); // Pass original element to allow shadowRoot traversal
  return output.join('');
}

/**
 * Enhanced Semantic DOM Processor with Shadow DOM support.
 */
function processSemanticDOM(element) {
    const output = [];
    
    const walk = (node, parentTag = '') => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const semanticTags = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'section'];
            
            // Cleanup check for non-content elements
            if (['script', 'style', 'input', 'button', 'svg', 'noscript', 'iframe'].includes(tag)) return;

            if (tag === 'img') {
                output.push(`\n[IMG] SRC: ${node.src || ''} | ALT: ${node.alt || ''}\n`);
            } else if (tag === 'a') {
                output.push(`\n[A] TEXT: ${node.innerText.trim()} | URL: ${node.href}\n`);
            } else if (semanticTags.includes(tag)) {
                output.push(`\n[${tag.toUpperCase()}] `);
                Array.from(node.childNodes).forEach(child => walk(child, tag));
                // Deep dive into shadow roots
                if (node.shadowRoot) Array.from(node.shadowRoot.childNodes).forEach(child => walk(child, tag));
                output.push(`\n`);
            } else {
                Array.from(node.childNodes).forEach(child => walk(child, parentTag));
                // Deep dive into shadow roots
                if (node.shadowRoot) Array.from(node.shadowRoot.childNodes).forEach(child => walk(child, parentTag));
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) output.push(` ${text} `);
        }
    };

    walk(element);
    return output.join('');
}

function getArchitecturalParent(element) {
  const architecturalTags = ['HEADER', 'MAIN', 'ARTICLE', 'SECTION', 'FOOTER', 'NAV', 'ASIDE'];
  let parent = element.parentElement;
  while (parent) {
    if (architecturalTags.includes(parent.tagName)) return parent.tagName;
    parent = parent.parentElement;
  }
  return 'BODY';
}
