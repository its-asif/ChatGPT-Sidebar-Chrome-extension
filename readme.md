# ChatGPT Sidebar - My Messages

A Chrome extension that extracts and displays your ChatGPT conversation messages in a neat popup sidebar.  
Click on any message to quickly scroll to it in the ChatGPT web interface.

---

## Features

- Extracts only your ChatGPT messages and lists them in a compact popup
- Click any entry to smoothly scroll to that message in the conversation
- Pin conversations: add a pin icon beside each history item and view/remove pins in a modal overlay
- In‑page modal (no new window) for managing pinned conversations
- Customizable color themes: choose from curated palettes (Graphite, Midnight Blue, Indigo Night, Matcha, etc.) or define a custom palette
- Dynamic live updates when you change theme or preferences
- Configurable keyboard shortcut (default: `Ctrl+Shift+M`) to open the popup without clicking the extension icon
- Lightweight, Manifest V3 compliant
- Works on [chatgpt.com](https://chatgpt.com); easily adaptable for other domains

---

## Installation

1. Clone this repo or download the ZIP file.  
2. Open Chrome and go to `chrome://extensions`.  
3. Enable **Developer mode** (top right).  
4. Click **Load unpacked** and select the extension folder.  
5. Visit [chatgpt.com](https://chatgpt.com) and click the extension icon to use it.

---

## Usage

1. Open ChatGPT at [chatgpt.com](https://chatgpt.com).
2. Press the configured shortcut (`Ctrl+Shift+M` by default) or click the extension icon.
3. Browse the list of “You said:” messages; click any to jump to it.
4. Pin a conversation from the ChatGPT sidebar history using the 📌 button; open the “Pinned Conversation” entry to view/delete pins.
5. Open Settings to:
	- Switch among built‑in color palettes or pick “Custom” to set individual colors.
	- Change the popup keyboard shortcut.
	- Toggle whether message indices appear.

---


## Keyboard Shortcut

You can change the popup shortcut in Settings. Shortcut rules:
- Must include at least one modifier (Ctrl / Alt / Shift) + one regular key
- Stored as a string like `Ctrl+Alt+J`

## Pinned Conversations

When enabled, a “Pinned Conversation” button is inserted into the ChatGPT sidebar. Each history item gains a pin icon (📌). Pinned items are stored via `chrome.storage.sync` and can be deleted from the modal without reloading.

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

