import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import { Sprite } from './sprite.js';

let avData;

const DEFAULTS = Object.freeze({
    sound1: "./media/Natlan Battle Theme.mp3"
});

const preload = async () => {
    alert("Audio may not play on the first click.\nPlease click the button again to start the audio.\n\nRecommended screen width: 1080+");

    // fetch and store the data
    const response = await fetch("data/av-data.json");
    const data = await response.json();
    avData = data;

    return data;
}

const init = () => {
    audio.setupWebaudio(DEFAULTS.sound1);

    // set up canvas ui
    let canvasElement = document.querySelector("canvas");
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    // set up track selection
    let trackElement = document.querySelector("#track-selection");
    setupTracks(trackElement);

    loop();
}

const setupTracks = (trackElement) => {
    const sprites = new Map();

    // create a div for each track
    for (let track of avData.data) {
        let div = document.createElement("div");
        div.classList.add("track");

        div.dataset.name = track.name;
        div.dataset.path = track.path;

        let img = document.createElement("img");
        img.src = track.image;
        div.appendChild(img);

        const sprite = new Sprite(img);
        sprites.set(div, sprite);

        let div2 = document.createElement("div");
        div2.classList.add("track-info");

        let h3 = document.createElement("h3");
        h3.classList.add("remove-text-flairs");
        h3.innerHTML = track.name;
        div2.appendChild(h3);

        let p = document.createElement("p");
        p.classList.add("remove-text-flairs");
        p.innerHTML = track.author;
        div2.appendChild(p);

        div.appendChild(div2);
        trackElement.appendChild(div);
    }

    // start the first sprite rotation
    const initSpirte = sprites.values().next().value;
    initSpirte.startRotation();

    // set up click event
    const playButton = document.querySelector("#btn-play");
    const playButtonImage = playButton.querySelector("img");
    trackElement.onclick = e => {
        const trackDiv = e.target.closest(".track");

        if (trackDiv) {
            const trackPath = trackDiv.dataset.path;
            audio.loadSoundFile(trackPath);

            // rotate the playing sprite
            sprites.forEach((s, div) => {
                div == trackDiv
                    ? s.startRotation()
                    : s.stopRotation();
            });

            playButtonImage.src = utils.TOGGLE_BUTTONS.PAUSE;
        }
    }
}

const setupUI = (canvasElement) => {
    // full screen button
    const fsButton = document.querySelector("#btn-fs");
    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    // play/pause button
    const playButton = document.querySelector("#btn-play");
    const playButtonImage = playButton.querySelector("img");
    playButton.onclick = e => {
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }

        if (e.target.dataset.playing == "no") {
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; //our css will set the text to "Pause", no it will not
            playButtonImage.src = utils.TOGGLE_BUTTONS.PLAY;
        }
        else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";// our CSS will set the text to "Play", no it will not
            playButtonImage.src = utils.TOGGLE_BUTTONS.PAUSE;
        }
    };

    // volume slider
    let volumeSlider = document.querySelector("#slider-volume");
    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
    };
    volumeSlider.dispatchEvent(new Event("input"));

    // Set up bass sliders
    utils.setupSlider("#slider-bass-frequency", "#label-bass-frequency", "Hz", audio.setBassFrequency);
    utils.setupSlider("#slider-bass-gain", "#label-bass-gain", "dB", audio.setBassGain);

    // Set up treble sliders
    utils.setupSlider("#slider-treble-frequency", "#label-treble-frequency", "Hz", audio.setTrebleFrequency);
    utils.setupSlider("#slider-treble-gain", "#label-treble-gain", "dB", audio.setTrebleGain);

    // instand of previous verisons, i went with a more compact way
    const checkboxes = [
        { id: "cb-visualizer", param: "visualizerType" },
        { id: "cb-sprites", param: "showSprites" },
        { id: "cb-gradient", param: "showGradient" },
        { id: "cb-bars", param: "showBars" },
        { id: "cb-circles", param: "showCircles" },
        { id: "cb-noise", param: "showNoise" },
        { id: "cb-invert", param: "showInvert" },
        { id: "cb-emboss", param: "showEmboss" }
    ];

    checkboxes.forEach(({ id, param }) => {
        const checkbox = document.querySelector(`#${id}`);
        checkbox.checked = avData.drawParams[param];
        checkbox.onchange = () => {
            avData.drawParams[param] = checkbox.checked;
        };
    });

    // progress bar
    const progressBar = document.querySelector("#progress-bar");
    progressBar.oninput = e => {
        let newTime = audio.getDuration() * (e.target.value / 100);
        audio.seekTo(newTime);
    }
}

const loop = () => {
    setTimeout(loop, 1000 / 60);
    canvas.draw(avData.drawParams);
    updateProgress();
}

/**
 * update the progress bar and label
 */
const updateProgress = () => {
    const progressBar = document.querySelector("#progress-bar");
    const progressLabel = document.querySelector("#progress-label");

    const currentTime = audio.getCurrentTime();
    const duration = audio.getDuration();

    if (duration > 0) {
        progressBar.value = (currentTime / duration) * 100;
        progressLabel.innerHTML = `${utils.formatTime(currentTime)} / ${utils.formatTime(duration)}`;
    }
}

export { preload, init };