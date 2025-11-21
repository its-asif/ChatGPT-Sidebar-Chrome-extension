// Listen for request from popup.js to get messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getMessages") {
    const elements = document.querySelectorAll('[data-testid^="conversation-turn-"]');
    const myMessages = [];
    let indx = 1;
    elements.forEach((el, idx) => {
      // check if the element message starts with "You said:"
      if (el.innerText.startsWith("You said:")) {
        let text = el.innerText.replace(/^You said:\s*/, '').split('\n').slice(0, 3).join('\n').trim();
        myMessages.push({ index: idx, text });
      }
    });
    sendResponse({ messages: myMessages });
  }

  if (request.action === "scrollToMessage") {
    const index = request.index;
    const elements = document.querySelectorAll('[data-testid^="conversation-turn-"]');
    const target = elements[index];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

// Keyboard shortcut to open popup (configurable)
let popupShortcut = 'Ctrl+Shift+M';
function loadShortcut() {
  chrome.storage.sync.get(['popupShortcut'], (data) => {
    if (data.popupShortcut) popupShortcut = data.popupShortcut;
  });
}
loadShortcut();
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.popupShortcut) {
    popupShortcut = changes.popupShortcut.newValue || popupShortcut;
  }
});

function matchesShortcut(evt) {
  const parts = [];
  if (evt.ctrlKey) parts.push('Ctrl');
  if (evt.altKey) parts.push('Alt');
  if (evt.shiftKey) parts.push('Shift');
  const key = evt.key.length === 1 ? evt.key.toUpperCase() : evt.key;
  if (!['Control','Shift','Alt','Meta'].includes(key)) parts.push(key);
  return parts.join('+') === popupShortcut;
}

document.addEventListener('keydown', (e) => {
  // Ignore inputs/textareas to not hijack typing
  const target = e.target;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
  if (matchesShortcut(e)) {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: 'openExtensionPopup' });
  }
}, true);

