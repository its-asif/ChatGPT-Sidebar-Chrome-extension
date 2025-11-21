chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and ready to use.");
});

// Listen for request to programmatically open popup
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.action === 'openExtensionPopup') {
    // MV3 supports chrome.action.openPopup(); fallback to window if fails
    if (chrome.action && chrome.action.openPopup) {
      chrome.action.openPopup().catch(() => {
        try {
          chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: 420,
            height: 600
          });
        } catch (_) {}
      });
    } else {
      try {
        chrome.windows.create({
          url: chrome.runtime.getURL('popup.html'),
          type: 'popup',
          width: 420,
          height: 600
        });
      } catch (_) {}
    }
  }
});
