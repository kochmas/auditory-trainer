import { jest } from "@jest/globals";
import { getRandomBetween, AudioEngine } from '../audioEngine.js';

describe('getRandomBetween', () => {
    test('returns value within range', () => {
        for (let i = 0; i < 10; i++) {
            const val = getRandomBetween(1, 2);
            expect(val).toBeGreaterThanOrEqual(1);
            expect(val).toBeLessThan(2);
        }
    });
});

describe('AudioEngine setFilterFreq', () => {
    test('uses highpass when dynamicFilter disabled', () => {
        const audioPlayer = { paused: true };
        const settings = {
            dynamicFilter: false,
            filterMin: 1000,
            filterMax: 2000,
            gatingMin: 0,
            gatingMax: 1,
            volume: 1,
            dynamicGating: false,
            dynamicPlaybackRate: false,
            dynamicBinauralBeat: false
        };
        const engine = new AudioEngine(audioPlayer, settings);
        engine.audioContext = { currentTime: 0 };
        engine.filterNode = {
            type: '',
            frequency: { linearRampToValueAtTime: jest.fn() },
            Q: { value: 0 }
        };
        engine.setFilterFreq();
        expect(engine.filterNode.type).toBe('highpass');
        expect(engine.filterNode.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(
            1000,
            engine.audioContext.currentTime + engine.ramp
        );
    });
});
