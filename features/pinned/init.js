// Bootstraps the Pinned Conversations feature
(() => {
  const GPTPinned = (window.GPTPinned = window.GPTPinned || {});

  function run() {
    try { GPTPinned.sidebar && GPTPinned.sidebar.ensurePinnedButton(); } catch (_) {}
    try { GPTPinned.history && GPTPinned.history.ensureHistoryButtons(); } catch (_) {}
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => run(), { once: true });
  } else {
    setTimeout(run, 700);
  }
})();
