class CollectibleItem {
    constructor({ x, y, image, width, height, points }) {
        this.position = {
            x,
            y
        };

        this.image = image;
        this.width = width;
        this.height = height;

        this.points = points;

        this.collected = false;
    }

    draw(context) {
        if (this.collected === false) {
            context.drawImage(this.image, this.position.x, this.position.y);
        }
    }

    collect() {
        this.collected = true;
    }
}

export default CollectibleItem;