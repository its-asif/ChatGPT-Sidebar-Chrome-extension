document.addEventListener('DOMContentLoaded', () => {
  const bgColorPicker = document.getElementById('bgColorPicker');
  const msgBgColorPicker = document.getElementById('msgBgColorPicker');
  const textColorPicker = document.getElementById('textColorPicker');
  const showIndexCheckbox = document.getElementById('showIndexCheckbox');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const paletteSelect = document.getElementById('paletteSelect');
  const customColorsContainer = document.getElementById('customColors');

  const PALETTES = {
    'purple': { textColor: '#f6f2f8', msgBgColor: '#54296a', bgColor: '#f6f2f8' },
    'purple-dark': { textColor: '#0b070d', msgBgColor: '#c095d6', bgColor: '#0b070d' },
    'orange': { textColor: '#fdf6f0', msgBgColor: '#e28028', bgColor: '#fdf6f0' },
    'orange-dark': { textColor: '#0d0702', msgBgColor: '#e28028', bgColor: '#0d0702' },
    'olive': { textColor: '#f0f7ed', msgBgColor: '#3a5e2b', bgColor: '#f0f7ed' },
    'olive-dark': { textColor: '#0b1208', msgBgColor: '#b0d4a1', bgColor: '#0b1208' },
    // Classic black & white (dark background, message accent, light text)
    'classic-bw': { textColor: '#111111', msgBgColor: '#ffffff', bgColor: '#111111' },
    // New palettes
    'graphite-calm': { textColor: '#E5E5E5', msgBgColor: '#2D2D2D', bgColor: '#121212' },
    'midnight-blue-soft': { textColor: '#C9D1D9', msgBgColor: '#21262D', bgColor: '#0D1117' },
    'charcoal-warm': { textColor: '#EDEADE', msgBgColor: '#2E2A27', bgColor: '#1A1A1A' },
    'indigo-night': { textColor: '#E8ECF7', msgBgColor: '#1B2A41', bgColor: '#0A0F24', accent: '#6C8AE4' },
    'obsidian-minimal': { textColor: '#FFFFFF', msgBgColor: '#1A1A1A', bgColor: '#000000' },
    'soft-mint-charcoal': { textColor: '#2D3748', msgBgColor: '#38A169', bgColor: '#F0FFF4' },
    'cozy-dark-warm-gray': { textColor: '#E0E0E0', msgBgColor: '#3B3B3B', bgColor: '#1F1F1F' },
    'pastel-rose-cream': { textColor: '#4A4A4A', msgBgColor: '#F4A7A7', bgColor: '#FFF8F8' },
    'serene-blue-sand': { textColor: '#2F3E46', msgBgColor: '#7DB1E8', bgColor: '#FAF5E4' },
    'matcha-green-minimal': { textColor: '#3B4636', msgBgColor: '#8AA77B', bgColor: '#F6F8F5' }
  };

  function applyPaletteValues(name) {
    const p = PALETTES[name];
    if (!p) return;
    textColorPicker.value = p.textColor;
    msgBgColorPicker.value = p.msgBgColor;
    bgColorPicker.value = p.bgColor;
  }

  function updateVisibility() {
    const val = paletteSelect.value;
    if (val === 'custom') {
      customColorsContainer.classList.remove('is-hidden');
    } else {
      customColorsContainer.classList.add('is-hidden');
      applyPaletteValues(val);
    }
  }

  // Load settings (backward compatible)
  chrome.storage.sync.get(['bgColor', 'msgBgColor', 'textColor', 'showIndex', 'palette'], (data) => {
    const palette = data.palette || 'custom';
    paletteSelect.value = PALETTES[palette] ? palette : 'custom';
    if (paletteSelect.value !== 'custom') {
      applyPaletteValues(paletteSelect.value);
    } else {
      bgColorPicker.value = data.bgColor || '#ffffff';
      msgBgColorPicker.value = data.msgBgColor || '#303030';
      textColorPicker.value = data.textColor || '#ffffff';
    }
    showIndexCheckbox.checked = data.showIndex !== false;
    updateVisibility();
  });

  paletteSelect.addEventListener('change', () => {
    updateVisibility();
  });

  saveBtn.addEventListener('click', () => {
    const palette = paletteSelect.value;
    const isCustom = palette === 'custom';
    const bgColor = bgColorPicker.value;
    const msgBgColor = msgBgColorPicker.value;
    const textColor = textColorPicker.value;
    const showIndex = showIndexCheckbox.checked;
    const payload = { bgColor, msgBgColor, textColor, showIndex, palette };
    chrome.storage.sync.set(payload, () => {
      status.textContent = 'Settings saved!';
      setTimeout(() => (status.textContent = ''), 1200);
    });
  });
});
