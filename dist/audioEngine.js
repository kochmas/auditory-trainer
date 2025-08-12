export function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

export class AudioEngine {
    constructor(audioPlayer, settings) {
        this.audioPlayer = audioPlayer;
        this.settings = settings;
        this.filterTimeout = null;
        this.gatingTimeout = null;
        this.filterInterval = null;
        this.gatingInterval = null;
        this.firstInteraction = false;
        this.beatsPlaying = false;
        this.currentVolume = 1;
        this.ramp = 0.15;
        this.panningRamp = 0.45;

        // Audio nodes
        this.audioContext = null;
        this.sourceNode = null;
        this.filterNode = null;
        this.gainNode = null;
        this.pannerNode = null;

        // Binaural beat nodes
        this.oscillatorNodeLeft = null;
        this.oscillatorNodeRight = null;
        this.gainNodeLeft = null;
        this.gainNodeRight = null;
        this.pannerNodeLeft = null;
        this.pannerNodeRight = null;
    }

    initAudioNodes() {
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioPlayer);
        this.filterNode = this.audioContext.createBiquadFilter();
        this.gainNode = this.audioContext.createGain();
        this.pannerNode = this.audioContext.createStereoPanner();

        this.sourceNode.connect(this.filterNode);
        this.filterNode.connect(this.pannerNode);
        this.pannerNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
    }

    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        this.dynamicGatingLogic();
        this.setFilterFreq();
        if (!this.settings.dynamicGating) {
            this.gainNode.gain.linearRampToValueAtTime(
                this.settings.volume,
                this.audioContext.currentTime + this.ramp
            );
        }
    }

    setCurrentVolume() {
        if (!this.gainNode) return;
        this.currentVolume = this.settings.dynamicGating
            ? getRandomBetween(0.1, this.settings.volume)
            : this.settings.volume;
        this.gainNode.gain.linearRampToValueAtTime(
            this.currentVolume,
            this.audioContext.currentTime + this.ramp
        );
        this.setBeatGain();
    }

    setBeatGain() {
        if (!this.gainNodeLeft || !this.gainNodeRight) return;
        const gain = getRandomBetween(0.004, 0.012) * this.currentVolume;
        this.gainNodeLeft.gain.value = gain;
        this.gainNodeRight.gain.value = gain;
    }

    startBinauralBeats() {
        if (this.beatsPlaying || !this.settings.dynamicBinauralBeat) return;
        this.beatsPlaying = true;

        this.oscillatorNodeLeft = this.audioContext.createOscillator();
        this.oscillatorNodeRight = this.audioContext.createOscillator();
        this.gainNodeLeft = this.audioContext.createGain();
        this.gainNodeRight = this.audioContext.createGain();
        this.pannerNodeLeft = this.audioContext.createStereoPanner();
        this.pannerNodeRight = this.audioContext.createStereoPanner();

        this.pannerNodeLeft.pan.value = -1;
        this.pannerNodeRight.pan.value = 1;

        this.setBeatGain();

        this.oscillatorNodeLeft.connect(this.gainNodeLeft);
        this.gainNodeLeft.connect(this.pannerNodeLeft);
        this.pannerNodeLeft.connect(this.audioContext.destination);

        this.oscillatorNodeRight.connect(this.gainNodeRight);
        this.gainNodeRight.connect(this.pannerNodeRight);
        this.pannerNodeRight.connect(this.audioContext.destination);

        if (!this.audioPlayer.paused) this.oscillatorNodeLeft.start();
        if (!this.audioPlayer.paused) this.oscillatorNodeRight.start();
    }

    stopBinauralBeats() {
        if (!this.beatsPlaying) return;
        this.beatsPlaying = false;
        if (this.oscillatorNodeLeft) this.oscillatorNodeLeft.stop();
        if (this.oscillatorNodeRight) this.oscillatorNodeRight.stop();
    }

    setBinauralBeatFreq(beatFrequency) {
        if (!this.beatsPlaying) return;
        const base =
            getRandomBetween(this.settings.filterMin, beatFrequency) /
            getRandomBetween(3, 6);
        const targetWave = getRandomBetween(0.5, 19);
        const low = base - targetWave / 2;
        const high = base + targetWave / 2;
        const lowLeft = getRandomBetween(0, 1) > 0.5;
        const rampFactor = getRandomBetween(0.7, 2.5);
        this.oscillatorNodeLeft.frequency.linearRampToValueAtTime(
            lowLeft ? low : high,
            this.audioContext.currentTime + this.ramp * rampFactor
        );
        this.oscillatorNodeRight.frequency.linearRampToValueAtTime(
            lowLeft ? high : low,
            this.audioContext.currentTime + this.ramp * rampFactor
        );
    }

    setFilterFreq(newFrequency) {
        if (!this.filterNode) return;
        if (!this.settings.dynamicFilter) {
            this.filterNode.type = 'highpass';
            this.filterNode.frequency.linearRampToValueAtTime(
                this.settings.filterMin,
                this.audioContext.currentTime + this.ramp
            );
            return;
        }
        this.filterNode.type = 'bandpass';
        this.filterNode.Q.value = getRandomBetween(0, 1);
        this.filterNode.frequency.linearRampToValueAtTime(
            newFrequency || this.settings.filterMax,
            this.audioContext.currentTime + this.ramp
        );
    }

    dynamicFilterLogic() {
        if (this.settings.dynamicFilter) {
            clearTimeout(this.filterTimeout);
            const newFrequency = getRandomBetween(
                this.settings.filterMin,
                this.settings.filterMax
            );
            this.setFilterFreq(newFrequency);
            this.setBinauralBeatFreq(newFrequency);
            const newTime = getRandomBetween(900, 10000);
            this.filterTimeout = setTimeout(
                () => this.dynamicFilterLogic(),
                newTime
            );
        }
    }

    dynamicGatingLogic() {
        clearTimeout(this.gatingTimeout);
        const newTime = getRandomBetween(
            this.settings.gatingMin,
            this.settings.gatingMax
        );
        this.setCurrentVolume();
    }

    dynamicPanningLogic() {
        const panValue = getRandomBetween(-1, 1);
        this.pannerNode.pan.linearRampToValueAtTime(
            panValue,
            this.audioContext.currentTime + this.panningRamp
        );
        setTimeout(
            () => this.dynamicPanningLogic(),
            getRandomBetween(600, 7000)
        );
    }

    dynamicPlaybackLogic() {
        this.audioPlayer.playbackRate = getRandomBetween(0.5, 1.5);
        setTimeout(
            () => this.dynamicPlaybackLogic(),
            getRandomBetween(2000, 12000)
        );
        if (!this.settings.dynamicPlaybackRate)
            this.audioPlayer.playbackRate = 1;
    }

    dynamicBinauralBeatLogic() {
        this.setBeatGain();
        if (this.settings.dynamicBinauralBeat && !this.audioPlayer.paused) {
            this.startBinauralBeats();
        } else {
            this.stopBinauralBeats();
        }
    }

    configureAudio() {
        this.dynamicFilterLogic();
        this.dynamicGatingLogic();
        this.dynamicPanningLogic();
        this.dynamicPlaybackLogic();
    }

    playAudio() {
        this.configureAudio();
        if (this.settings.dynamicBinauralBeat && !this.audioPlayer.paused)
            this.startBinauralBeats();
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (!this.sourceNode) {
            this.initAudioNodes();
        }
        clearInterval(this.filterInterval);
        clearInterval(this.gatingInterval);
        this.filterInterval = setInterval(() => {
            const randomDelay = getRandomBetween(100, 3000);
            setTimeout(() => this.dynamicFilterLogic(), randomDelay);
        }, 1000);
        this.gatingInterval = setInterval(() => {
            const randomDelay = getRandomBetween(200, 4000);
            setTimeout(() => this.dynamicGatingLogic(), randomDelay);
        }, 1000);
    }

    changeAudio(file, name) {
        const objectURL = file instanceof Blob ? URL.createObjectURL(file) : file;
        this.audioPlayer.src = objectURL;
        document.getElementById('trackLabel').innerText = name;
        this.audioPlayer.load();

        if (!this.firstInteraction) {
            this.firstInteractionListener();
            return;
        }
        this.audioPlayer.disabled = false;
        this.stopBinauralBeats();
        this.configureAudio();
    }

    firstInteractionListener = async () => {
        if (this.firstInteraction) return;
        this.firstInteraction = true;
        window.removeEventListener('click', this.firstInteractionListener);

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.initAudioNodes();
        this.playAudio();
        if (this.settings.dynamicBinauralBeat && !this.audioPlayer.paused)
            this.startBinauralBeats();
    };

    onPlayPressed() {
        if (this.settings.dynamicBinauralBeat && !this.audioPlayer.paused)
            this.startBinauralBeats();
        this.playAudio();
    }
}
