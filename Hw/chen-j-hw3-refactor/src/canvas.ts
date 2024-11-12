import * as utils from './utils';
import { CanvasSprite } from './classes/CanvasSprite';
import { DrawParams } from './interfaces/drawParams.interface';

let ctx: CanvasRenderingContext2D;
let canvasWidth: number;
let canvasHeight: number;
let gradient: CanvasGradient;
let analyserNode: AnalyserNode;
let audioData: Uint8Array;

let sprite1: CanvasSprite;
let sprite2: CanvasSprite;
let sprite3: CanvasSprite;

const setupCanvas = (canvasElement: HTMLCanvasElement, analyserNodeRef: AnalyserNode): void => {
    ctx = canvasElement.getContext("2d")!;
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;

    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [
        { percent: 0, color: "#b3e5fc" },
        { percent: 0.5, color: "#ce93d8" },
        { percent: 1, color: "#fff59d" }
    ]);

    analyserNode = analyserNodeRef;
    audioData = new Uint8Array(analyserNode.fftSize / 2);

    // create sprites
    sprite1 = new CanvasSprite(100, 100, 10, 'rgba(255, 0, 0, 0.2)', 1);
    sprite2 = new CanvasSprite(100, 100, 10, 'rgba(0, 0, 255, 0.2)', 0.5);
    sprite3 = new CanvasSprite(100, 100, 10, 'rgba(0, 255, 0, 0.2)', 0.25);
}

const draw = (params: DrawParams = {
    visualizerType: false,
    showSprites: false,
    showGradient: false,
    showBars: false,
    showCircles: false, 
    showNoise: false,
    showInvert: false,
    showEmboss: false
}) => {
    // draw visualizer depending on the type
    if (params.visualizerType) {
        analyserNode.getByteFrequencyData(audioData);
    } else {
        analyserNode.getByteTimeDomainData(audioData);
    }

    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // show gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .8;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    // show bars
    if (params.showBars) {
        const barSpacing = 2;
        const margin = 0;
        const screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin;
        const barWidth = screenWidthForBars / audioData.length;

        ctx.save();

        const gradient = ctx.createLinearGradient(0, canvasHeight, 0, 0);
        gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
        gradient.addColorStop(1, 'rgba(255,105,180,0.85)');

        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';

        for (let i = 0; i < audioData.length; i++) {
            const barHeight = Math.max((audioData[i] / 255) * canvasHeight * 0.8, 1);
            const x = margin + i * (barWidth + barSpacing);
            const y = canvasHeight - barHeight;

            ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(barWidth), Math.ceil(barHeight));
            ctx.strokeRect(Math.floor(x), Math.floor(y), Math.ceil(barWidth), Math.ceil(barHeight));
        }

        ctx.restore();
    }

    // show circles
    if (params.showCircles) {
        const maxRadius = canvasHeight / 4;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        ctx.save();
        ctx.globalAlpha = 0.5;

        for (let i = 0; i < audioData.length; i++) {
            const percent = audioData[i] !== undefined ? audioData[i] / 255 : 0;
            const pulse = Math.sin(Date.now() / 300 + i) * 0.05;
            let circleRadius = Math.max((percent + pulse) * maxRadius, 0);

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 150, 150, 0.4 - percent / 3.0);
            ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(135, 206, 250, 0.15 - percent / 10.0);
            ctx.arc(centerX, centerY, Math.max(circleRadius * 1.6 + pulse * 20, 0), 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.save();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 255, 100, 0.6 - percent / 5.0);
            ctx.arc(centerX, centerY, Math.max(circleRadius * 0.5 - pulse * 10, 0), 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }

        ctx.restore();
    }

    // show sprites
    if (params.showSprites) {
        sprite1.update(audioData, canvasWidth, canvasHeight);
        sprite2.update(audioData, canvasWidth, canvasHeight);
        sprite3.update(audioData, canvasWidth, canvasHeight);

        sprite1.draw(ctx);
        sprite2.draw(ctx);
        sprite3.draw(ctx);
    }

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    const length = data.length;
    const width = imageData.width;

    for (let i = 0; i < length; i += 4) {
        // show noise
        if (params.showNoise && Math.random() < .05) {
            data[i] = data[i + 1] = data[i + 2] = 255;
        }

        // show invert
        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
        }
    }

    // show emboss
    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue;
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw, ctx };