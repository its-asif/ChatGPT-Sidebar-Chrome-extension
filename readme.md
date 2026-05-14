# ChatBot Pinboard - My Messages

A Chrome extension that extracts and displays your messages from ChatGPT, Claude, and Gemini in a neat popup sidebar.  
Click on any message to quickly scroll to it in the corresponding web interface.

**Version:** 2.0.0

---

## Features

### Message Browsing & Navigation
- Extracts your messages from ChatGPT, Claude, and Gemini and lists them in a compact popup
- Click any entry to smoothly scroll to that message in the conversation
- Pin ChatGPT conversations: add a pin icon beside each history item and view/remove pins in a modal overlay
- In-page modal (no new window) for managing pinned conversations

### Copy & Paste Messages ✨
- **Copy:** Extract all messages from the current conversation
- **Paste All:** Paste all copied messages into another AI chat at once and send them
- **Paste One-by-One:** Send each message sequentially, waiting for the AI's response before sending the next one
- Works across ChatGPT, Claude, and Gemini
- Enable/disable the feature via Settings toggle
- All messages stored in extension storage (not synced to cloud)

### Customization
- Customizable color themes: choose from curated palettes (Graphite, Midnight Blue, Indigo Night, Matcha, etc.) or define a custom palette
- Dynamic live updates when you change theme or preferences
- Configurable keyboard shortcut (default: `Ctrl+Shift+A`) to open the popup without clicking the extension icon

### Platform Support
- Lightweight, Manifest V3 compliant
- Works on [chatgpt.com](https://chatgpt.com), [claude.ai](https://claude.ai), and [gemini.google.com](https://gemini.google.com)

---

## Installation

1. Clone this repo or download the ZIP file.  
2. Open Chrome and go to `chrome://extensions`.  
3. Enable **Developer mode** (top right).  
4. Click **Load unpacked** and select the extension folder.  
5. Visit [chatgpt.com](https://chatgpt.com), [claude.ai](https://claude.ai), or [gemini.google.com](https://gemini.google.com) and click the extension icon to use it.

---

## Usage

1. Open ChatGPT, Claude, or Gemini in your browser.
2. Press the configured shortcut (`Ctrl+Shift+A` by default) or click the extension icon.
3. Browse the list of messages; click any entry to jump to it.
4. On ChatGPT, pin a conversation from the sidebar history using the 📌 button; open the “Pinned Conversation” entry to view/delete pins.
5. Open Settings to:
	- Switch among built‑in color palettes or pick “Custom” to set individual colors.
	- Change the popup keyboard shortcut.
	- Toggle whether message indices appear.
	- Enable/disable the copy/paste message feature.

### Copy & Paste Messages

#### Basic Workflow

1. **Copy:** On the source AI chat (ChatGPT, Claude, or Gemini), open the extension popup and click the **Copy** button. Your messages are now stored in the extension.
2. **Paste All:** Switch to the target AI chat, open the popup, and click **Paste All** to paste all messages at once and auto-send them.
3. **Paste One-by-One:** Click **Paste One-by-One** to send each message individually, waiting for the AI's response between each message (useful for maintaining conversation context).

#### Supported Platforms

- **ChatGPT:** Targets the `#prompt-textarea` input, detects the stop button to know when generation finishes.
- **Claude:** Uses `[data-testid="chat-input"]` for the message input, watches for the stop button to detect generation completion.
- **Gemini:** Targets `div.ql-editor`, monitors the send button state to detect when ready for the next message.

#### Tips

- Messages are stored locally in the extension; they are not synced across devices.
- When using "Paste One-by-One", the extension waits for the AI to generate a response before sending the next message (typically 30–120 seconds depending on response length).
- You can disable the copy/paste buttons in Settings if you prefer a cleaner popup.
---


## Keyboard Shortcut

You can change the popup shortcut in Settings. Shortcut rules:
- Must include at least one modifier (Ctrl / Alt / Shift) + one regular key
- Stored as a string like `Ctrl+Alt+J`

## Pinned Conversations

When enabled, a “Pinned Conversation” button is inserted into the ChatGPT sidebar. Each history item gains a pin icon (📌). Pinned items are stored via `chrome.storage.sync` and can be deleted from the modal without reloading.

## Claude & Gemini

Claude and Gemini use a lightweight chatlist sidebar entry that opens an in-page modal with your message history. Both features share the same jump-to-message behavior as the ChatGPT popup, but they do not use the ChatGPT pinning flow.

## Themes & Palettes

Available curated palettes include (examples):

| Palette | Background | Message/Button | Text |
|---------|------------|----------------|------|
| Graphite Calm | #121212 | #2D2D2D | #E5E5E5 |
| Midnight Blue Soft | #0D1117 | #21262D | #C9D1D9 |
| Indigo Night | #0A0F24 | #1B2A41 | #E8ECF7 |
| Matcha Green Minimal | #F6F8F5 | #8AA77B | #3B4636 |
| Classic Dark | #111111 | #FFFFFF | #111111 |

Select “Custom Palette” to reveal color pickers for granular control.

## How It Works (GIF)

![Usage Demo](./screenshots/howto.gif)

*Click the extension icon, browse messages in the popup, and click a message to scroll to it on the page.*


---

*Developed by Asif Hossain — Full Stack Developer*

