# MKdownSEO - Project Context & Agent Instructions

## 🚀 Project Overview
**MKdownSEO (v1.1.0)** is a Chrome Browser Extension (Manifest V3) designed as an intelligent filter to convert web pages into Markdown for SEO and UX auditing ("Audit Pro").
The extension extracts deep metadata, tech stack signatures, semantic structure, headings, raw links, and JSON-LD schemas. It is built to support modern JS-heavy frameworks and Shadow DOM elements.

**Architecture:**
- **Service Worker (`background.js`):** Manages the extension lifecycle and handles tab-specific memory cleanup upon navigation.
- **Content Scripts (`content.js`):** Executes within the context of web pages to perform advanced DOM traversal and data extraction.
- **Library (`markdown-generator.js`, `turndown.js`):** Converts the extracted JSON data into formatted, professional Markdown reports.
- **UI (`popup/`):** The user interface for triggering extractions and copying the generated reports.

## 🛠️ Building and Running
- **Installation:** This is an unpacked Chrome extension. To run it locally, go to `chrome://extensions/` in your browser, enable "Developer mode", and select "Load unpacked", pointing to the `MKdownSEO/` directory.
- **Dependencies:** Run `npm install` to install testing dependencies.
- **Testing:** The project uses Jest for unit testing, heavily utilizing JSDOM to mock the browser environment.
  - Command: `npm run test`

## 📋 Development Conventions & Guidelines
When contributing to this project or assisting with tasks, strictly adhere to the following guidelines:

1. **Brand Voice & Signature:**
   - Maintain a professional, strategic tone ("Reporte Estratégico", "Auditoría").
   - **MANDATORY:** All newly created files and code headers MUST include the project signature: `jaguardluz 2026`.
   
2. **Coding Style (ES6+):**
   - Write clean, modular, and well-documented JavaScript.
   - Use `const` and `let` (avoid `var`).
   - Prefer arrow functions and modern array methods (`map`, `filter`, `forEach`).

3. **DOM Extraction Principles:**
   - **Shadow DOM Support:** Always use recursive traversal (e.g., `findDeep`) to penetrate open Shadow Roots.
   - **Clean HTML:** Prioritize removing non-content elements (`<script>`, `<style>`, `<svg>`, etc.) before extracting textual or semantic content to maintain a high signal-to-noise ratio.
   
4. **UX & Memory Management:**
   - Respect tab-aware persistence. Data should be scoped by `tabId` using `chrome.storage.local`.
   - Clean up storage aggressively on tab reload (`onUpdated`) or closure (`onRemoved`).

5. **Testing Requirements:**
   - All new extraction logic or utility functions must be accompanied by Jest test cases in the `MKdownSEO/tests/` directory.
   - Ensure the global `chrome` object and specific DOM properties (like `innerText`) are properly mocked in the test setup.
