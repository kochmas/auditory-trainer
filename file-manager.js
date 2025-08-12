(function(global){
  const STORAGE_KEY = 'userTracks';

  async function addFiles(fileList){
    const metas = [];
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    for (const file of Array.from(fileList)){
      const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random());
      await global.IndexedDbUtil.putBlob(id, file);
      metas.push({ id, name: file.name, type: file.type, size: file.size });
    }
    const all = existing.concat(metas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return metas;
  }

  function getMetadata(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  async function getFileBlob(id){
    return global.IndexedDbUtil.getBlob(id);
  }

  global.FileManager = { addFiles, getMetadata, getFileBlob };
})(typeof window !== 'undefined' ? window : globalThis);
