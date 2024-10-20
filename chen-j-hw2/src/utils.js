const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

const setupSlider = (sliderId, labelId, unit, setValueCallback) => {
    let slider = document.querySelector(sliderId);
    let label = document.querySelector(labelId);

    slider.oninput = e => {
        setValueCallback(e.target.value);
        label.innerHTML = `${e.target.value} ${unit}`;
    };

    // Trigger the event to set the initial label value
    slider.dispatchEvent(new Event("input"));
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(1, '0')}:${String(secs).padStart(2, '0')}`;
};

const fetchDrawParams = async () => {
    let drawParams = {};

    const response = await fetch('data/av-data.json');
    const data = await response.json();
    drawParams = data.drawParams;
    
    return data.drawParams;
}

const TOGGLE_BUTTONS = Object.freeze({
    PLAY: "https://c.animaapp.com/fgpR59jS/img/svgexport-35--1--1@2x.png",
    PAUSE: "https://c.animaapp.com/yPlj5CdF/img/svgexport-83-1.svg"
})

export { makeColor, getRandomColor, getLinearGradient, goFullscreen, setupSlider, formatTime, fetchDrawParams, TOGGLE_BUTTONS };