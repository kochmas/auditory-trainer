class DirectoryIndexer {
  constructor() {
    this.files = new Map();
  }
  update(list) {
    const changed = [];
    list.forEach(f => {
      const existing = this.files.get(f.fileId);
      if (!existing || existing.size !== f.size || existing.mtimeHash !== f.mtimeHash) {
        this.files.set(f.fileId, { size: f.size, mtimeHash: f.mtimeHash });
        changed.push(f.fileId);
      }
    });
    return changed;
  }
}

if (typeof module !== 'undefined') {
  module.exports = DirectoryIndexer;
}
