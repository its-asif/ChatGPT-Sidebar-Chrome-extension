// Listen for request from popup.js to get messages
if (!window.__GPT_MESSAGES_CONTENT_LOADED__) {
  window.__GPT_MESSAGES_CONTENT_LOADED__ = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const isClaude = location.host.includes('claude.ai');
  const isGemini = location.host.includes('gemini.google.com') || location.host.includes('gemini.google');
  const isChatGPT = location.host.includes('chat') && (location.host.includes('openai') || location.host.includes('chatgpt'));

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
    const isGemini = location.host.includes('gemini.google.com') || location.host.includes('gemini.google');
    const userSelector = isClaude ? '[data-user-message-bubble="true"]' : (isGemini ? 'user-query' : '[data-turn="user"]');
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
    const isGemini = location.host.includes('gemini.google.com') || location.host.includes('gemini.google');
    const userSelector = isClaude ? '[data-user-message-bubble="true"]' : (isGemini ? 'user-query' : '[data-turn="user"]');
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

  if (request.action === 'pasteMessages') {
    const messages = Array.isArray(request.messages) ? request.messages : [];
    const mode = request.mode || 'all';

    function escapeHtml(s) {
      return (s + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    if (!messages.length) {
      sendResponse({ success: false, error: 'no messages' });
      return;
    }

    // Helper sleep
    function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

    function getGeminiEditor() {
      return document.querySelector('div.ql-editor') || document.querySelector('div[aria-label="Enter a prompt for Gemini"]');
    }

    function getGeminiSendButton() {
      return document.querySelector('button[aria-label="Send message"]') || document.querySelector('button[aria-label="Send"]');
    }

    function getClaudeEditor() {
      return document.querySelector('[data-testid="chat-input"]') || document.querySelector('[data-test="composer-input"]') || document.querySelector('div.ProseMirror[contenteditable="true"]') || document.querySelector('div[contenteditable="true"][role="textbox"]');
    }

    function getClaudeSendButton() {
      return document.querySelector('button[aria-label*="Send"]') || document.querySelector('button[aria-label="Send"]') || document.querySelector('button[type="submit"]');
    }

    function getClaudeStopButton() {
      return document.querySelector('button[aria-label*="Stop"]');
    }

    function isClaudeBusy() {
      return Boolean(getClaudeStopButton());
    }

    function isGeminiBusy() {
      const sendBtn = getGeminiSendButton();
      const stopBtn = document.querySelector('button[aria-label="Stop generating"]');
      return Boolean(stopBtn) || Boolean(sendBtn && (sendBtn.disabled || sendBtn.classList.contains('disabled') || sendBtn.hasAttribute('disabled')));
    }

    function waitUntil(predicate, timeoutMs = 120000, intervalMs = 250) {
      return new Promise((resolve) => {
        const startedAt = Date.now();
        const timer = setInterval(() => {
          if (predicate()) {
            clearInterval(timer);
            resolve(true);
            return;
          }
          if (Date.now() - startedAt >= timeoutMs) {
            clearInterval(timer);
            resolve(false);
          }
        }, intervalMs);
      });
    }

    // Gemini one-by-one mode
    if (mode === 'one' && isClaude) {
      (async () => {
        try {
          const editor = getClaudeEditor();
          if (!editor) {
            sendResponse({ success: false, error: 'claude editor not found' });
            return;
          }

          async function waitForClaudeGenerationStart() {
            await waitUntil(() => getClaudeStopButton(), 15000, 300);
          }

          async function waitForClaudeGenerationFinish() {
            await waitUntil(() => !getClaudeStopButton(), 120000, 2000);
            await sleep(1500);
          }

          async function typeAndSendPrompt(text) {
            editor.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, text);
            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
            await sleep(400);
            
            const sendBtn = getClaudeSendButton();
            if (sendBtn && !sendBtn.disabled && !sendBtn.classList.contains('disabled')) {
              sendBtn.click();
            } else {
              editor.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                which: 13,
                keyCode: 13,
                charCode: 13,
                bubbles: true,
                cancelable: true
              }));
              editor.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                which: 13,
                keyCode: 13,
                charCode: 13,
                bubbles: true,
                cancelable: true
              }));
            }
          }

          for (let i = 0; i < messages.length; i += 1) {
            const text = messages[i];
            await typeAndSendPrompt(text);
            if (i < messages.length - 1) {
              await waitForClaudeGenerationStart();
              await waitForClaudeGenerationFinish();
            }
          }

          sendResponse({ success: true });
        } catch (err) {
          console.warn('claude paste one-by-one failed', err);
          sendResponse({ success: false, error: String(err) });
        }
      })();
      return true;
    }

    if (mode === 'one' && isChatGPT) {
      (async () => {
        try {
          const editor = document.querySelector('#prompt-textarea') || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]');
          if (!editor) {
            sendResponse({ success: false, error: 'chatgpt editor not found' });
            return;
          }

          function getChatGPTStopButton() {
            return document.querySelector('button[aria-label="Stop streaming"]') || document.querySelector('button[data-testid="stop-button"]') || document.querySelector('button[aria-label="Stop generating"]');
          }

          function waitUntil(predicate, timeoutMs = 120000, intervalMs = 250) {
            return new Promise((resolve) => {
              const startedAt = Date.now();
              const timer = setInterval(() => {
                if (predicate()) {
                  clearInterval(timer);
                  resolve(true);
                  return;
                }
                if (Date.now() - startedAt >= timeoutMs) {
                  clearInterval(timer);
                  resolve(false);
                }
              }, intervalMs);
            });
          }

          function typePrompt(text) {
            editor.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, text);
            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
          }

          async function waitForGenerationToFinish() {
            await waitUntil(() => !getChatGPTStopButton(), 120000, 2000);
          }

          async function sendPrompt(text) {
            typePrompt(text);
            await sleep(500);
            editor.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              which: 13,
              keyCode: 13,
              bubbles: true
            }));
          }

          for (let i = 0; i < messages.length; i += 1) {
            const text = messages[i];
            await sendPrompt(text);
            await sleep(1500);
            if (i < messages.length - 1) {
              await waitForGenerationToFinish();
              await sleep(1200);
            }
          }

          sendResponse({ success: true });
        } catch (err) {
          console.warn('chatgpt paste one-by-one failed', err);
          sendResponse({ success: false, error: String(err) });
        }
      })();
      return true;
    }

    if (mode === 'one' && isGemini) {
      // Return true to indicate we'll call sendResponse asynchronously
      (async () => {
        try {
          const editor = getGeminiEditor();
          if (!editor) {
            sendResponse({ success: false, error: 'gemini editor not found' });
            return;
          }

          for (let i = 0; i < messages.length; i += 1) {
            const text = messages[i];
            editor.focus();
            editor.innerHTML = `<p>${escapeHtml(text)}</p>`;
            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));

            // small delay for UI to recognize content
            await sleep(500);

            await waitUntil(() => {
              const sendBtn = getGeminiSendButton();
              return Boolean(sendBtn && !sendBtn.disabled && !sendBtn.classList.contains('disabled') && !sendBtn.hasAttribute('disabled'));
            }, 10000, 200);

            const currentSendBtn = getGeminiSendButton();
            if (currentSendBtn) currentSendBtn.click();

            // wait for response generation to finish before moving to the next message
            if (i < messages.length - 1) {
              await waitUntil(() => !isGeminiBusy(), 120000, 300);
              await sleep(900);
            }
          }

          sendResponse({ success: true });
        } catch (err) {
          console.warn('paste one-by-one failed', err);
          sendResponse({ success: false, error: String(err) });
        }
      })();
      return true;
    }

    try {
      if (isChatGPT) {
        const input = document.querySelector('#prompt-textarea') || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]');
        if (input) {
          input.focus();
          const html = messages.map(m => `<p>${escapeHtml(m)}</p>`).join('');
          input.innerHTML = html;
          input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: messages.join('\n\n') }));

          const sendCandidates = [
            'form button[type="submit"]',
            'button[aria-label="Send"]',
            'button[aria-label="Send message"]',
            'button[aria-label="Send reply"]'
          ];
          let clicked = false;
          for (const sel of sendCandidates) {
            const btn = document.querySelector(sel);
            if (btn && !btn.disabled && btn.offsetParent !== null) {
              btn.click();
              clicked = true;
              break;
            }
          }

          if (!clicked) {
            // fallback: dispatch Enter key
            const evt = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
            input.dispatchEvent(evt);
          }
          sendResponse({ success: true });
          return;
        }
      }

      if (isGemini) {
        const input = document.querySelector('div.ql-editor') || document.querySelector('div[aria-label="Enter a prompt for Gemini"]');
        if (input) {
          input.focus();
          const html = messages.map(m => `<p>${escapeHtml(m)}</p>`).join('');
          input.innerHTML = html;
          input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: messages.join('\n\n') }));
          const sendBtn = document.querySelector('button[aria-label="Send message"]');
          if (sendBtn) sendBtn.click();
          sendResponse({ success: true });
          return;
        }
      }

      if (isClaude) {
        // Generic attempt for Claude: find a contenteditable textbox
        const input = document.querySelector('[data-test="composer-input"]') || document.querySelector('div[contenteditable="true"][role="textbox"]');
        if (input) {
          input.focus();
          const html = messages.map(m => `<p>${escapeHtml(m)}</p>`).join('');
          input.innerHTML = html;
          input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: messages.join('\n\n') }));
          const sendBtn = document.querySelector('button[aria-label="Send"]') || document.querySelector('button[type="submit"]');
          if (sendBtn) sendBtn.click();
          sendResponse({ success: true });
          return;
        }
      }

      // Generic fallback: try to find any editable and send button
      const genericInput = document.querySelector('div[contenteditable="true"][role="textbox"]') || document.querySelector('textarea, input[type="text"]');
      if (genericInput) {
        genericInput.focus();
        const html = messages.map(m => `<p>${escapeHtml(m)}</p>`).join('');
        if (genericInput.isContentEditable) {
          genericInput.innerHTML = html;
          genericInput.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: messages.join('\n\n') }));
        } else {
          genericInput.value = messages.join('\n\n');
          genericInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const sendBtn = document.querySelector('button[aria-label="Send message"]') || document.querySelector('button[aria-label="Send"]') || document.querySelector('form button[type="submit"]');
        if (sendBtn) sendBtn.click();
        sendResponse({ success: true });
        return;
      }
    } catch (err) {
      console.warn('pasteMessages failed', err);
      sendResponse({ success: false, error: String(err) });
      return;
    }

    sendResponse({ success: false, error: 'no target input found' });
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

