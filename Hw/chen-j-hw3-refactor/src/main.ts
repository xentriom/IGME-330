import * as utils from './utils';
import * as audio from './audio';
import * as canvas from './canvas';
import { Sprite } from './classes/Sprite';
import { Defaults } from './enums/main-defaults.enum';
import { DrawParams } from './interfaces/drawParams.interface';
import { AVData } from './interfaces/avData.interface';
import { ToggleButtons } from './enums/toggle-buttons.enum';

let avData: AVData;

const preload = async (): Promise<AVData> => {
    // fetch and store the data
    const response = await fetch("data/av-data.json");
    avData = await response.json() as AVData;

    return avData;
}

const init = (): void => {
    audio.setupWebaudio(Defaults.SOUND_ONE);

    // set up canvas ui
    const canvasElement = document.querySelector("canvas") as HTMLCanvasElement;
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    // set up track selection
    const trackElement = document.querySelector("#track-selection") as HTMLElement;
    setupTracks(trackElement);

    loop();
}

const setupTracks = (trackElement: HTMLElement): void => {
    const sprites = new Map<HTMLElement, Sprite>();

    // create a div for each track
    for (const track of avData.data) {
        let div = document.createElement("div");
        div.classList.add("box", "tracks", "track-info", "mb-5");
        div.dataset.name = track.name;
        div.dataset.path = track.path;

        const mediaDiv = document.createElement("div");
        mediaDiv.classList.add("media");

        const mediaLeft = document.createElement("div");
        mediaLeft.classList.add("media-left");

        const figure = document.createElement("figure");
        figure.classList.add("image", "is-48x48");

        const img = document.createElement("img");
        img.classList.add("is-rounded");
        img.src = track.image;
        figure.appendChild(img);
        mediaLeft.appendChild(figure);
        mediaDiv.appendChild(mediaLeft);

        const sprite = new Sprite(img);
        sprites.set(div, sprite);

        const mediaContent = document.createElement("div");
        mediaContent.classList.add("media-content");

        const h3 = document.createElement("h3");
        h3.classList.add("title", "is-size-6");
        h3.innerHTML = track.name;
        mediaContent.appendChild(h3);

        const p = document.createElement("p");
        p.classList.add("subtitle", "is-size-7");
        p.innerHTML = track.author;
        mediaContent.appendChild(p);

        mediaDiv.appendChild(mediaContent);
        div.appendChild(mediaDiv);
        trackElement.appendChild(div);
    }

    // start the first sprite rotation
    const initSpirte = sprites.values().next().value;
    initSpirte?.startRotation();

    // set up click event
    const playButton = document.querySelector("#btn-play") as HTMLButtonElement;
    const playButtonImage = playButton.querySelector("img") as HTMLImageElement;

    trackElement.onclick = (e: Event) => {
        const trackDiv = (e.target as HTMLElement).closest(".box") as HTMLElement;

        if (trackDiv) {
            const trackPath = trackDiv.dataset.path;
            if (trackPath) {
                audio.loadSoundFile(trackPath);

                sprites.forEach((sprite, div) => {
                    div === trackDiv ? sprite.startRotation() : sprite.stopRotation();
                });

                playButtonImage.src = ToggleButtons.PAUSE;
            }
        }
    }
}

const setupUI = (canvasElement: HTMLCanvasElement): void => {
    // burger menu
    const burgerIcon = document.querySelector('#burger') as HTMLElement;
    const navbarMenu = document.querySelector('#nav-links') as HTMLElement;

    burgerIcon.addEventListener('click', () => {
        navbarMenu.classList.toggle('is-active');
    });

    // full screen button
    const fsButton = document.querySelector("#btn-fs") as HTMLButtonElement;
    fsButton.onclick = () => utils.goFullscreen(canvasElement);

    // play/pause button
    const playButton = document.querySelector("#btn-play") as HTMLButtonElement;
    const playButtonImage = playButton.querySelector("img") as HTMLImageElement;
    playButton.onclick = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLButtonElement;

        if (audio.audioCtx.state === "suspended") {
            audio.audioCtx.resume();
        }

        if (target.dataset.playing === "no") {
            audio.playCurrentSound();
            target.dataset.playing = "yes";
            playButtonImage.src = ToggleButtons.PLAY;
        } else {
            audio.pauseCurrentSound();
            target.dataset.playing = "no";
            playButtonImage.src = ToggleButtons.PAUSE;
        }
    };

    // volume slider
    const volumeSlider = document.querySelector("#slider-volume") as HTMLInputElement;
    volumeSlider.oninput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        audio.setVolume(Number(target.value));
    };
    volumeSlider.dispatchEvent(new Event("input"));

    // Set up bass sliders
    utils.setupSlider({
        sliderId: "#slider-bass-frequency",
        labelId: "#label-bass-frequency",
        unit: "Hz",
        setValueCallback: audio.setBassFrequency
    });
    utils.setupSlider({
        sliderId: "#slider-bass-gain",
        labelId: "#label-bass-gain",
        unit: "dB",
        setValueCallback: audio.setBassGain
    });

    // Set up treble sliders
    utils.setupSlider({
        sliderId: "#slider-treble-frequency",
        labelId: "#label-treble-frequency",
        unit: "Hz",
        setValueCallback: audio.setTrebleFrequency
    });
    utils.setupSlider({
        sliderId: "#slider-treble-gain",
        labelId: "#label-treble-gain",
        unit: "dB",
        setValueCallback: audio.setTrebleGain
    });

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
        const checkbox = document.querySelector(`#${id}`) as HTMLInputElement;
        checkbox.checked = avData.drawParams[param as keyof DrawParams];
        checkbox.onchange = () => {
            avData.drawParams[param as keyof DrawParams] = checkbox.checked;
        };
    });

    const progressBar = document.querySelector("#progress-bar") as HTMLInputElement;
    progressBar.oninput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const newTime = audio.getDuration() * (Number(target.value) / 100);
        audio.seekTo(newTime);
    };
}

const loop = (): void => {
    setTimeout(loop, 1000 / 60);
    canvas.draw(avData.drawParams);
    updateProgress();
}

/**
 * update the progress bar and label
 */
const updateProgress = (): void => {
    const progressBar = document.querySelector("#progress-bar") as HTMLInputElement;
    const progressLabel = document.querySelector("#progress-label") as HTMLElement;

    const currentTime = audio.getCurrentTime();
    const duration = audio.getDuration();

    if (duration > 0) {
        progressBar.value = ((currentTime / duration) * 100).toString();
        progressLabel.innerHTML = `${utils.formatTime(currentTime)} / ${utils.formatTime(duration)}`;
    }
}

export { preload, init };