// Sidebar button injection for Gemini chatlist
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});
  function getCONST() { return (window.GPTChatlist && window.GPTlist && window.GPTChatlist.CONST) || (window.GPTChatlist && window.GPTChatlist.CONST) || {}; }

  function createButton() {
    const CONST = getCONST();
    const btnClass = (CONST && CONST.BTN_CLASS) || 'gpt-sidebar-ext-chatlist-gemini';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `gpt-gemini-sidebar-button ${btnClass}`;
    btn.setAttribute('aria-label', 'Open Gemini Chats');
    btn.innerHTML = '💬<span style="display:inline-block;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Gemini Chats</span>';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '8px';
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.padding = '6px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try { GPTChatlist.modal && GPTChatlist.modal.openDialog(); } catch (_) {}
    }, { capture: true });
    return btn;
  }

  function ensureButton() {
    const CONST = getCONST();
    const container = document.body;
    if (!container) return;
    if (container.querySelector('.gpt-gemini-sidebar-button')) return;
    const btn = createButton();
    btn.style.position = 'fixed';
    btn.style.right = '12px';
    btn.style.bottom = '80px';
    btn.style.zIndex = '999999';
    btn.style.pointerEvents = 'auto';
    try { container.appendChild(btn); } catch (_) {}
  }

  GPTChatlist.sidebar = { ensureButton };
})();
