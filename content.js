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

