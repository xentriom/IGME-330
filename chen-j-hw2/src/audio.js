// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode, bassFilter, trebleFilter;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = (filePath) => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();

    // 6
    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.setValueAtTime(200, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(6, audioCtx.currentTime);

    trebleFilter = audioCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.setValueAtTime(4000, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(4, audioCtx.currentTime);

    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(analyserNode);
    analyserNode.connect(bassFilter);
    bassFilter.connect(trebleFilter);
    trebleFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}
// make sure that it's a Number rather than a String

const loadSoundFile = (filePath) => element.src = filePath;

const playCurrentSound = () => element.play();

const pauseCurrentSound = () => element.pause();

const setVolume = (value) => {
    value = Number(value);
    gainNode.gain.value = value;
}

const setBassFrequency = (value) => {
    value = Number(value);
    bassFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
}

const setBassGain = (value) => {
    value = Number(value);
    bassFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

const setTrebleFrequency = (value) => {
    value = Number(value);
    trebleFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
}

const setTrebleGain = (value) => {
    value = Number(value);
    trebleFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

const getCurrentTime = () => {
    return element.currentTime;
};

const getDuration = () => {
    return element.duration;
};

const seekTo = (time) => {
    element.currentTime = time;
};

export {
    audioCtx,
    setupWebaudio,
    playCurrentSound,
    pauseCurrentSound,
    loadSoundFile,
    setVolume,
    setBassFrequency,
    setBassGain,
    setTrebleFrequency,
    setTrebleGain,
    getCurrentTime,
    getDuration,
    seekTo,
    analyserNode
};