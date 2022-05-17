const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Platform {
    constructor({x, y, image, width, height}) {
        this.position = {
            x,
            y
        };

        this.image = image;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

export default Platform;