export class Sprite {
    image: HTMLImageElement;
    rotationAngle: number;
    rotationInterval: NodeJS.Timeout | null;

    constructor(image: HTMLImageElement) {
        this.image = image;
        this.rotationAngle = 0;
        this.rotationInterval = null;
    }

    startRotation(): void {
        if (this.rotationInterval) return;

        const rotate = () => {
            this.rotationAngle -= 1;
            this.image.style.transform = `rotate(${this.rotationAngle}deg)`;
            this.rotationInterval = setTimeout(rotate, 1000 / 60) as unknown as NodeJS.Timeout;
        };

        rotate();
    }

    stopRotation(): void {
        if (this.rotationInterval) {
            clearTimeout(this.rotationInterval);
            this.rotationInterval = null;
        }
        this.image.style.transform = '';
    }
}