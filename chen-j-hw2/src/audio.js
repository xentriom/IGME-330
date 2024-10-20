let audioCtx;
let element, sourceNode, analyserNode, gainNode, bassFilter, trebleFilter;

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

const setupWebaudio = (filePath) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    audioCtx = new AudioContext();
    element = new Audio();

    loadSoundFile(filePath);

    sourceNode = audioCtx.createMediaElementSource(element);
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = DEFAULTS.numSamples;

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

    sourceNode.connect(analyserNode);
    analyserNode.connect(bassFilter);
    bassFilter.connect(trebleFilter);
    trebleFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

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