// Sidebar button injection for Claude chatlist
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});
  function getCONST() { return (window.GPTChatlist && window.GPTChatlist.CONST) || {}; }

  function createButton() {
    const CONST = getCONST();
    const btnClass = (CONST && CONST.BTN_CLASS) || 'gpt-sidebar-ext-chatlist-claude';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
<li class="list-none">
  <a tabindex="0" class="group __menu-item hoverable ${btnClass}" href="#" style="cursor:pointer">
    <div class="flex min-w-0 items-center gap-1.5">
      <div class="flex items-center justify-center icon">💬</div>
      <div class="flex min-w-0 grow items-center gap-2.5"><div class="truncate">Claude Chats</div></div>
    </div>
  </a>
</li>`;
    const btn = wrapper.querySelector('a');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try { GPTChatlist.modal && GPTChatlist.modal.openDialog(); } catch (_) {}
    }, { capture: true });
    return btn;
  }

  function ensureButton() {
    const CONST = getCONST();
    const container = document.querySelector(CONST.SIDEBAR_SELECTOR) || document.body;
    if (!container) return;
    if (container.querySelector('.' + (CONST && CONST.BTN_CLASS))) return;
    const btn = createButton();
    try { container.appendChild(btn); } catch (_) {}
  }

  GPTChatlist.sidebar = { ensureButton };
})();
