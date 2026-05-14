// Listen for request from popup.js to get messages
if (!window.__GPT_MESSAGES_CONTENT_LOADED__) {
  window.__GPT_MESSAGES_CONTENT_LOADED__ = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  function findScrollableParent(node) {
    let current = node && node.parentElement;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const canScroll = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;
      if (canScroll) return current;
      current = current.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function scrollTargetIntoView(target) {
    if (!target) return;

    const scrollParent = findScrollableParent(target);
    const offset = 120;

    if (scrollParent === document.scrollingElement || scrollParent === document.documentElement) {
      const rect = target.getBoundingClientRect();
      const top = window.scrollY + rect.top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return;
    }

    const parentRect = scrollParent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = scrollParent.scrollTop + (targetRect.top - parentRect.top) - offset;
    scrollParent.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  if (request.action === "getMessages") {
    const isClaude = location.host.includes('claude.ai');
    const userSelector = isClaude ? '[data-user-message-bubble="true"]' : '[data-turn="user"]';
    const elements = document.querySelectorAll(userSelector);

    const myMessages = [];
    elements.forEach((el, idx) => {
      const rawText = (el.innerText || el.textContent || '').trim();
      const text = rawText.split('\n').slice(0, 3).join('\n').trim();

      if (text) {
        myMessages.push({ index: idx, text });
      }
    });
    sendResponse({ messages: myMessages });
  }

  if (request.action === "scrollToMessage") {
    const index = request.index;
    const isClaude = location.host.includes('claude.ai');
    const userSelector = isClaude ? '[data-user-message-bubble="true"]' : '[data-turn="user"]';
    const elements = document.querySelectorAll(userSelector);
    const normalizedRequestedText = (request.text || '').trim().toLowerCase();
    let target = elements[index];

    if (!target && normalizedRequestedText) {
      target = Array.from(elements).find((el) => {
        const rawText = (el.innerText || el.textContent || '').trim().toLowerCase();
        return rawText.startsWith(normalizedRequestedText.slice(0, Math.min(normalizedRequestedText.length, 120)));
      });
    }

    if (target) {
      scrollTargetIntoView(target);
    }
  }
});

// Keyboard shortcut to open popup (configurable)
let popupShortcut = 'Ctrl+Shift+A';
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
}

