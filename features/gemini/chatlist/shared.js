// Shared namespace and constants for the Gemini chatlist feature
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});
  const registry = window.GPTChatbotSelectors || {};
  const botName = GPTChatlist.BOT || 'gemini';
  const botSelectors = (registry.get && registry.get(botName)) || registry[botName] || registry.gemini || {};

  GPTChatlist.BOT = botName;
  GPTChatlist.CONST = {
    SIDEBAR_SELECTOR: botSelectors.SIDEBAR_SELECTOR || 'nav, aside, [role="navigation"], .sidebar',
    BTN_CLASS: botSelectors.BTN_CLASS || 'gpt-sidebar-ext-chatlist-gemini',
    DIALOG_ID: botSelectors.DIALOG_ID || 'gpt-gemini-chatlist-dialog',
    HISTORY_ITEM_SELECTOR: botSelectors.HISTORY_ITEM_SELECTOR || 'user-query',
    STYLES_ID: botSelectors.STYLES_ID || 'gpt-chatlist-styles-gemini',
    STYLES_PATH: botSelectors.STYLES_PATH || 'features/gemini/chatlist/styles.css',
  };
})();
