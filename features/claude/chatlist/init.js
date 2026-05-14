// Bootstraps the Claude chatlist feature
(() => {
  const GPTChatlist = (window.GPTChatlist = window.GPTChatlist || {});

  function run() {
    try { GPTChatlist.sidebar && GPTChatlist.sidebar.ensureButton(); } catch (_) {}
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => run(), { once: true });
  } else {
    setTimeout(run, 700);
  }
})();
