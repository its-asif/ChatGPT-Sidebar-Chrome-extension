// Global selector registry for chatbot-specific features
(() => {
  const registry = (window.GPTChatbotSelectors = window.GPTChatbotSelectors || {});

  registry.chatgpt = {
    SIDEBAR_SELECTOR: '#stage-slideover-sidebar > div > div > div > nav > div:nth-child(3) > ul',
    BTN_CLASS: 'gpt-sidebar-ext-pinned',
    DIALOG_ID: 'radix-_r_cr_',
    HISTORY_ITEM_SELECTOR: '#history > ul > li > a',
    HISTORY_BTN_CLASS: 'gpt-history-pin-btn',
    STYLES_ID: 'gpt-pinned-styles',
    MODAL_HTML_PATH: 'features/chatgpt/pinned/modal.html',
    STYLES_PATH: 'features/chatgpt/pinned/styles.css',
  };

  registry.get = function get(botName) {
    return registry[botName] || registry.chatgpt || {};
  };
})();