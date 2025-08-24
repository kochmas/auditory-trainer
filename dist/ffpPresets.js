const STORAGE_KEY = 'listenup_ffp_presets';

// Built-in system FFP presets
export const systemFfpPresets = [
    {
        name: 'Soziale Stimme',
        params: {
            preGain: 1,
            lowShelfFreq: 150,
            lowShelfGain: 3,
            peaking1Freq: 500,
            peaking1Gain: 2,
            peaking2Freq: 3000,
            peaking2Gain: 1.5,
            highShelfFreq: 8000,
            highShelfGain: 2,
            tiltFreq: 1000,
            tiltGain: 0,
            modRate: 0,
            modDepth: 0,
            modMode: 'off',
        },
    },
    {
        name: 'Weiche Prosodie',
        params: {
            preGain: 1,
            lowShelfFreq: 200,
            lowShelfGain: -2,
            peaking1Freq: 700,
            peaking1Gain: -1,
            peaking2Freq: 4000,
            peaking2Gain: -1,
            highShelfFreq: 6000,
            highShelfGain: -2,
            tiltFreq: 1200,
            tiltGain: -1,
            modRate: 0,
            modDepth: 0,
            modMode: 'off',
        },
    },
    {
        name: 'Klarer Fokus',
        params: {
            preGain: 1,
            lowShelfFreq: 180,
            lowShelfGain: 1,
            peaking1Freq: 600,
            peaking1Gain: 3,
            peaking2Freq: 3500,
            peaking2Gain: 2,
            highShelfFreq: 7000,
            highShelfGain: 1,
            tiltFreq: 1500,
            tiltGain: 0,
            modRate: 0,
            modDepth: 0,
            modMode: 'off',
        },
    },
    {
        name: 'Tiefe Resonanz',
        params: {
            preGain: 1,
            lowShelfFreq: 120,
            lowShelfGain: 4,
            peaking1Freq: 400,
            peaking1Gain: 2,
            peaking2Freq: 2500,
            peaking2Gain: -1,
            highShelfFreq: 5000,
            highShelfGain: -2,
            tiltFreq: 800,
            tiltGain: -1,
            modRate: 0,
            modDepth: 0,
            modMode: 'off',
        },
    },
    {
        name: 'Helle Artikulation',
        params: {
            preGain: 1,
            lowShelfFreq: 250,
            lowShelfGain: -1,
            peaking1Freq: 900,
            peaking1Gain: 2,
            peaking2Freq: 4500,
            peaking2Gain: 3,
            highShelfFreq: 9000,
            highShelfGain: 2,
            tiltFreq: 2000,
            tiltGain: 1,
            modRate: 0,
            modDepth: 0,
            modMode: 'off',
        },
    },
    {
        name: 'Dynamischer Ausdruck',
        params: {
            preGain: 1,
            lowShelfFreq: 160,
            lowShelfGain: 2,
            peaking1Freq: 800,
            peaking1Gain: 2,
            peaking2Freq: 3200,
            peaking2Gain: 2,
            highShelfFreq: 7500,
            highShelfGain: 1,
            tiltFreq: 1000,
            tiltGain: 0,
            modRate: 1,
            modDepth: 0.2,
            modMode: 'sine',
        },
    },
];

const clampFfp = (p) => {
    const api = window.ListenUpPresets;
    return api ? api.clampParams({ ffp: p }).ffp : p;
};

export const loadPresets = () => {
    try {
        const presets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        return presets.map(p => ({
            name: p.name,
            params: clampFfp(p.params || p),
        }));
    } catch (_) {
        return [];
    }
};

export const savePresets = (presets) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
};

export const exportPresets = () => JSON.stringify(loadPresets());

export const importPresets = (json) => {
    try {
        const data = JSON.parse(json);
        const presets = data.map(p => ({
            name: p.name,
            params: clampFfp(p.params || p),
        }));
        savePresets(presets);
        return presets;
    } catch (_) {
        return [];
    }
};

if (typeof window !== 'undefined') {
    window.ListenUpFfpPresets = {
        systemPresets: systemFfpPresets,
        loadPresets,
        savePresets,
        importPresets,
        exportPresets,
    };
}

export default {
    systemFfpPresets,
    loadPresets,
    savePresets,
    importPresets,
    exportPresets,
};

