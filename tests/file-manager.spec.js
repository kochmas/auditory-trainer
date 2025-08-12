const assert = require('assert');

global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; },
  removeItem(k) { delete this.store[k]; }
};

const fm = require('../file-manager.js');

assert.deepStrictEqual(fm.load(), []);
fm.addRawTrack({ id: '1', name: 'a', dataUrl: 'data:audio/mp3;base64,AAA' });
fm.addRawTrack({ id: '2', name: 'b', dataUrl: 'data:audio/mp3;base64,BBB' });
assert.strictEqual(fm.load().length, 2);
fm.removeTrack('1');
assert.deepStrictEqual(fm.load().map(t => t.id), ['2']);
