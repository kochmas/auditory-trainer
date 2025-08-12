(() => {
  const STORAGE_KEY = 'listenup_presets';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const toNumber = (value, fallback) => {
    const num = Number(value);
    return Number.isNaN(num) ? fallback : num;
  };

  const clampParams = (p) => {
    const params = {
      filterMinHz: clamp(toNumber(p.filterMinHz, 20), 20, 20000),
      filterMaxHz: clamp(toNumber(p.filterMaxHz, 20000), 20, 20000),
      gateMinS: clamp(toNumber(p.gateMinS, 0.1), 0.1, 10),
      gateMaxS: clamp(toNumber(p.gateMaxS, 10), 0.1, 10),
      volume: clamp(toNumber(p.volume, 1), 0, 1),
      dynamicFilter: !!p.dynamicFilter,
      dynamicGating: !!p.dynamicGating,
      dynamicPlayback: !!p.dynamicPlayback,
      highPassEnabled: p.highPassEnabled !== false,
      binauralLayering: !!p.binauralLayering,
    };
    if (params.gateMinS > params.gateMaxS) {
      [params.gateMinS, params.gateMaxS] = [params.gateMaxS, params.gateMinS];
    }
    return params;
  };

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
