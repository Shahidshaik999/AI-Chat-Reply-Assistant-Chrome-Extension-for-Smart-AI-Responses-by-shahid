// AI Chat Reply Assistant - Content Script (Manual Mode)
console.log("AI Chat Assistant initialized - Manual mode");

const API_URL = 'http://localhost:8000/generate-reply';
let suggestionsContainer = null;

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeChat') {
    console.log('Analyzing current chat...');
    analyzeCurrentChat();
    sendResponse({ status: 'analyzing' });
  }
  return true;
});

// Analyze the current chat
function analyzeCurrentChat() {
  const hostname = window.location.hostname;
  
  if (hostname === 'web.whatsapp.com') {
    analyzeWhatsApp();
  } else if (hostname === 'www.linkedin.com') {
    analyzeLinkedIn();
  } else {
    console.log('Not on supported platform');
  }
}

// Analyze WhatsApp chat
function analyzeWhatsApp() {
  console.log('Analyzing WhatsApp chat...');
  
  const messages = document.querySelectorAll('[data-testid="msg-container"]');
  
  if (messages.length === 0) {
    console.log('No messages found');
    showError('No messages found in current chat');
    return;
  }
  
  // Get the last incoming message
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const isIncoming = message.querySelector('.message-in') !== null;
    
    if (isIncoming) {
      const textElement = message.querySelector('.copyable-text span.selectable-text');
      if (textElement) {
        const messageText = textElement.innerText.trim();
        console.log('Found message:', messageText.substring(0, 100));
        sendToBackend(messageText, 'whatsapp');
        return;
      }
    }
  }
  
  console.log('No incoming messages found');
  showError('No incoming messages found');
}

// Analyze LinkedIn chat
function analyzeLinkedIn() {
  console.log('Analyzing LinkedIn chat...');
  
  // Try multiple selectors
  let messages = document.querySelectorAll('.msg-s-event-listitem__message-bubble');
  console.log('Selector 1 (.msg-s-event-listitem__message-bubble):', messages.length);
  
  if (messages.length === 0) {
    messages = document.querySelectorAll('.msg-s-message-list__event');
    console.log('Selector 2 (.msg-s-message-list__event):', messages.length);
  }
  
  if (messages.length === 0) {
    messages = document.querySelectorAll('[data-event-urn]');
    console.log('Selector 3 ([data-event-urn]):', messages.length);
  }
  
  if (messages.length === 0) {
    messages = document.querySelectorAll('.msg-s-event-listitem');
    console.log('Selector 4 (.msg-s-event-listitem):', messages.length);
  }
  
  if (messages.length === 0) {
    console.log('No messages found with any selector');
    showError('No messages found. Make sure a chat is open.');
    return;
  }
  
  console.log('Found', messages.length, 'messages');
  
  // Get the last message
  const lastMessage = messages[messages.length - 1];
  let messageText = lastMessage.innerText.trim();
  
  console.log('Raw message text:', messageText.substring(0, 200));
  
  // Truncate if too long
  if (messageText.length > 2000) {
    messageText = messageText.substring(0, 2000) + '...';
  }
  
  if (messageText === '') {
    console.log('Message text is empty');
    showError('Could not extract message text');
    return;
  }
  
  console.log('Sending message to backend');
  sendToBackend(messageText, 'linkedin');
}

// Send message to backend
async function sendToBackend(message, platform) {
  try {
    console.log('Sending to backend...');
    console.log('Message length:', message.length);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        platform: platform
      })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Suggestions received:', data.suggestions);
    
    displaySuggestions(data.suggestions, platform);
    
  } catch (error) {
    console.error('Backend error:', error);
    showError('Could not connect to AI service. Check console for details.');
  }
}

// Display suggestions UI
function displaySuggestions(suggestions, platform) {
  // Remove existing
  if (suggestionsContainer) {
    suggestionsContainer.remove();
  }
  
  // Create container
  suggestionsContainer = document.createElement('div');
  suggestionsContainer.className = 'ai-suggestions-container';
  
  // Title
  const title = document.createElement('div');
  title.className = 'ai-suggestions-title';
  title.textContent = '✨ AI Reply Suggestions';
  suggestionsContainer.appendChild(title);
  
  // Suggestion buttons
  suggestions.forEach((suggestion) => {
    const button = document.createElement('button');
    button.className = 'ai-suggestion-btn';
    button.textContent = suggestion;
    button.onclick = () => insertText(suggestion, platform);
    suggestionsContainer.appendChild(button);
  });
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ai-suggestions-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => suggestionsContainer.remove();
  suggestionsContainer.appendChild(closeBtn);
  
  document.body.appendChild(suggestionsContainer);
  console.log('Suggestions displayed');
}

// Show error message
function showError(message) {
  if (suggestionsContainer) {
    suggestionsContainer.remove();
  }
  
  suggestionsContainer = document.createElement('div');
  suggestionsContainer.className = 'ai-suggestions-container';
  
  const title = document.createElement('div');
  title.className = 'ai-suggestions-title';
  title.textContent = '⚠️ ' + message;
  title.style.color = '#ff6b6b';
  suggestionsContainer.appendChild(title);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ai-suggestions-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => suggestionsContainer.remove();
  suggestionsContainer.appendChild(closeBtn);
  
  document.body.appendChild(suggestionsContainer);
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    if (suggestionsContainer) {
      suggestionsContainer.remove();
    }
  }, 3000);
}

// Insert text into chat input
function insertText(text, platform) {
  try {
    let inputBox;
    
    if (platform === 'whatsapp') {
      inputBox = document.querySelector('[data-testid="conversation-compose-box-input"]');
    } else if (platform === 'linkedin') {
      inputBox = document.querySelector('.msg-form__contenteditable');
    }
    
    if (!inputBox) {
      console.error('Input box not found');
      return;
    }
    
    inputBox.focus();
    inputBox.innerHTML = '';
    
    const p = document.createElement('p');
    p.textContent = text;
    inputBox.appendChild(p);
    
    inputBox.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log('Text inserted');
    
    if (suggestionsContainer) {
      suggestionsContainer.remove();
    }
  } catch (error) {
    console.error('Error inserting text:', error);
  }
}

console.log('Ready! Click the extension icon to analyze current chat.');
