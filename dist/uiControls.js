import { AudioEngine } from './audioEngine.js';

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(registrationError => {
                    console.log('ServiceWorker registration failed:', registrationError);
                });
        });
    }
}

export function initControls() {
    const audioInput = document.getElementById('audioInput');
    const folderInput = document.getElementById('folderInput');
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.disabled = true;
    const filterFrequencyMin = document.getElementById('filterFrequencyMin');
    const filterFrequencyMax = document.getElementById('filterFrequencyMax');
    const gatingFrequencyMin = document.getElementById('gatingFrequencyMin');
    const gatingFrequencyMax = document.getElementById('gatingFrequencyMax');
    const volumeControl = document.getElementById('volumeControl');
    const dynamicFilter = document.getElementById('dynamicFilter');
    const dynamicGating = document.getElementById('dynamicGating');
    const dynamicPlaybackRate = document.getElementById('dynamicPlaybackRate');
    const dynamicBinauralBeat = document.getElementById('dynamicBinauralBeat');
    const playbackSpeedDisplay = document.getElementById('playbackSpeedDisplay');
    const presetSelect = document.getElementById('presetSelect');
    const presetNameInput = document.getElementById('presetName');
    const savePresetBtn = document.getElementById('savePresetBtn');
    const deletePresetBtn = document.getElementById('deletePresetBtn');
    const ffpBypass = document.getElementById('ffpBypass');
    const ffpPresetSelect = document.getElementById('ffpPresetSelect');
    const ffpPresetName = document.getElementById('ffpPresetName');
    const ffpSavePresetBtn = document.getElementById('ffpSavePresetBtn');
    const ffpDeletePresetBtn = document.getElementById('ffpDeletePresetBtn');
    const ffpPreGain = document.getElementById('ffpPreGain');
    const ffpLowShelfFreq = document.getElementById('ffpLowShelfFreq');
    const ffpLowShelfGain = document.getElementById('ffpLowShelfGain');
    const ffpPeaking1Freq = document.getElementById('ffpPeaking1Freq');
    const ffpPeaking1Gain = document.getElementById('ffpPeaking1Gain');
    const ffpPeaking2Freq = document.getElementById('ffpPeaking2Freq');
    const ffpPeaking2Gain = document.getElementById('ffpPeaking2Gain');
    const ffpHighShelfFreq = document.getElementById('ffpHighShelfFreq');
    const ffpHighShelfGain = document.getElementById('ffpHighShelfGain');
    const ffpTiltFreq = document.getElementById('ffpTiltFreq');
    const ffpTiltGain = document.getElementById('ffpTiltGain');
    const ffpModRate = document.getElementById('ffpModRate');
    const ffpModDepth = document.getElementById('ffpModDepth');
    const ffpModMode = document.getElementById('ffpModMode');
    const presetAPI = window.ListenUpPresets;
    let presets = presetAPI.loadPresets();
    const ffpStorageKey = 'listenup_ffp_presets';
    let ffpPresets = [];
    try {
        ffpPresets = JSON.parse(localStorage.getItem(ffpStorageKey)) || [];
    } catch (e) {
        ffpPresets = [];
    }

    const settings = {
        filterMin: parseFloat(filterFrequencyMin.value),
        filterMax: parseFloat(filterFrequencyMax.value),
        gatingMin: parseFloat(gatingFrequencyMin.value),
        gatingMax: parseFloat(gatingFrequencyMax.value),
        volume: parseFloat(volumeControl.value),
        dynamicFilter: dynamicFilter.checked,
        dynamicGating: dynamicGating.checked,
        dynamicPlaybackRate: dynamicPlaybackRate.checked,
        dynamicBinauralBeat: dynamicBinauralBeat.checked,
        shuffle: true
    };

    const engine = new AudioEngine(audioPlayer, settings);

    const updateSettings = () => {
        engine.updateSettings({
            filterMin: parseFloat(filterFrequencyMin.value),
            filterMax: parseFloat(filterFrequencyMax.value),
            gatingMin: parseFloat(gatingFrequencyMin.value),
            gatingMax: parseFloat(gatingFrequencyMax.value),
            volume: parseFloat(volumeControl.value),
            dynamicFilter: dynamicFilter.checked,
            dynamicGating: dynamicGating.checked,
            dynamicPlaybackRate: dynamicPlaybackRate.checked,
            dynamicBinauralBeat: dynamicBinauralBeat.checked
        });
    };

    const refreshPresetOptions = () => {
        presetSelect.innerHTML = '<option value="">Select preset</option>';
        presets.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.textContent = p.name;
            presetSelect.appendChild(opt);
        });
    };

    const applyPreset = (p) => {
        filterFrequencyMin.value = p.filterMinHz;
        filterFrequencyMax.value = p.filterMaxHz;
        gatingFrequencyMin.value = p.gateMinS;
        gatingFrequencyMax.value = p.gateMaxS;
        volumeControl.value = p.volume;
        dynamicFilter.checked = p.dynamicFilter;
        dynamicGating.checked = p.dynamicGating;
        dynamicPlaybackRate.checked = p.dynamicPlayback;
        dynamicBinauralBeat.checked = p.binauralLayering;
        updateSettings();
        engine.dynamicPlaybackLogic();
        engine.dynamicBinauralBeatLogic();
    };

    const getFfpParams = () => ({
        preGain: parseFloat(ffpPreGain.value),
        lowShelfFreq: parseFloat(ffpLowShelfFreq.value),
        lowShelfGain: parseFloat(ffpLowShelfGain.value),
        peaking1Freq: parseFloat(ffpPeaking1Freq.value),
        peaking1Gain: parseFloat(ffpPeaking1Gain.value),
        peaking2Freq: parseFloat(ffpPeaking2Freq.value),
        peaking2Gain: parseFloat(ffpPeaking2Gain.value),
        highShelfFreq: parseFloat(ffpHighShelfFreq.value),
        highShelfGain: parseFloat(ffpHighShelfGain.value),
        tiltFreq: parseFloat(ffpTiltFreq.value),
        tiltGain: parseFloat(ffpTiltGain.value),
        modRate: parseFloat(ffpModRate.value),
        modDepth: parseFloat(ffpModDepth.value),
        modMode: ffpModMode.value,
    });

    const refreshFfpPresetOptions = () => {
        if (!ffpPresetSelect) return;
        ffpPresetSelect.innerHTML = '<option value="">Select preset</option>';
        ffpPresets.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.textContent = p.name;
            ffpPresetSelect.appendChild(opt);
        });
    };

    const applyFfpPreset = (p) => {
        if (p.preGain !== undefined) ffpPreGain.value = p.preGain;
        if (p.lowShelfFreq !== undefined) ffpLowShelfFreq.value = p.lowShelfFreq;
        if (p.lowShelfGain !== undefined) ffpLowShelfGain.value = p.lowShelfGain;
        if (p.peaking1Freq !== undefined) ffpPeaking1Freq.value = p.peaking1Freq;
        if (p.peaking1Gain !== undefined) ffpPeaking1Gain.value = p.peaking1Gain;
        if (p.peaking2Freq !== undefined) ffpPeaking2Freq.value = p.peaking2Freq;
        if (p.peaking2Gain !== undefined) ffpPeaking2Gain.value = p.peaking2Gain;
        if (p.highShelfFreq !== undefined) ffpHighShelfFreq.value = p.highShelfFreq;
        if (p.highShelfGain !== undefined) ffpHighShelfGain.value = p.highShelfGain;
        if (p.tiltFreq !== undefined) ffpTiltFreq.value = p.tiltFreq;
        if (p.tiltGain !== undefined) ffpTiltGain.value = p.tiltGain;
        if (p.modRate !== undefined) ffpModRate.value = p.modRate;
        if (p.modDepth !== undefined) ffpModDepth.value = p.modDepth;
        if (p.modMode !== undefined) ffpModMode.value = p.modMode;
        if (!ffpBypass.checked) engine.setFfpParams(getFfpParams());
    };

    refreshPresetOptions();

    presetSelect.addEventListener('change', () => {
        const preset = presets.find(pr => pr.name === presetSelect.value);
        if (preset) applyPreset(preset.params || preset);
    });

    savePresetBtn.addEventListener('click', () => {
        const name = presetNameInput.value.trim();
        if (!name) return;
        const params = presetAPI.clampParams({
            filterMinHz: filterFrequencyMin.value,
            filterMaxHz: filterFrequencyMax.value,
            gateMinS: gatingFrequencyMin.value,
            gateMaxS: gatingFrequencyMax.value,
            volume: volumeControl.value,
            dynamicFilter: dynamicFilter.checked,
            dynamicGating: dynamicGating.checked,
            dynamicPlayback: dynamicPlaybackRate.checked,
            binauralLayering: dynamicBinauralBeat.checked
        });
        const idx = presets.findIndex(p => p.name === name);
        if (idx >= 0) {
            presets[idx].params = params;
        } else {
            presets.push({ name, params });
        }
        presetAPI.savePresets(presets);
        refreshPresetOptions();
        presetSelect.value = name;
    });

    deletePresetBtn.addEventListener('click', () => {
        const name = presetSelect.value;
        if (!name) return;
        presets = presets.filter(p => p.name !== name);
        presetAPI.savePresets(presets);
        refreshPresetOptions();
        presetSelect.value = '';
    });

    refreshFfpPresetOptions();

    ffpPresetSelect.addEventListener('change', () => {
        const preset = ffpPresets.find(p => p.name === ffpPresetSelect.value);
        if (preset) applyFfpPreset(preset.params || preset);
    });

    ffpSavePresetBtn.addEventListener('click', () => {
        const name = ffpPresetName.value.trim();
        if (!name) return;
        const params = getFfpParams();
        const idx = ffpPresets.findIndex(p => p.name === name);
        if (idx >= 0) {
            ffpPresets[idx].params = params;
        } else {
            ffpPresets.push({ name, params });
        }
        localStorage.setItem(ffpStorageKey, JSON.stringify(ffpPresets));
        refreshFfpPresetOptions();
        ffpPresetSelect.value = name;
    });

    ffpDeletePresetBtn.addEventListener('click', () => {
        const name = ffpPresetSelect.value;
        if (!name) return;
        ffpPresets = ffpPresets.filter(p => p.name !== name);
        localStorage.setItem(ffpStorageKey, JSON.stringify(ffpPresets));
        refreshFfpPresetOptions();
        ffpPresetSelect.value = '';
    });

    const updateFfpParams = () => {
        if (!ffpBypass.checked) {
            engine.setFfpParams(getFfpParams());
        }
    };

    [
        ffpPreGain,
        ffpLowShelfFreq,
        ffpLowShelfGain,
        ffpPeaking1Freq,
        ffpPeaking1Gain,
        ffpPeaking2Freq,
        ffpPeaking2Gain,
        ffpHighShelfFreq,
        ffpHighShelfGain,
        ffpTiltFreq,
        ffpTiltGain,
        ffpModRate,
        ffpModDepth
    ].forEach(el => {
        if (el) el.addEventListener('input', updateFfpParams);
    });
    ffpModMode.addEventListener('change', updateFfpParams);

    ffpBypass.addEventListener('change', () => {
        if (ffpBypass.checked) {
            engine.disableFfp();
            dynamicFilter.disabled = false;
            dynamicGating.disabled = false;
            updateSettings();
        } else {
            engine.enableFfp(getFfpParams());
            dynamicFilter.checked = false;
            dynamicGating.checked = false;
            dynamicFilter.disabled = true;
            dynamicGating.disabled = true;
            updateSettings();
        }
    });

    audioInput.addEventListener('change', async event => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const metas = await FileManager.addFiles(files);
        const first = metas[0];
        if (first) {
            const blob = await FileManager.getFileBlob(first.id);
            if (blob) engine.changeAudio(blob, first.name);
        }
    });

    folderInput.addEventListener('change', async event => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const metas = await FileManager.addFiles(files);
        const first = metas[0];
        if (first) {
            const blob = await FileManager.getFileBlob(first.id);
            if (blob) engine.changeAudio(blob, first.name);
        }
    });

    filterFrequencyMin.addEventListener('input', updateSettings);
    filterFrequencyMax.addEventListener('input', updateSettings);
    gatingFrequencyMin.addEventListener('input', updateSettings);
    gatingFrequencyMax.addEventListener('input', updateSettings);
    volumeControl.addEventListener('input', () => {
        updateSettings();
        engine.setBeatGain();
    });
    dynamicFilter.addEventListener('change', updateSettings);
    dynamicGating.addEventListener('change', updateSettings);
    dynamicPlaybackRate.addEventListener('change', () => {
        updateSettings();
        engine.dynamicPlaybackLogic();
    });
    dynamicBinauralBeat.addEventListener('change', () => {
        updateSettings();
        engine.dynamicBinauralBeatLogic();
    });

    audioPlayer.addEventListener('play', function () {
        engine.onPlayPressed();
    });

    audioPlayer.addEventListener('pause', function () {
        engine.stopBinauralBeats();
    });

    audioPlayer.addEventListener('timeupdate', function () {
        playbackSpeedDisplay.innerHTML = `Playback Rate: ${audioPlayer.playbackRate.toFixed(2)}x`;
    });

    window.addEventListener('click', engine.firstInteractionListener);

    return engine;
}
