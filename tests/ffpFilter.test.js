import { createFfpChain } from '../dist/ffpFilter.js';

class MockNode {
  constructor(name) {
    this.name = name;
    this.connections = [];
    this.gain = { value: 0 };
    this.frequency = { value: 0 };
    this.Q = { value: 0 };
    this.threshold = { value: 0 };
    this.knee = { value: 0 };
    this.ratio = { value: 0 };
    this.attack = { value: 0 };
    this.release = { value: 0 };
  }
  connect(node) {
    this.connections.push(node);
  }
  disconnect() {
    this.connections = [];
  }
}

class MockContext {
  constructor() {
    this.created = [];
  }
  createGain() {
    const node = new MockNode('gain');
    this.created.push(node);
    return node;
  }
  createBiquadFilter() {
    const node = new MockNode('biquad');
    this.created.push(node);
    return node;
  }
  createDynamicsCompressor() {
    const node = new MockNode('compressor');
    this.created.push(node);
    return node;
  }
}

test('builds node chain and toggles bypass', () => {
  const ctx = new MockContext();
  const input = new MockNode('input');
  const chain = createFfpChain(ctx, input, { tiltFreq: 1000, tiltGain: 1 });
  const [preGain, lowShelf, peaking1, peaking2, highShelf, tilt, limiter] = ctx.created;

  expect(input.connections).toEqual([preGain]);
  expect(preGain.connections).toEqual([lowShelf]);
  expect(lowShelf.connections).toEqual([peaking1]);
  expect(peaking1.connections).toEqual([peaking2]);
  expect(peaking2.connections).toEqual([highShelf]);
  expect(highShelf.connections).toEqual([tilt]);
  expect(tilt.connections).toEqual([limiter]);
  expect(chain.output).toBe(limiter);

  chain.bypass(true);
  expect(input.connections).toEqual([limiter]);

  chain.bypass(false);
  expect(input.connections).toEqual([preGain]);
});
