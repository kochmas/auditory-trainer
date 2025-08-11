const assert = require('assert');
const { resolvePreset } = require('../preset.js');

const presets = [
  { id: 'g', name: 'Global', scope: 'global', params: {} },
  { id: 'f', name: 'Folder', scope: 'folder', params: {}, associations: { folderRef: 'folder1' } },
  { id: 'file', name: 'File', scope: 'file', params: {}, associations: { fileRef: 'file1' } }
];

let preset = resolvePreset({ fileRef: 'file1', folderRef: 'folder1' }, presets);
assert.strictEqual(preset.id, 'file', 'File preset not selected');

preset = resolvePreset({ fileRef: 'unknown', folderRef: 'folder1' }, presets);
assert.strictEqual(preset.id, 'f', 'Folder preset not selected');

preset = resolvePreset({ fileRef: 'unknown', folderRef: 'unknown' }, presets);
assert.strictEqual(preset.id, 'g', 'Global preset not selected');

preset = resolvePreset({ fileRef: 'x', folderRef: 'y' }, []);
assert.strictEqual(preset, null, 'Expected null for no presets');
