document.addEventListener('DOMContentLoaded', () => {
  const bgColorPicker = document.getElementById('bgColorPicker');
  const msgBgColorPicker = document.getElementById('msgBgColorPicker');
  const textColorPicker = document.getElementById('textColorPicker');
  const showIndexCheckbox = document.getElementById('showIndexCheckbox');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // Load settings
  chrome.storage.sync.get(['bgColor', 'msgBgColor', 'textColor', 'showIndex'], (data) => {
    bgColorPicker.value = data.bgColor || '#ffffff';
    msgBgColorPicker.value = data.msgBgColor || '#303030';
    textColorPicker.value = data.textColor || '#ffffff';
    showIndexCheckbox.checked = data.showIndex !== false;
  });

  saveBtn.addEventListener('click', () => {
    const bgColor = bgColorPicker.value;
    const msgBgColor = msgBgColorPicker.value;
    const textColor = textColorPicker.value;
    const showIndex = showIndexCheckbox.checked;
    chrome.storage.sync.set({ bgColor, msgBgColor, textColor, showIndex }, () => {
      status.textContent = 'Settings saved!';
      setTimeout(() => status.textContent = '', 1200);
    });
  });
});
