// History list pin buttons logic
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  const { CONST } = GPTPinned;

  function attachHistoryButton(aEl, pinnedIdsOrHrefs) {
    if (!aEl || aEl.querySelector('.' + CONST.HISTORY_BTN_CLASS)) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = CONST.HISTORY_BTN_CLASS;
    if (GPTPinned.storage && GPTPinned.storage.setPinnedState) {
      GPTPinned.storage.setPinnedState(btn, false);
    }
    btn.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!GPTPinned.storage) return;
        const convo = GPTPinned.storage.getConversationFromAnchor(aEl);
        GPTPinned.storage.addToPinned(convo, btn);
      },
      true
    );
    try {
      aEl.appendChild(btn);
    } catch (_) {}
    if (pinnedIdsOrHrefs) {
      const convo = GPTPinned.storage.getConversationFromAnchor(aEl);
      if (pinnedIdsOrHrefs.has(convo.id) || pinnedIdsOrHrefs.has(convo.href))
        GPTPinned.storage.setPinnedState(btn, true);
    }
  }

  function ensureHistoryButtons() {
    if (GPTPinned.styles && GPTPinned.styles.ensure) GPTPinned.styles.ensure();
    const anchors = document.querySelectorAll(CONST.HISTORY_ITEM_SELECTOR);
    chrome.storage.sync.get(['pinnedConversations'], (data) => {
      const list = Array.isArray(data.pinnedConversations) ? data.pinnedConversations : [];
      const set = new Set(list.flatMap((x) => [x.id, x.href].filter(Boolean)));
      anchors.forEach((a) => attachHistoryButton(a, set));
    });
  }

  GPTPinned.history = { ensureHistoryButtons };
})();
