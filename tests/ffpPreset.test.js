import { jest } from '@jest/globals';
import fs from 'fs';
import vm from 'vm';
import { loadPresets, savePresets } from '../dist/ffpPresets.js';

global.window = {};
const code = fs.readFileSync(new URL('../dist/preset.js', import.meta.url), 'utf8');
const sandbox = { module: { exports: {} }, window: global.window };
vm.runInNewContext(code, sandbox);
const { clampParams } = sandbox.module.exports;

describe('clampParams ffp limits', () => {
  test('clamps values to allowed ranges', () => {
    const clamped = clampParams({
      ffp: {
        preGain: 5,
        lowShelfFreq: 0,
        lowShelfGain: -50,
        peaking1Freq: 50,
        peaking1Gain: 50,
        peaking2Freq: 10000,
        peaking2Gain: -50,
        highShelfFreq: 50000,
        highShelfGain: 50,
        tiltFreq: 50000,
        tiltGain: -50,
        modRate: 20,
        modDepth: 2,
        modMode: 'weird'
      }
    }).ffp;
    expect(clamped.preGain).toBe(2);
    expect(clamped.lowShelfFreq).toBe(20);
    expect(clamped.lowShelfGain).toBe(-15);
    expect(clamped.peaking1Freq).toBe(200);
    expect(clamped.peaking1Gain).toBe(15);
    expect(clamped.peaking2Freq).toBe(6000);
    expect(clamped.peaking2Gain).toBe(-15);
    expect(clamped.highShelfFreq).toBe(12000);
    expect(clamped.highShelfGain).toBe(15);
    expect(clamped.tiltFreq).toBe(20000);
    expect(clamped.tiltGain).toBe(-15);
    expect(clamped.modRate).toBe(10);
    expect(clamped.modDepth).toBe(1);
    expect(clamped.modMode).toBe('off');
  });
});

describe('FFP preset save/load', () => {
  test('performs roundtrip through storage', () => {
    const store = {};
    global.localStorage = {
      getItem: jest.fn(key => (key in store ? store[key] : null)),
      setItem: jest.fn((key, value) => { store[key] = value; })
    };
    global.window.ListenUpPresets = { clampParams };

    const preset = { name: 'test', params: { preGain: 1.5, lowShelfFreq: 250 } };
    savePresets([preset]);
    const loaded = loadPresets();
    const expected = { name: 'test', params: clampParams({ ffp: preset.params }).ffp };
    expect(loaded).toEqual([expected]);
  });
});
