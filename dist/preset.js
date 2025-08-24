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
      ffp: {
        preGain: clamp(toNumber(p.ffp?.preGain, 1), 0, 2),
        lowShelfFreq: clamp(toNumber(p.ffp?.lowShelfFreq, 200), 20, 1000),
        lowShelfGain: clamp(toNumber(p.ffp?.lowShelfGain, 0), -15, 15),
        peaking1Freq: clamp(toNumber(p.ffp?.peaking1Freq, 500), 200, 2000),
        peaking1Gain: clamp(toNumber(p.ffp?.peaking1Gain, 0), -15, 15),
        peaking2Freq: clamp(toNumber(p.ffp?.peaking2Freq, 3000), 1000, 6000),
        peaking2Gain: clamp(toNumber(p.ffp?.peaking2Gain, 0), -15, 15),
        highShelfFreq: clamp(toNumber(p.ffp?.highShelfFreq, 6000), 2000, 12000),
        highShelfGain: clamp(toNumber(p.ffp?.highShelfGain, 0), -15, 15),
        tiltFreq: clamp(toNumber(p.ffp?.tiltFreq, 1000), 20, 20000),
        tiltGain: clamp(toNumber(p.ffp?.tiltGain, 0), -15, 15),
        modRate: clamp(toNumber(p.ffp?.modRate, 0), 0, 10),
        modDepth: clamp(toNumber(p.ffp?.modDepth, 0), 0, 1),
        modMode: ['off', 'sine', 'triangle'].includes(p.ffp?.modMode) ? p.ffp.modMode : 'off',
      },
    };
    if (params.gateMinS > params.gateMaxS) {
      [params.gateMinS, params.gateMaxS] = [params.gateMaxS, params.gateMinS];
    }
    return params;
  };

  const loadPresets = () => {
    try {
      const presets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      return presets.map(p => {
        if (p.params) {
          p.params = clampParams(p.params);
          return p;
        }
        return { ...p, params: clampParams(p) };
      });
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
