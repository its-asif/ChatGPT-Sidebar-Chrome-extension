// Shared namespace and constants for the Pinned Conversations feature
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  GPTPinned.CONST = {
    SIDEBAR_SELECTOR: '#stage-slideover-sidebar > div > div > nav > aside',
    BTN_CLASS: 'gpt-sidebar-ext-pinned',
    DIALOG_ID: 'radix-_r_cr_',
    HISTORY_ITEM_SELECTOR: '#history > a',
    HISTORY_BTN_CLASS: 'gpt-history-pin-btn',
    STYLES_ID: 'gpt-pinned-styles',
    MODAL_HTML_PATH: 'features/pinned/modal.html',
    STYLES_PATH: 'features/pinned/styles.css'
  };
})();
