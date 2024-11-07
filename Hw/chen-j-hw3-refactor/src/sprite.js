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

export { Sprite };