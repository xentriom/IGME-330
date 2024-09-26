import { getRandomColor, getRandomInt } from "./utils.js";
import { drawRectangle, drawArc, drawLine } from "./canvas-utils.js";

let canvas, ctx;
let paused = false;
let createRectangles = true;
let createArcs = true;
let createLines = true;

const init = () => {
    console.log("page loaded!");

    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    drawRectangle(ctx, 0, 0, canvas.width, canvas.height, "red");

    setupUI();
    update();
};

const update = () => {
    if (paused) return;
    requestAnimationFrame(update);

    if (createRectangles) drawRandomRect(ctx);
    if (createArcs) drawRandomArc(ctx);
    if (createLines) drawRandomLine(ctx);
}

const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(20, 50);
        let color = getRandomColor();
        drawArc(ctx, x, y, radius, color);
    }
}

// Draw a random rectangle
const drawRandomRect = (ctx) => {
    drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(), getRandomInt(2, 12), getRandomColor());
}

// Draw a random arc
const drawRandomArc = (ctx) => {
    drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomColor(), getRandomInt(2, 12), getRandomColor());
}

// Draw a random line
const drawRandomLine = (ctx) => {
    drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(2, 12), getRandomColor());
}

// Setup UI
const setupUI = () => {
    document.querySelector("#btn-pause").onclick = () => {
        paused = true;
    };

    document.querySelector("#btn-play").onclick = () => {
        if (!paused) return;
        paused = false;
        update();
    };

    document.querySelector("#btn-clear").onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRectangle(ctx, 0, 0, canvas.width, canvas.height, "red");
    };

    document.querySelector("#cb-rectangles").onclick = (e) => {
        createRectangles = e.target.checked;
        if (createRectangles) update();
    };

    document.querySelector("#cb-arcs").onclick = (e) => {
        createArcs = e.target.checked;
        if (createArcs) update();
    };

    document.querySelector("#cb-lines").onclick = (e) => {
        createLines = e.target.checked;
        if (createLines) update();
    };

    canvas.onclick = canvasClicked;
}

init();