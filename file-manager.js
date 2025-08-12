(() => {
  const STORAGE_KEY = 'listenup_tracks';

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (_) {
      return [];
    }
  };

  const save = (tracks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  };

  const addRawTrack = (track) => {
    const tracks = load();
    tracks.push(track);
    save(tracks);
    return track;
  };

  const removeTrack = (id) => {
    const tracks = load().filter(t => t.id !== id);
    save(tracks);
    return tracks;
  };

  const readFile = (file) => new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });

  const addFiles = async (fileList) => {
    const added = [];
    for (const file of fileList) {
      const dataUrl = await readFile(file);
      const track = { id: Date.now().toString() + Math.random().toString(36).slice(2), name: file.name, dataUrl };
      addRawTrack(track);
      added.push(track);
    }
    return added;
  };

  const API = { load, save, addRawTrack, removeTrack, addFiles };
  if (typeof window !== 'undefined') {
    window.ListenUpFileManager = API;
  }
  if (typeof module !== 'undefined') {
    module.exports = API;
  }
})();
