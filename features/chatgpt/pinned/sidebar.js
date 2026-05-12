// Sidebar button injection for Pinned Conversations
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  const { CONST } = GPTPinned;

  function createPinnedButton() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
<li class="list-none">
  <a tabindex="0" data-fill="" class="group __menu-item hoverable ${CONST.BTN_CLASS}" data-testid="create-new-chat-button" data-sidebar-item="true" href="/" data-discover="true" data-revealed="">
    <div class="flex min-w-0 items-center gap-1.5">
      <div class="flex items-center justify-center [opacity:var(--menu-item-icon-opacity,1)] icon">
        📌
      </div>
      <div class="flex min-w-0 grow items-center gap-2.5">
        <div class="truncate">Pinned Conversation</div>
      </div>
    </div>
  </a>
</li>`;
    const btn = wrapper.querySelector('a');
    btn.style.cursor = 'pointer';
    btn.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { GPTPinned.modal && GPTPinned.modal.openDialog(); } catch (_) {}
      },
      { capture: true }
    );
    return btn;
  }

  function ensurePinnedButton() {
    const container = document.querySelector(CONST.SIDEBAR_SELECTOR);
    if (!container) return;
    if (container.querySelector('.' + CONST.BTN_CLASS)) return;
    const btn = createPinnedButton();
    try {
      container.appendChild(btn);
    } catch (_) {}
  }

  GPTPinned.sidebar = { ensurePinnedButton };
})();