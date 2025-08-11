const assert = require('assert');

// Mimic getRandomBetween and randomTrack from app.js
const getRandomBetween = (min, max) => Math.random() * (max - min) + min;

const selectedIndices = [];

// Create artificial sampleTracks list with click stubs
const sampleTracks = Array.from({ length: 5 }, (_, i) => ({
  element: {
    click: () => selectedIndices.push(i)
  }
}));

// Stub dependencies used in randomTrack
const audioPlayer = { play: () => {} };
const onPlayPressed = () => {};

const randomTrack = () => {
  const index = Math.floor(getRandomBetween(0, sampleTracks.length));
  sampleTracks[index].element.click();
  audioPlayer.play();
  onPlayPressed();
};

// Call randomTrack multiple times
for (let i = 0; i < 100; i++) {
  randomTrack();
}

// Ensure last entry was selected at least once
assert(
  selectedIndices.includes(sampleTracks.length - 1),
  'Last track was not selected'
);
