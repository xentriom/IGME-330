import { ColorStop } from "./interfaces/colorStop.interface";
import { SliderConfig } from "./interfaces/sliderConfig.interface";

const makeColor = (red: number, green: number, blue: number, alpha: number = 1): string => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = (): string => {
    const floor = 35;
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, colorStops: ColorStop[]): CanvasGradient => {
    const lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (const stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

const goFullscreen = (element: HTMLElement): void => {
    // fun fact: lint standards require else if to be in new line
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
};

const setupSlider = ({ sliderId, labelId, unit, setValueCallback }: SliderConfig): void => {
    const slider = document.querySelector(sliderId) as HTMLInputElement;
    const label = document.querySelector(labelId) as HTMLLabelElement;

    slider.oninput = e => {
        if (e.target) {
            setValueCallback(Number((e.target as HTMLInputElement).value));
            label.innerHTML = `${(e.target as HTMLInputElement).value} ${unit}`;
        }
    };

    slider.dispatchEvent(new Event("input"));
};

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // format time as mm:ss
    return `${String(minutes).padStart(1, '0')}:${String(secs).padStart(2, '0')}`;
};


export { makeColor, getRandomColor, getLinearGradient, goFullscreen, setupSlider, formatTime };