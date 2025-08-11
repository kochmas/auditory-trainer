(() => {
  const STORAGE_KEY = 'listenup_presets';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const clampParams = (p) => ({
    filterMinHz: clamp(p.filterMinHz, 20, 20000),
    filterMaxHz: clamp(p.filterMaxHz, 20, 20000),
    gateMinS: clamp(p.gateMinS, 0.1, 10),
    gateMaxS: clamp(p.gateMaxS, 0.1, 10),
    volume: clamp(p.volume, 0, 1),
    dynamicFilter: !!p.dynamicFilter,
    dynamicGating: !!p.dynamicGating,
    dynamicPlayback: !!p.dynamicPlayback,
    highPassEnabled: p.highPassEnabled !== false,
    binauralLayering: !!p.binauralLayering,
  });

  const loadPresets = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (_) {
      return [];
    }
  };

  const savePresets = (presets) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  };

  const resolvePreset = ({fileRef, folderRef}, presets) => {
    let preset = presets.find(p => p.scope === 'file' && p.associations?.fileRef === fileRef);
    if (!preset) {
      preset = presets.find(p => p.scope === 'folder' && p.associations?.folderRef === folderRef);
    }
    if (!preset) {
      preset = presets.find(p => p.scope === 'global');
    }
    return preset || null;
  };

  const API = { clampParams, loadPresets, savePresets, resolvePreset };

  if (typeof window !== 'undefined') {
    window.ListenUpPresets = API;
  }
  if (typeof module !== 'undefined') {
    module.exports = API;
  }
})();
