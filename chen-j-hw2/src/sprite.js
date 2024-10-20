class Sprite {
    constructor(image, x, y) {
        this.image = image;
        this.rotationAngle = 0;
        this.rotationInterval = null;
    }

    startRotation() {
        if (this.rotationInterval) return;

        const rotate = () => {
            this.rotationAngle -= 1;
            this.image.style.transform = `rotate(${this.rotationAngle}deg)`;
            this.rotationInterval = requestAnimationFrame(rotate);
        };

        rotate();
    }

    stopRotation() {
        if (this.rotationInterval) {
            cancelAnimationFrame(this.rotationInterval);
            this.rotationInterval = null;
        }
        this.image.style.transform = '';
    }
}

export { Sprite };