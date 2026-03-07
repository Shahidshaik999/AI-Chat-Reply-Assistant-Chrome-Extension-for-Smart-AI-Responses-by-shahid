// Background service worker for AI Chat Assistant
console.log('AI Chat Assistant background service worker started');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed for the first time');
    chrome.storage.sync.set({
      enabled: true,
      apiUrl: 'http://localhost:8000'
    });
  }
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
  
  try {
    // First, try to send message to existing content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'analyzeChat' });
      console.log('Content script response:', response);
    } catch (error) {
      // Content script not loaded, inject it first
      console.log('Content script not found, injecting...');
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js']
      });
      
      // Wait a bit for script to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Now send the message
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'analyzeChat' });
      console.log('Content script response:', response);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

console.log('Background worker ready');
