const assert = require('assert');
const DirectoryIndexer = require('../dist/directory-indexer.js');

const indexer = new DirectoryIndexer();
let changed = indexer.update([
  { fileId: 'a', size: 1, mtimeHash: '1' },
  { fileId: 'b', size: 2, mtimeHash: '2' }
]);
assert.deepStrictEqual(changed.sort(), ['a','b']);

changed = indexer.update([
  { fileId: 'a', size: 1, mtimeHash: '1' },
  { fileId: 'b', size: 3, mtimeHash: '3' },
  { fileId: 'c', size: 4, mtimeHash: '4' }
]);
assert.deepStrictEqual(changed.sort(), ['b','c']);
