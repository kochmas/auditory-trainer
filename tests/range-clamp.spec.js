const assert = require('assert');
const { clampParams } = require('../preset.js');

const p = clampParams({
  filterMinHz: 10,
  filterMaxHz: 40000,
  gateMinS: 0,
  gateMaxS: 20,
  volume: 2,
});

assert.strictEqual(p.filterMinHz, 20, 'filterMinHz not clamped');
assert.strictEqual(p.filterMaxHz, 20000, 'filterMaxHz not clamped');
assert.strictEqual(p.gateMinS, 0.1, 'gateMinS not clamped');
assert.strictEqual(p.gateMaxS, 10, 'gateMaxS not clamped');
assert.strictEqual(p.volume, 1, 'volume not clamped');
