/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

let drawParams;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "./media/Natlan Battle Theme.mp3"
});

const init = async () => {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    drawParams  = await utils.fetchDrawParams()
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

const setupUI = (canvasElement) => {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#btn-fs");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("goFullscreen() called");
        utils.goFullscreen(canvasElement);
    };

    //add .onclick even to button
    const playButton = document.querySelector("#btn-play");
    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        //check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if (e.target.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; //our css will set the text to "Pause"
        }
        //if track IS playing, pause it
        else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";// our CSS will set the text to "Play"
        }
    };

    // C - hookup volume slider and label
    let volumeSlider = document.querySelector("#slider-volume");
    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
    };
    volumeSlider.dispatchEvent(new Event("input"));

    //D - hookup track <select>
    let trackSelect = document.querySelector("#select-track");
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // Set up bass sliders
    utils.setupSlider("#slider-bass-frequency", "#label-bass-frequency", "Hz", audio.setBassFrequency);
    utils.setupSlider("#slider-bass-gain", "#label-bass-gain", "dB", audio.setBassGain);

    // Set up treble sliders
    utils.setupSlider("#slider-treble-frequency", "#label-treble-frequency", "Hz", audio.setTrebleFrequency);
    utils.setupSlider("#slider-treble-gain", "#label-treble-gain", "dB", audio.setTrebleGain);

    // instand of previous verisons, i went with a more compact way
    const checkboxes = [
        { id: "cb-gradient", param: "showGradient" },
        { id: "cb-bars", param: "showBars" },
        { id: "cb-circles", param: "showCircles" },
        { id: "cb-noise", param: "showNoise" },
        { id: "cb-invert", param: "showInvert" },
        { id: "cb-emboss", param: "showEmboss" }
    ];

    checkboxes.forEach(({ id, param }) => {
        const checkbox = document.querySelector(`#${id}`);
        checkbox.checked = drawParams[param];
        checkbox.onchange = () => {
            drawParams[param] = checkbox.checked;
        };
    });

    const progressBar = document.querySelector("#progress-bar");
    progressBar.oninput = e => {
        let newTime = audio.getDuration() * (e.target.value / 100);
        audio.seekTo(newTime);
    }
} // end setupUI

const loop = () => {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
    updateProgress();
}

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

export { init };