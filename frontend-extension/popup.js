// Popup script for AI Chat Assistant
// This runs when user clicks the extension icon

document.addEventListener('DOMContentLoaded', () => {
  console.log('AI Chat Assistant popup loaded');
  
  // Check if extension is working
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    const statusElement = document.getElementById('status');
    
    if (url.includes('web.whatsapp.com') || url.includes('linkedin.com')) {
      statusElement.textContent = '✓ Extension Active on this page';
      statusElement.className = 'status active';
    } else {
      statusElement.textContent = '⚠ Open WhatsApp Web or LinkedIn to use';
      statusElement.className = 'status';
    }
  });
});
