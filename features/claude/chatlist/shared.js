// Shared namespace and constants for the Claude chatlist feature
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});
  const registry = window.GPTChatbotSelectors || {};
  const botName = GPTChatlist.BOT || 'claude';
  const botSelectors = (registry.get && registry.get(botName)) || registry[botName] || registry.claude || {};

  GPTChatlist.BOT = botName;
  GPTChatlist.CONST = {
    SIDEBAR_SELECTOR: botSelectors.SIDEBAR_SELECTOR || 'nav, aside, [role="navigation"], .sidebar',
    BTN_CLASS: botSelectors.BTN_CLASS || 'gpt-sidebar-ext-chatlist-claude',
    DIALOG_ID: botSelectors.DIALOG_ID || 'gpt-claude-chatlist-dialog',
    HISTORY_ITEM_SELECTOR: botSelectors.HISTORY_ITEM_SELECTOR || '[data-user-message-bubble="true"]',
    STYLES_ID: botSelectors.STYLES_ID || 'gpt-chatlist-styles-claude',
    MODAL_HTML_PATH: botSelectors.MODAL_HTML_PATH || 'features/claude/chatlist/modal.html',
    STYLES_PATH: botSelectors.STYLES_PATH || 'features/claude/chatlist/styles.css',
  };
})();
