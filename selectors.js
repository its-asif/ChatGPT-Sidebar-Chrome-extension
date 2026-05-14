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

  registry.claude = {
    SIDEBAR_SELECTOR: 'nav, aside, [role="navigation"], .sidebar',
    BTN_CLASS: 'gpt-sidebar-ext-chatlist-claude',
    DIALOG_ID: 'gpt-claude-chatlist-dialog',
    HISTORY_ITEM_SELECTOR: '[data-user-message-bubble="true"]',
    HISTORY_BTN_CLASS: 'gpt-history-pin-btn-claude',
    STYLES_ID: 'gpt-chatlist-styles-claude',
    MODAL_HTML_PATH: 'features/claude/chatlist/modal.html',
    STYLES_PATH: 'features/claude/chatlist/styles.css',
  };

  registry.gemini = {
    SIDEBAR_SELECTOR: 'nav, aside, [role="navigation"], .sidebar',
    BTN_CLASS: 'gpt-sidebar-ext-chatlist-gemini',
    DIALOG_ID: 'gpt-gemini-chatlist-dialog',
    HISTORY_ITEM_SELECTOR: 'user-query',
    HISTORY_BTN_CLASS: 'gpt-history-pin-btn-gemini',
    STYLES_ID: 'gpt-chatlist-styles-gemini',
    STYLES_PATH: 'features/gemini/chatlist/styles.css',
  };

  registry.get = function get(botName) {
    return registry[botName] || registry.chatgpt || {};
  };
})();