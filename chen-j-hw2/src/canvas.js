import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

const setupCanvas = (canvasElement, analyserNodeRef) => {
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;

    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [
        { percent: 0, color: "#b3e5fc" },
        { percent: 0.5, color: "#ce93d8" },
        { percent: 1, color: "#fff59d" }
    ]);

    analyserNode = analyserNodeRef;
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

const draw = (params = {}) => {
    params.visualizerType 
        ? analyserNode.getByteFrequencyData(audioData)
        : analyserNode.getByteTimeDomainData(audioData);

    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .8;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    if (params.showBars) {
        let barSpacing = 2;
        let margin = 0;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin;
        let barWidth = screenWidthForBars / audioData.length;
    
        ctx.save();
        
        let gradient = ctx.createLinearGradient(0, canvasHeight, 0, 0);
        gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
        gradient.addColorStop(1, 'rgba(255,105,180,0.85)');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
    
        for (let i = 0; i < audioData.length; i++) {
            let barHeight = Math.max((audioData[i] / 255) * canvasHeight * 0.8, 1);
            let x = margin + i * (barWidth + barSpacing);
            let y = canvasHeight - barHeight;
    
            ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(barWidth), Math.ceil(barHeight));
            ctx.strokeRect(Math.floor(x), Math.floor(y), Math.ceil(barWidth), Math.ceil(barHeight));
        }
    
        ctx.restore();
    }

    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        
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

    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    for (let i = 0; i < length; i += 4) {
        if (params.showNoise && Math.random() < .05) {
            data[i] = data[i + 1] = data[i + 2] = 255;
        }

        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
        }
    }

    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue;
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw, ctx };