class Sprite {
    constructor(image) {
        this.image = image;
        this.rotationAngle = 0;
        this.rotationInterval = null;
    }

    startRotation() {
        if (this.rotationInterval) return;

        // rotate the image counter-clockwise
        const rotate = () => {
            this.rotationAngle -= 1;
            this.image.style.transform = `rotate(${this.rotationAngle}deg)`;
            this.rotationInterval = setTimeout(rotate, 1000 / 60);
        };

        rotate();
    }

    stopRotation() {
        if (this.rotationInterval) {
            // stop the rotation
            clearTimeout(this.rotationInterval);
            this.rotationInterval = null;
        }
        this.image.style.transform = '';
    }
}

class CanvasSprite {
    constructor(x, y, size, color, scale = 1) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.scale = scale;
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    }

    update(audioData, canvasWidth, canvasHeight) {
        const percent = audioData.reduce((a, b) => a + b) / (audioData.length * 255);

        // update size and position
        this.size = Math.max(percent * 100 * this.scale, 20);
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // bounce off the x edges
        if (this.x < 0 || this.x > canvasWidth) {
            this.velocity.x *= -1;
        }

        // bounce off the y edges
        if (this.y < 0 || this.y > canvasHeight) {
            this.velocity.y *= -1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

export { Sprite, CanvasSprite };