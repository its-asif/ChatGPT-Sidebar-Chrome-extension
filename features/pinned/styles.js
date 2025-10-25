// Loads and injects CSS for the Pinned Conversations feature
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});
  const { CONST } = GPTPinned;

  GPTPinned.styles = GPTPinned.styles || {};
  GPTPinned.styles.ensure = function ensurePinnedStyles() {
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
