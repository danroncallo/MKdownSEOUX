/**
 * MKdownSEO - Popup Logic (jaguardluz 2026)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const btnExtract = document.getElementById('btn-extract');
  const btnCopy = document.getElementById('btn-copy');
  const btnDownload = document.getElementById('btn-download');
  const status = document.getElementById('status');
  const postActions = document.getElementById('post-actions');
  const previewContainer = document.getElementById('preview-container');
  const previewText = document.getElementById('preview-text');

  let currentMarkdown = '';
  let activeTabId = null;

  // Turndown instance for clean markdown extraction
  const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  const mdGenerator = new MarkdownGenerator(turndownService);

  // Initialize persistence
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTabId = tab.id;
    const storageKey = `tab_${activeTabId}`;

    chrome.storage.local.get([storageKey], (result) => {
      const storedData = result[storageKey];
      if (storedData && storedData.url === tab.url) {
        currentMarkdown = storedData.markdown;
        previewText.value = currentMarkdown;
        previewContainer.classList.remove('hidden');
        postActions.classList.remove('hidden');
        status.innerText = 'Reporte recuperado de memoria.';
      }
    });
  } catch (err) { console.error(err); }

  btnExtract.addEventListener('click', async () => {
    status.innerText = 'Inyectando motor de auditoría...';
    
    const preferences = {
      metadata: document.getElementById('metadata').checked,
      schema: document.getElementById('schema').checked,
      tech: document.getElementById('tech').checked,
      headings: document.getElementById('headings').checked,
      header: document.getElementById('header').checked,
      nav: document.getElementById('nav').checked,
      body: document.getElementById('body').checked,
      bodyMarkdown: document.getElementById('bodyMarkdown').checked,
      bodyText: document.getElementById('bodyText').checked,
      bodyCleanHTML: document.getElementById('bodyCleanHTML').checked,
      bodyLinks: document.getElementById('bodyLinks').checked,
      footer: document.getElementById('footer').checked
    };

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Programmatic Injection (Security improvement)
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/content.js']
      });

      status.innerText = 'Analizando semántica de la página...';
      
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'extract', 
        preferences 
      });

      if (response) {
        currentMarkdown = mdGenerator.generate(response, tab.url);
        previewText.value = currentMarkdown;
        previewContainer.classList.remove('hidden');
        postActions.classList.remove('hidden');
        status.innerText = '¡Reporte generado con éxito!';

        chrome.storage.local.set({ 
          [`tab_${tab.id}`]: { url: tab.url, markdown: currentMarkdown }
        });
      }
    } catch (err) {
      status.innerText = 'Error: Asegúrate de que la pestaña sea accesible.';
      console.error(err);
    }
  });

  btnCopy.addEventListener('click', () => {
    const originalStatus = status.innerText;
    navigator.clipboard.writeText(currentMarkdown).then(() => {
      status.innerText = '¡Copiado al portapapeles!';
      setTimeout(() => {
        status.innerText = originalStatus;
      }, 2500);
    });
  });

  btnDownload.addEventListener('click', () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: `MKdownSEO-Audit-${new Date().toISOString().slice(0, 10)}.md`,
      saveAs: true
    });
  });
});
