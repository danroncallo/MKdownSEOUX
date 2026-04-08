/**
 * MKdownSEO - Service Worker (jaguardluz 2026)
 * 
 * Orchestrator for memory cleanup and navigation events.
 * Manages the lifecycle of the extension and handles tab-specific storage persistence.
 */

// Listener for the extension's installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log('MKdownSEO Extension installed and ready.');
});

/**
 * Listens for tab updates to perform proactive memory cleanup.
 * Clears tab-specific storage if the user reloads the page or navigates to a new URL.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    // If the page is loading or reloading, we clean its specific memory
    const storageKey = `tab_${tabId}`;
    chrome.storage.local.remove([storageKey], () => {
      // Check for potential errors in storage operation
      if (chrome.runtime.lastError) {
        console.warn(`Error clearing memory for tab ${tabId}:`, chrome.runtime.lastError);
      } else {
        console.log(`Memory cleared for tab ${tabId} due to navigation/reload.`);
      }
    });
  }
});

/**
 * Cleanup when a tab is closed.
 * Removes all associated data from local storage for the given tab ID.
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  const storageKey = `tab_${tabId}`;
  chrome.storage.local.remove([storageKey], () => {
    if (chrome.runtime.lastError) {
      console.warn(`Error clearing memory for closed tab ${tabId}:`, chrome.runtime.lastError);
    }
  });
});
