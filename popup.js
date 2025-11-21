document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.classList.add("loading");

  // Settings button
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open("settings.html");
      }
    });
  }

  // Helper to render messages with current settings
  function renderMessages(messages, showIndex, msgBgColor, textColor) {
    messagesDiv.innerHTML = "";
    if (messages && messages.length > 0) {
      messages.forEach((msg, index) => {
        const div = document.createElement("div");
        div.className = "message";
        div.style.animationDelay = `${index * 0.05}s`;
        div.textContent = showIndex ? `${index + 1}. ${msg.text}` : msg.text;
        if (msgBgColor) div.style.background = msgBgColor;
        if (textColor) div.style.color = textColor;
        div.addEventListener("click", (e) => {
          createRippleEffect(e);
          chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, {
              action: "scrollToMessage",
              index: msg.index,
            });
          });
        });
        messagesDiv.appendChild(div);
      });
    } else {
      showEmptyState("No messages found in this conversation.");
    }
    // Set all text color if needed
      if (textColor) {
        document.body.style.color = textColor;
        document.querySelectorAll('.empty-state').forEach(el => { el.style.color = textColor; });
      } else {
        document.body.style.color = '';
        document.querySelectorAll('.empty-state').forEach(el => { el.style.color = ''; });
      }
      // Ensure header title keeps msgBgColor override
      const headerTitle = document.querySelector('.header-title');
      const settingsBtn = document.getElementById('settingsBtn');
      if (headerTitle && lastMsgBgColor) headerTitle.style.color = lastMsgBgColor;
      if (settingsBtn && lastMsgBgColor) settingsBtn.style.color = lastMsgBgColor;
  }

  // Store last loaded messages and settings
  let lastMessages = [];
  let lastShowIndex = true;
  let lastMsgBgColor = '';
  let lastTextColor = '';

  // Load and apply settings, then fetch and render messages
  function loadAndRender() {
    chrome.storage.sync.get(["bgColor", "msgBgColor", "textColor", "showIndex"], (settings) => {
      if (settings.bgColor) {
        document.body.classList.add("dynamic-bg");
        document.body.style.background = settings.bgColor;
      } else {
        document.body.classList.remove("dynamic-bg");
        document.body.style.background = "";
      }
      const showIndex = settings.showIndex !== false;
      lastShowIndex = showIndex;
      lastMsgBgColor = settings.msgBgColor || '';
      lastTextColor = settings.textColor || '';

      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        // Set header title color to msgBgColor as requested
        const headerTitle = document.querySelector('.header-title');
        const settingsBtnEl = document.getElementById('settingsBtn');
        const chosen = lastMsgBgColor || settings.textColor || '';
        if (headerTitle) headerTitle.style.color = chosen;
        if (settingsBtnEl) settingsBtnEl.style.color = chosen;

        if (!tab || !tab.url.includes("chatgpt.com")) {
          showEmptyState("Please visit <b>ChatGPT</b> to use this extension.");
          return;
        }
        chrome.tabs.sendMessage(tab.id, { action: "getMessages" }, (response) => {
          messagesDiv.classList.remove("loading");
          if (!response) {
            showEmptyState("Unable to connect. Please refresh the page.");
            return;
          }
          lastMessages = response.messages || [];
          renderMessages(lastMessages, lastShowIndex, lastMsgBgColor, lastTextColor);
        });
      });
    });
  }

  // Listen for storage changes and update UI accordingly
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      let needsRerender = false;
      if (changes.bgColor) {
        document.body.classList.add("dynamic-bg");
        document.body.style.background = changes.bgColor.newValue;
      }
      if (changes.msgBgColor) {
        // lastMsgBgColor = changes.msgBgColor.newValue;
        lastTextColor = changes.textColor ? changes.textColor.newValue : lastTextColor;
        // Update header title and settings button color immediately
        const headerTitle = document.querySelector('.header-title');
        const settingsBtnEl = document.getElementById('settingsBtn');
        if (headerTitle) headerTitle.style.color = lastTextColor;
        if (settingsBtnEl) settingsBtnEl.style.color = lastTextColor;
        needsRerender = true;
      }
      if (changes.textColor) {
        lastTextColor = changes.textColor.newValue;
        needsRerender = true;
      }
      if (changes.showIndex) {
        lastShowIndex = changes.showIndex.newValue !== false;
        needsRerender = true;
      }
      if (needsRerender) {
        renderMessages(lastMessages, lastShowIndex, lastMsgBgColor, lastTextColor);
      }
    }
  });

  // Initial load
  loadAndRender();
});

// Function to create ripple effect
function createRippleEffect(event) {
  const button = event.currentTarget;
  const circle = document.createElement("span");

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  // Remove existing ripples
  const ripple = button.querySelector(".ripple");
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  // Remove ripple after animation
  setTimeout(() => {
    if (circle) {
      circle.remove();
    }
  }, 600);
}

// Function to show empty states
function showEmptyState(message) {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.classList.remove("loading");
  messagesDiv.innerHTML = "";  

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/deno.png");
  img.alt = "little deno";
  img.style.width = "50px";
  img.style.height = "50px";
  img.style.display = "block";
  img.style.margin = "0 auto 0px";

  const emptyDiv = document.createElement("div");
  emptyDiv.className = "empty-state";
  emptyDiv.innerHTML = message;

  messagesDiv.appendChild(img);
  messagesDiv.appendChild(emptyDiv);
}