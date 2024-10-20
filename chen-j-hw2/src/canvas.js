/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;


const setupCanvas = (canvasElement, analyserNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [
        { percent: 0, color: "#b3e5fc" },
        { percent: 0.5, color: "#ce93d8" },
        { percent: 1, color: "#fff59d" }
    ]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

const draw = (params = {}) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    if (params.visualizerType) {
        analyserNode.getByteFrequencyData(audioData);
    }
    else {
        // OR
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .8;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
    // 4 - draw bars, but revised
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
    // 5 - draw circles, but revised
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        
        ctx.save();
        ctx.globalAlpha = 0.5;

        for (let i = 0; i < audioData.length; i++) {
            const percent = audioData[i] !== undefined ? audioData[i] / 255 : 0; // Ensure percent is valid
            const pulse = Math.sin(Date.now() / 300 + i) * 0.05;
            
            // Calculate circle radius and clamp it to avoid negative values
            let circleRadius = Math.max((percent + pulse) * maxRadius, 0);
    
            // Draw the first circle
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 150, 150, 0.4 - percent / 3.0);
            ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
    
            // Draw the second circle with increased radius
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(135, 206, 250, 0.15 - percent / 10.0);
            ctx.arc(centerX, centerY, Math.max(circleRadius * 1.6 + pulse * 20, 0), 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
    
            ctx.save();
            
            // Draw the third circle with decreased radius
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 255, 100, 0.6 - percent / 5.0);
            ctx.arc(centerX, centerY, Math.max(circleRadius * 0.5 - pulse * 10, 0), 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            
            ctx.restore();
        }
    
        ctx.restore();
    
        // for (let i = 0; i < audioData.length; i++) {
        //     let percent = audioData[i] / 255;
        //     let pulse = Math.sin(Date.now() / 300 + i) * 0.05;
        //     let circleRadius = (percent + pulse) * maxRadius;

        //     ctx.beginPath();
        //     ctx.fillStyle = utils.makeColor(255, 150, 150, 0.4 - percent / 3.0);
        //     ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI, false);
        //     ctx.fill();
        //     ctx.closePath();
    
        //     ctx.beginPath();
        //     ctx.fillStyle = utils.makeColor(135, 206, 250, 0.15 - percent / 10.0);
        //     ctx.arc(centerX, centerY, circleRadius * 1.6 + pulse * 20, 0, 2 * Math.PI, false);
        //     ctx.fill();
        //     ctx.closePath();
    
        //     ctx.save();
        //     ctx.beginPath();
        //     ctx.fillStyle = utils.makeColor(255, 255, 100, 0.6 - percent / 5.0);
        //     ctx.arc(centerX, centerY, circleRadius * 0.5 - pulse * 10, 0, 2 * Math.PI, false);
        //     ctx.fill();
        //     ctx.closePath();
        //     ctx.restore();
        // }
    
        // ctx.restore();
    }

    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < .05) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // data[i+3] is the alpha channel
            data[i] = data[i + 1] = data[i + 2] = 255;// zero out the red and green and blue channels
            // data[i] = 255; make the red channel 100% red
        } // end if

        // invert?
        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
            //data[i + 3] is the alpha, but we're leaving that alone
        }
    } // end for

    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw, ctx };