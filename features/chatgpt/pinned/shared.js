// Shared namespace and constants for the ChatGPT pinned feature
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  const registry = window.GPTChatbotSelectors || {};
  const botName = GPTPinned.BOT || 'chatgpt';
  const botSelectors = (registry.get && registry.get(botName)) || registry[botName] || registry.chatgpt || {};

  GPTPinned.BOT = botName;
  GPTPinned.CONST = {
    SIDEBAR_SELECTOR: botSelectors.SIDEBAR_SELECTOR || '#stage-slideover-sidebar > div > div > div > nav > div:nth-child(3) > ul',
    BTN_CLASS: botSelectors.BTN_CLASS || 'gpt-sidebar-ext-pinned',
    DIALOG_ID: botSelectors.DIALOG_ID || 'radix-_r_cr_',
    HISTORY_ITEM_SELECTOR: botSelectors.HISTORY_ITEM_SELECTOR || '#history > ul > li > a',
    HISTORY_BTN_CLASS: botSelectors.HISTORY_BTN_CLASS || 'gpt-history-pin-btn',
    STYLES_ID: botSelectors.STYLES_ID || 'gpt-pinned-styles',
    MODAL_HTML_PATH: botSelectors.MODAL_HTML_PATH || 'features/chatgpt/pinned/modal.html',
    STYLES_PATH: botSelectors.STYLES_PATH || 'features/chatgpt/pinned/styles.css',
  };
})();