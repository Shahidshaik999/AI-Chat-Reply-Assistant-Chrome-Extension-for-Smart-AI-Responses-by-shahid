# 🤖 AI Chat Reply Assistant

A Chrome Extension that generates smart AI-powered reply suggestions for WhatsApp Web and LinkedIn messages using Groq's Llama 3.1 model.


## 🎯 Overview

This project is a Chrome Extension that helps users communicate better by providing AI-generated reply suggestions for chat messages on WhatsApp Web and LinkedIn. It uses a FastAPI backend connected to Groq's Llama 3.1-8b-instant model to generate contextually appropriate responses.

**Key Benefit:** Helps users reply professionally, improve their English, and save time crafting responses.

---

## ✨ Features

- ✅ **Manual Activation** - Click extension icon to analyze current chat
- ✅ **AI-Powered Suggestions** - Generates 3 smart reply options
- ✅ **Multi-Platform Support** - Works on WhatsApp Web and LinkedIn
- ✅ **One-Click Insertion** - Click a suggestion to insert it into the chat input
- ✅ **No Auto-Sending** - User maintains full control over when to send
- ✅ **Fast Response** - Uses Groq's ultra-fast inference
- ✅ **Privacy-Focused** - Messages only sent to AI for processing, not stored

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│  (WhatsApp Web / LinkedIn)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 1. User clicks extension icon
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Chrome Extension (Frontend)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  background.js                                        │  │
│  │  - Listens for icon clicks                           │  │
│  │  - Injects content script if needed                  │  │
│  │  - Sends message to content script                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     │ 2. Triggers analysis                   │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  contentScript.js                                     │  │
│  │  - Detects platform (WhatsApp/LinkedIn)             │  │
│  │  - Extracts last message from chat                   │  │
│  │  - Sends to backend API                              │  │
│  │  - Displays suggestions UI                           │  │
│  │  - Inserts selected text into input                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 3. POST /generate-reply
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  main.py                                              │  │
│  │  - Receives message                                   │  │
│  │  - Validates input                                    │  │
│  │  - Calls AI service                                   │  │
│  │  - Returns suggestions                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                     │                                        │
│                     │ 4. Generate suggestions                │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ai_service.py                                        │  │
│  │  - Connects to Groq API                              │  │
│  │  - Sends prompt to Llama 3.1                         │  │
│  │  - Parses AI response                                │  │
│  │  - Returns 3 suggestions                             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ 5. AI inference
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Groq API (Llama 3.1-8b-instant)                │
│  - Ultra-fast AI inference                                   │
│  - Generates contextual replies                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ai-chat-assistant/
│
├── frontend-extension/              # Chrome Extension
│   ├── manifest.json               # Extension configuration (Manifest V3)
│   ├── background.js               # Service worker (handles icon clicks)
│   ├── contentScript.js            # Main logic (message detection & UI)
│   ├── popup.html                  # Extension popup (not used in v2.0+)
│   ├── popup.js                    # Popup logic
│   ├── styles.css                  # UI styling (gradient design)
│   └── icons/                      # Extension icons (placeholder)
│
└── backend-api/                    # Python FastAPI Backend
    ├── main.py                     # API endpoints & request handling
    ├── ai_service.py               # Groq AI integration
    ├── requirements.txt            # Python dependencies
    ├── .env                        # Environment variables (API key)
    ├── .env.example                # Template for .env
    ├── setup.bat                   # Windows setup script
    ├── start.bat                   # Windows start script
    └── test_api.py                 # API testing script
```

---

## 🚀 Installation

### Prerequisites

- Python 3.8+
- Google Chrome browser
- Groq API key (free at https://console.groq.com/keys)

### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd ai-chat-assistant/backend-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_actual_api_key_here

# Start the server
python main.py
```

The backend will start at `http://localhost:8000`

### Step 2: Extension Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Navigate to and select `ai-chat-assistant/frontend-extension`
5. The extension icon should appear in your toolbar

---

## 📖 Usage

### How to Use

1. **Start the backend server** (if not already running)
   ```bash
   cd backend-api
   venv\Scripts\activate
   python main.py
   ```

2. **Open WhatsApp Web or LinkedIn**
   - WhatsApp: https://web.whatsapp.com
   - LinkedIn: https://www.linkedin.com/messaging/

3. **Open a chat conversation**
   - Make sure there's at least one message in the chat

4. **Click the extension icon** in Chrome toolbar
   - The extension will analyze the last message
   - AI suggestions will appear in bottom-right corner

5. **Click a suggestion** to insert it into the chat input

6. **Review and send** manually (press Enter or click Send)

### Example Workflow

```
1. Receive message: "Can you send me the report by tomorrow?"
2. Click extension icon
3. AI generates:
   - "Sure, I'll send it first thing tomorrow morning!"
   - "Yes, I'll have it ready for you by end of day."
   - "Absolutely, I'll email it to you tomorrow."
4. Click your preferred suggestion
5. Text appears in input box
6. Press Enter to send
```

---

## 🔧 How It Works

### 1. Extension Icon Click

When you click the extension icon:
- `background.js` receives the click event
- Checks if content script is loaded
- If not, injects `contentScript.js` into the page
- Sends `analyzeChat` message to content script

### 2. Message Detection

`contentScript.js` analyzes the current chat:

**For WhatsApp:**
```javascript
// Finds all message containers
const messages = document.querySelectorAll('[data-testid="msg-container"]');

// Gets the last incoming message
const lastMessage = messages[messages.length - 1];
const isIncoming = lastMessage.querySelector('.message-in') !== null;

// Extracts text
const messageText = textElement.innerText.trim();
```

**For LinkedIn:**
```javascript
// Tries multiple selectors (LinkedIn's DOM varies)
const messages = document.querySelectorAll('.msg-s-event-listitem__message-bubble');
// Falls back to other selectors if needed
```

### 3. Backend API Call

```javascript
// POST request to backend
const response = await fetch('http://localhost:8000/generate-reply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: messageText,
    platform: 'whatsapp' // or 'linkedin'
  })
});
```
### Screenshot
<img width="527" height="337" alt="image" src="https://github.com/user-attachments/assets/a70e0cb6-a86a-43c6-8a75-a4bc8ce0fbf4" />
<img width="528" height="583" alt="image" src="https://github.com/user-attachments/assets/966a510c-4cd7-4654-87af-bcea57098563" />
<img width="1202" height="611" alt="image" src="https://github.com/user-attachments/assets/477c19d6-b657-421f-a5cc-c1a594e63ea8" />
<img width="528" height="583" alt="image" src="https://github.com/user-attachments/assets/9a7bb00a-dc7d-47a5-9f3a-e65f817ad3bf" />




### 4. AI Processing

**Backend (`main.py`):**
- Validates message (not empty, max 5000 chars)
- Calls `ai_service.generate_suggestions()`

**AI Service (`ai_service.py`):**
```python
# Creates prompt
prompt = f"""Generate exactly 3 short reply suggestions for the following message.

Rules:
1. Each reply must be SHORT (maximum 15 words)
2. Grammatically correct
3. Natural, conversational language
4. Polite and friendly
5. Vary the tone: professional, casual, neutral

Message: "{message}"

Generate 3 reply suggestions:"""

# Calls Groq API
response = self.client.chat.completions.create(
    messages=[
        {"role": "system", "content": "You are a helpful assistant..."},
        {"role": "user", "content": prompt}
    ],
    model="llama-3.1-8b-instant",
    temperature=0.7,
    max_tokens=200
)

# Parses and returns suggestions
```

### 5. Display Suggestions

```javascript
// Creates floating UI
suggestionsContainer = document.createElement('div');
suggestionsContainer.className = 'ai-suggestions-container';

// Adds suggestion buttons
suggestions.forEach((suggestion) => {
  const button = document.createElement('button');
  button.textContent = suggestion;
  button.onclick = () => insertText(suggestion, platform);
  suggestionsContainer.appendChild(button);
});

// Adds to page
document.body.appendChild(suggestionsContainer);
```

### 6. Text Insertion

```javascript
// Finds input box
const inputBox = document.querySelector('[data-testid="conversation-compose-box-input"]');

// Inserts text
inputBox.innerHTML = '';
const p = document.createElement('p');
p.textContent = text;
inputBox.appendChild(p);

// Triggers input event so platform recognizes the change
inputBox.dispatchEvent(new Event('input', { bubbles: true }));
```

---

## 🛠️ Technologies Used

### Frontend (Chrome Extension)

- **JavaScript** - Core programming language
- **Chrome Extension API** - Browser integration
  - `chrome.action` - Icon click handling
  - `chrome.tabs` - Tab communication
  - `chrome.scripting` - Dynamic script injection
  - `chrome.runtime` - Message passing
- **DOM Manipulation** - Message detection and text insertion
- **Fetch API** - Backend communication
- **CSS** - UI styling with gradient design

### Backend (Python)

- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Groq SDK** - AI API client
- **Pydantic** - Data validation
- **python-dotenv** - Environment variable management

### AI

- **Groq** - Ultra-fast AI inference platform
- **Llama 3.1-8b-instant** - Language model
- **Prompt Engineering** - Optimized prompts for quality suggestions

---

## 📚 Development Journey

### Phase 1: Initial Setup
- Created project structure
- Set up FastAPI backend
- Integrated Groq API
- Created basic Chrome extension

### Phase 2: Message Detection
- Implemented WhatsApp message detection using DOM selectors
- Added LinkedIn support
- Used MutationObserver for real-time detection

### Phase 3: Infinite Loop Issues
- **Problem:** MutationObserver triggered infinitely
- **Solution:** 
  - Added debounce (3-second delay)
  - Tracked last processed message
  - Added processing lock
  - Filtered out extension's own UI mutations

### Phase 4: Background Service Worker Errors
- **Problem:** `chrome.action.onClicked` undefined when popup defined
- **Solution:** Removed `default_popup` from manifest
- **Problem:** Service worker registration failed
- **Solution:** Removed `chrome.contextMenus` API (no permission)

### Phase 5: Manual Activation Mode
- **Problem:** Automatic detection caused performance issues
- **Solution:** Changed to manual mode
  - User clicks icon to analyze chat
  - No MutationObserver
  - No infinite loops
  - Better performance

### Phase 6: Content Script Injection
- **Problem:** "Could not establish connection" error
- **Solution:** Background script now injects content script if not loaded
- Added fallback mechanism

### Phase 7: LinkedIn Selector Issues
- **Problem:** LinkedIn DOM structure varies
- **Solution:** Added multiple fallback selectors
- Added detailed logging for debugging

### Phase 8: Message Length Limits
- **Problem:** Long LinkedIn messages rejected (400 error)
- **Solution:** 
  - Increased backend limit to 5000 chars
  - Added truncation in content script (2000 chars)

---

## 🐛 Troubleshooting

### Backend Issues

**Server won't start:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt

# Check if port 8000 is available
netstat -ano | findstr :8000
```

**API key error:**
```bash
# Verify .env file exists
# Check GROQ_API_KEY is set correctly
# No extra spaces or quotes
```

### Extension Issues

**Extension won't load:**
- Check `chrome://extensions/` for errors
- Verify all files exist in `frontend-extension/`
- Try removing and re-adding extension

**No suggestions appearing:**
- Check backend is running: http://localhost:8000/health
- Open browser console (F12) for errors
- Make sure you're on WhatsApp Web or LinkedIn
- Ensure a chat is open with messages

**"No messages found" error:**
- Make sure a chat conversation is open
- Check console logs to see which selectors are being tried
- LinkedIn's DOM may have changed - check for updates

**Text won't insert:**
- WhatsApp/LinkedIn may have updated their DOM
- Check console for errors
- Try clicking the input box first

---

## 🔮 Future Enhancements

### Planned Features

1. **Tone Selector**
   - Professional mode
   - Casual mode
   - Friendly mode
   - Custom tone

2. **Multi-Language Support**
   - Detect message language
   - Generate replies in same language
   - Language selector

3. **Context Awareness**
   - Remember conversation history
   - Generate more contextual replies
   - Better conversation flow

4. **Custom Templates**
   - Save favorite replies
   - Quick access templates
   - Template management

5. **More Platforms**
   - Telegram Web
   - Slack
   - Discord
   - Microsoft Teams

6. **Advanced Features**
   - Grammar correction mode
   - Message summarization
   - Translation
   - Sentiment analysis

7. **User Accounts**
   - Save preferences
   - Sync across devices
   - Usage analytics

---

## 📄 API Documentation

### POST /generate-reply

Generate AI reply suggestions for a message.

**Request:**
```json
{
  "message": "Can you send me the report by tomorrow?",
  "platform": "whatsapp"
}
```

**Response:**
```json
{
  "suggestions": [
    "Sure, I'll send it first thing tomorrow morning!",
    "Yes, I'll have it ready for you by end of day.",
    "Absolutely, I'll email it to you tomorrow."
  ],
  "original_message": "Can you send me the report by tomorrow?"
}
```

**Error Responses:**
- `400` - Message empty or too long (max 5000 chars)
- `500` - AI service error

### GET /health

Check if backend is running.

**Response:**
```json
{
  "status": "healthy"
}
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## ⚠️ Disclaimer

This extension is for educational and productivity purposes. Always review AI-generated suggestions before sending. The extension does not store your messages - they are only sent to the AI service for generating suggestions.

---



---

**Made with ❤️ for better communication**

*Version 2.0.3 - Manual Activation Mode*
