import { Defaults, BiquadDefaults } from "./enums/audio-defaults.enum";

let audioCtx: AudioContext;
let element: HTMLAudioElement;
let sourceNode: MediaElementAudioSourceNode;
let analyserNode: AnalyserNode;
let gainNode: GainNode;
let bassFilter: BiquadFilterNode;
let trebleFilter: BiquadFilterNode;

const setupWebaudio = (filePath: string): void => {
    const AudioContext = window.AudioContext;

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

const loadSoundFile = (filePath: string): void => {
    element.src = filePath
};

const playCurrentSound = (): void => {
    element.play()
};

const pauseCurrentSound = (): void => {
    element.pause()
};

const setVolume = (value: number): void => {
    gainNode.gain.value = value;
}

const setBassFrequency = (value: number): void => {
    bassFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
}

const setBassGain = (value: number): void => {
    bassFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

const setTrebleFrequency = (value: number): void => {
    trebleFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
}

const setTrebleGain = (value: number): void => {
    trebleFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

const getCurrentTime = (): number => {
    return element.currentTime;
};

const getDuration = (): number => {
    return element.duration;
};

const seekTo = (time: number): void => {
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