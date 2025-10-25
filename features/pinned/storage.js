// Storage helpers and shared utility functions for Pinned Conversations
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  const { CONST } = GPTPinned;

  function getConversationFromAnchor(aEl) {
    const href = aEl.href || aEl.getAttribute('href') || '';
    const title = (aEl.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 200);
    let id = '';
    try {
      const url = new URL(href, location.origin);
      const m = url.pathname.match(/\/c\/([a-z0-9-]+)/i);
      id = m ? m[1] : url.searchParams.get('conversation_id') || href;
    } catch {
      const m = href.match(/\/c\/([a-z0-9-]+)/i);
      id = m ? m[1] : href;
    }
    return { id, href, title, pinnedAt: Date.now() };
  }

  function setPinnedState(btn, pinned) {
    if (!btn) return;
    if (pinned) {
      btn.classList.add('is-pinned');
      btn.textContent = '✔';
      btn.title = 'Pinned';
    } else {
      btn.classList.remove('is-pinned');
      btn.textContent = '📌';
      btn.title = 'Pin conversation';
    }
  }

  function getPinned(callback) {
    chrome.storage.sync.get(['pinnedConversations'], (data) => {
      const list = Array.isArray(data.pinnedConversations) ? data.pinnedConversations : [];
      callback(list);
    });
  }

  function setPinned(list, cb) {
    chrome.storage.sync.set({ pinnedConversations: list }, cb);
  }

  function addToPinned(convo, btn) {
    chrome.storage.sync.get(['pinnedConversations'], (data) => {
      const list = Array.isArray(data.pinnedConversations) ? data.pinnedConversations : [];
      const exists = list.some(
        (x) => (x.id && convo.id && x.id === convo.id) || x.href === convo.href
      );
      if (!exists) {
        list.push(convo);
        chrome.storage.sync.set({ pinnedConversations: list }, () => setPinnedState(btn, true));
      } else {
        setPinnedState(btn, true);
      }
    });
  }

  function removeFromPinned(item) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['pinnedConversations'], (data) => {
        const list = Array.isArray(data.pinnedConversations) ? data.pinnedConversations : [];
        const filtered = list.filter((x) => {
          const idMatch = item.id && x.id && x.id === item.id;
          const hrefMatch = item.href && x.href && x.href === item.href;
          return !idMatch && !hrefMatch;
        });
        chrome.storage.sync.set({ pinnedConversations: filtered }, () => {
          // Refresh history pin button states
          setTimeout(() => {
            try { GPTPinned.history && GPTPinned.history.ensureHistoryButtons(); } catch (_) {}
          }, 50);
          resolve();
        });
      });
    });
  }

  GPTPinned.storage = {
    getConversationFromAnchor,
    setPinnedState,
    getPinned,
    setPinned,
    addToPinned,
    removeFromPinned,
  };
})();
