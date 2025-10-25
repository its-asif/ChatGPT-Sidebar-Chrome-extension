// Modal overlay logic for Pinned Conversations
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  const { CONST } = GPTPinned;
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

  function onEsc(e) {
    if (e.key === 'Escape') closeDialog();
  }

  function openDialog() {
    if (document.getElementById(CONST.DIALOG_ID) || DIALOG_LOADING) return; // no duplicates
    DIALOG_LOADING = true;
    (GPTPinned.styles && GPTPinned.styles.ensure ? GPTPinned.styles.ensure() : Promise.resolve()).finally(() => {
      const htmlUrl = chrome.runtime.getURL(CONST.MODAL_HTML_PATH);
      fetch(htmlUrl)
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load modal.html');
          return r.text();
        })
        .catch((err) => {
          console.warn('[Pinned] modal.html fetch failed, using inline template:', err);
          return `
<div class="absolute inset-0" data-testid="modal-settings" data-ignore-for-page-load="true">
  <div data-state="open" class="fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0" style="pointer-events: auto;">
    <div class="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,0.8fr)_auto_minmax(20px,1fr)]">
      <div role="dialog" id="${CONST.DIALOG_ID}" data-state="open" class="popover bg-token-bg-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-long flex flex-col focus:outline-hidden overflow-hidden max-h-[85vh] max-md:min-h-[60vh] md:h-[600px] md:max-w-[680px]" tabindex="-1" style="pointer-events: auto;"></div>
    </div>
  </div>
</div>`;
        })
        .then((html) => {
          const tpl = document.createElement('template');
          tpl.innerHTML = html;
          const overlayRoot = tpl.content.firstElementChild;
          const dialog = overlayRoot.querySelector('#' + CSS.escape(CONST.DIALOG_ID));
          const backdrop = overlayRoot.querySelector('div.fixed.inset-0.z-50');
          if (backdrop) {
            backdrop.addEventListener(
              'click',
              (e) => {
                if (dialog && !dialog.contains(e.target)) closeDialog();
              },
              true
            );
          }
          // Build inner content: header + list
          const header = document.createElement('div');
          header.className = 'gpt-pinned-modal-header';

          const title = document.createElement('div');
          title.className = 'gpt-pinned-modal-title';
          title.textContent = 'Pinned Conversations';

          const close = document.createElement('button');
          close.className = 'gpt-pinned-modal-close';
          close.textContent = '×';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', closeDialog);

          header.appendChild(title);
          header.appendChild(close);

          const content = document.createElement('div');
          content.className = 'gpt-pinned-modal-content';

          const list = document.createElement('div');
          list.className = 'gpt-pinned-list';
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
              empty.textContent = 'No pinned conversations yet.';
              empty.className = 'gpt-pinned-empty';
              list.appendChild(empty);
              return;
            }
            items.forEach((it) => {
              const row = document.createElement('div');
              row.className = 'gpt-pinned-row';

              const left = document.createElement('a');
              left.className = 'gpt-pinned-link';
              left.href = it.href || '#';
              left.textContent = it.title || it.href || it.id || 'Conversation';
              // left.target = '_blank';

              const del = document.createElement('button');
              del.className = 'gpt-pinned-delete';
              del.textContent = 'Delete';
              del.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  GPTPinned.storage
                    .removeFromPinned(it)
                    .then(() => reloadList());
                } catch (_) {}
              });

              row.appendChild(left);
              row.appendChild(del);
              list.appendChild(row);
            });
          }

          function reloadList() {
            if (!GPTPinned.storage) return;
            GPTPinned.storage.getPinned((items) => {
              renderList(items);
            });
          }

          reloadList();
        })
        .finally(() => {
          DIALOG_LOADING = false;
        });
    });
  }

  GPTPinned.modal = { openDialog, closeDialog, onEsc };
})();
