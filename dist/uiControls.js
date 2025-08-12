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
