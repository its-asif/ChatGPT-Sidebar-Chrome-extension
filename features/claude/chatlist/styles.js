// Loads and injects CSS for the Claude chatlist feature
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});
  const { CONST } = GPTChatlist;

  GPTChatlist.styles = GPTChatlist.styles || {};
  GPTChatlist.styles.ensure = function ensureChatlistStyles() {
    if (document.getElementById(CONST.STYLES_ID)) return Promise.resolve();
    const url = chrome.runtime.getURL(CONST.STYLES_PATH);
    return fetch(url)
      .then((r) => r.text())
      .then((css) => {
        const style = document.createElement('style');
        style.id = CONST.STYLES_ID;
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch(() => {});
  };
})();
