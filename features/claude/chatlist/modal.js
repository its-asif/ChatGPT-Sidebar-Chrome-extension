// Modal overlay logic for Claude chatlist
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});
  const { CONST } = GPTChatlist;
  let DIALOG_LOADING = false;

  function closeDialog() {
    const dialog = document.getElementById(CONST.DIALOG_ID);
    if (dialog) {
      const overlayRoot = dialog.closest('[data-testid="modal-settings"]');
      if (overlayRoot) overlayRoot.remove();
      else dialog.remove();
    }
    document.removeEventListener('keydown', onEsc, true);
  }

  function onEsc(e) { if (e.key === 'Escape') closeDialog(); }

  function getUserMessages() {
    try {
      const nodes = Array.from(document.querySelectorAll(CONST.HISTORY_ITEM_SELECTOR));
      return nodes.map((el, idx) => ({ id: idx + 1, el, title: (el.textContent || '').trim().slice(0, 200) }));
    } catch (_) { return []; }
  }

  function openDialog() {
    if (document.getElementById(CONST.DIALOG_ID) || DIALOG_LOADING) {
      return;
    }
    DIALOG_LOADING = true;
    (GPTChatlist.styles && GPTChatlist.styles.ensure ? GPTChatlist.styles.ensure() : Promise.resolve()).finally(() => {
      const htmlUrl = chrome.runtime.getURL(CONST.MODAL_HTML_PATH);
      fetch(htmlUrl)
        .then((r) => { if (!r.ok) throw new Error('Failed to load modal.html'); return r.text(); })
        .catch(() => `
<div class="absolute inset-0" data-testid="modal-settings" data-ignore-for-page-load="true">
  <div data-state="open" class="fixed inset-0 z-50" style="pointer-events: auto;">
    <div role="dialog" id="${CONST.DIALOG_ID}" data-state="open" tabindex="-1"></div>
  </div>
</div>`)
        .then((html) => {
          const tpl = document.createElement('template');
          tpl.innerHTML = html;
          const overlayRoot = tpl.content.firstElementChild;
          const dialog = overlayRoot.querySelector('#' + CSS.escape(CONST.DIALOG_ID));
          const backdrop = overlayRoot.querySelector('div.fixed.inset-0.z-50');
          if (backdrop) {
            backdrop.addEventListener('click', (e) => { if (dialog && !dialog.contains(e.target)) closeDialog(); }, true);
          }

          const header = document.createElement('div');
          header.className = 'gpt-chatlist-modal-header';

          const title = document.createElement('div');
          title.className = 'gpt-chatlist-modal-title';
          title.textContent = 'Claude Chats';

          const close = document.createElement('button');
          close.className = 'gpt-chatlist-modal-close';
          close.textContent = '×';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', closeDialog);

          header.appendChild(title);
          header.appendChild(close);

          const content = document.createElement('div');
          content.className = 'gpt-chatlist-modal-content';

          const list = document.createElement('div');
          list.className = 'gpt-chatlist-list';
          list.textContent = 'Loading…';
          content.appendChild(list);

          dialog.appendChild(header);
          dialog.appendChild(content);

          document.body.appendChild(overlayRoot);
          setTimeout(() => dialog && dialog.focus(), 0);
          document.addEventListener('keydown', onEsc, true);

          function renderList(items) {
            list.innerHTML = '';
            if (!items || items.length === 0) {
              const empty = document.createElement('div');
              empty.textContent = 'No user messages found on this page.';
              empty.className = 'gpt-chatlist-empty';
              list.appendChild(empty);
              return;
            }
            items.forEach((it) => {
              const row = document.createElement('div');
              row.className = 'gpt-chatlist-row';

              const left = document.createElement('a');
              left.className = 'gpt-chatlist-link';
              left.href = '#';
              left.textContent = it.title || `Message #${it.id}`;
              left.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                try { closeDialog(); } catch (_) {}
                try {
                  const el = it.el;
                  if (!el) return;
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  const clickable = el.closest('a, button, [role="link"], [role="button"]');
                  if (clickable && typeof clickable.click === 'function') clickable.click();
                  else if (typeof el.click === 'function') el.click();
                  el.focus && el.focus();
                } catch (_) {}
              });

              row.appendChild(left);
              list.appendChild(row);
            });
          }

          function reloadList() {
            const items = getUserMessages();
            renderList(items);
          }

          reloadList();
        })
        .finally(() => { DIALOG_LOADING = false; });
    });
  }

  GPTChatlist.modal = { openDialog, closeDialog, onEsc };
})();
