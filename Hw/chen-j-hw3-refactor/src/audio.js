let audioCtx;
let element, sourceNode, analyserNode, gainNode, bassFilter, trebleFilter;

const Defaults = Object.freeze({
    GAIN: .5,
    NUM_SAMPLE: 256
});

// defaults for biquad filter
const BiquadDefaults = Object.freeze({
    BASS_FREQ: 200,
    BASS_GAIN: 6,
    TREBLE_FREQ: 4000,
    TREBLE_GAIN: 4
});

let audioData = new Uint8Array(Defaults.NUM_SAMPLE / 2);

const setupWebaudio = (filePath) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    audioCtx = new AudioContext();
    element = new Audio();

    loadSoundFile(filePath);

    // create nodes
    sourceNode = audioCtx.createMediaElementSource(element);
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = Defaults.NUM_SAMPLE;

    // create gain node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = Defaults.GAIN;

    // create bass filter
    bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.setValueAtTime(BiquadDefaults.BASS_FREQ, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(BiquadDefaults.BASS_GAIN, audioCtx.currentTime);

    // create treble filter
    trebleFilter = audioCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.setValueAtTime(BiquadDefaults.TREBLE_FREQ, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(BiquadDefaults.TREBLE_GAIN, audioCtx.currentTime);

    // connect nodes
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