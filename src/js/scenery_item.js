class SceneryItem {
    constructor({x, y, image, width, height}) {
        this.position = {
            x,
            y
        };

        this.image = image;
        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y);
    }
}

export default SceneryItem;