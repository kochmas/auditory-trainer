const assert = require('assert');
const { clampParams } = require('../dist/preset.js');

// NaN values fall back to defaults
const defaults = clampParams({
  filterMinHz: NaN,
  filterMaxHz: NaN,
  gateMinS: NaN,
  gateMaxS: NaN,
  volume: NaN,
});

assert.strictEqual(defaults.filterMinHz, 20, 'filterMinHz NaN default failed');
assert.strictEqual(defaults.filterMaxHz, 20000, 'filterMaxHz NaN default failed');
assert.strictEqual(defaults.gateMinS, 0.1, 'gateMinS NaN default failed');
assert.strictEqual(defaults.gateMaxS, 10, 'gateMaxS NaN default failed');
assert.strictEqual(defaults.volume, 1, 'volume NaN default failed');

// Inverted gating range should be swapped
const swapped = clampParams({ gateMinS: 8, gateMaxS: 2 });
assert.strictEqual(swapped.gateMinS, 2, 'gateMinS not swapped');
assert.strictEqual(swapped.gateMaxS, 8, 'gateMaxS not swapped');
