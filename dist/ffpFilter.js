export function createFfpChain(ctx, inputNode, params = {}) {
    const preGain = ctx.createGain();

    const lowShelf = ctx.createBiquadFilter();
    lowShelf.type = 'lowshelf';

    const peaking1 = ctx.createBiquadFilter();
    peaking1.type = 'peaking';

    const peaking2 = ctx.createBiquadFilter();
    peaking2.type = 'peaking';

    const highShelf = ctx.createBiquadFilter();
    highShelf.type = 'highshelf';

    let tilt = null;
    if (params.tiltFreq !== undefined || params.tiltGain !== undefined) {
        tilt = ctx.createBiquadFilter();
        tilt.type = 'peaking';
    }

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = 0;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0;
    limiter.release.value = 0.1;

    inputNode.connect(preGain);
    preGain.connect(lowShelf);
    lowShelf.connect(peaking1);
    peaking1.connect(peaking2);
    peaking2.connect(highShelf);
    if (tilt) {
        highShelf.connect(tilt);
        tilt.connect(limiter);
    } else {
        highShelf.connect(limiter);
    }

    function setParams(p = {}) {
        if (p.preGain !== undefined) preGain.gain.value = p.preGain;
        if (p.lowShelfFreq !== undefined) lowShelf.frequency.value = p.lowShelfFreq;
        if (p.lowShelfGain !== undefined) lowShelf.gain.value = p.lowShelfGain;
        if (p.peaking1Freq !== undefined) peaking1.frequency.value = p.peaking1Freq;
        if (p.peaking1Q !== undefined) peaking1.Q.value = p.peaking1Q;
        if (p.peaking1Gain !== undefined) peaking1.gain.value = p.peaking1Gain;
        if (p.peaking2Freq !== undefined) peaking2.frequency.value = p.peaking2Freq;
        if (p.peaking2Q !== undefined) peaking2.Q.value = p.peaking2Q;
        if (p.peaking2Gain !== undefined) peaking2.gain.value = p.peaking2Gain;
        if (p.highShelfFreq !== undefined) highShelf.frequency.value = p.highShelfFreq;
        if (p.highShelfGain !== undefined) highShelf.gain.value = p.highShelfGain;
        if (tilt) {
            if (p.tiltFreq !== undefined) tilt.frequency.value = p.tiltFreq;
            if (p.tiltGain !== undefined) tilt.gain.value = p.tiltGain;
        }
    }

    let bypassed = false;
    function bypass(state) {
        if (state === bypassed) return;
        bypassed = state;
        if (state) {
            inputNode.disconnect();
            inputNode.connect(limiter);
        } else {
            inputNode.disconnect();
            inputNode.connect(preGain);
        }
    }

    function dispose() {
        inputNode.disconnect();
        preGain.disconnect();
        lowShelf.disconnect();
        peaking1.disconnect();
        peaking2.disconnect();
        highShelf.disconnect();
        if (tilt) tilt.disconnect();
        limiter.disconnect();
    }

    setParams(params);

    return {
        output: limiter,
        setParams,
        bypass,
        dispose,
    };
}
