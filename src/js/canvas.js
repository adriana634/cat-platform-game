import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';
import playerOneStand from '../img/p1_stand.png';

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
    constructor({image, width, height}) {
        this.position = {
            x: 100,
            y: 100
        };

        this.velocity = {
            x: 0,
            y: 1
        };

        this.image = image;
        this.width = width;
        this.height = height;
    }

    draw() {
        canvasContext.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Canvas collision detection
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

        // Platform collision detection
        platforms.forEach(platform => {
            if (player.position.y + player.height <= platform.position.y &&
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x &&
                player.position.x + player.width <= platform.position.x + platform.width + 20) {
                player.velocity.y = 0;
            }
        });
    }
}

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
        canvasContext.drawImage(this.image, this.position.x, this.position.y);
    }
}

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

    draw() {
        canvasContext.drawImage(this.image, this.position.x, this.position.y);
    }
}

function createImage (imageSrc) {
    const image = new Image();
    image.src = imageSrc;  
    return image;  
}

const platformImage = createImage(platform);
const backgroundImage = createImage(background);
const hillsImage = createImage(hills);
const playerOneStandImage = createImage(playerOneStand);

const player = new Player({
    image: playerOneStandImage, 
    width: 66, 
    height: 92
});
const platforms = [
    new Platform({
        x: -1, 
        y: 506, 
        image: platformImage,
        width: 350,
        height: 70
    }), 
    new Platform({
        x: 345, 
        y: 506, 
        image: platformImage,
        width: 350,
        height: 70
    })
];

const sceneryItems = [
    new SceneryItem({
        x: 0, 
        y: 0, 
        image: backgroundImage,
        width: 1024,
        height: 576
    }), 
    new SceneryItem({
        x: 0, 
        y: 0, 
        image: hillsImage,
        width: 1024,
        height: 576
    })
];

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};

let scrollOffset = 0;

function animate() {
    requestAnimationFrame(animate);

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    sceneryItems.forEach(sceneryItem => {
        sceneryItem.draw();
    });

    platforms.forEach(platform => {
        platform.draw();

        if (keys.right.pressed && player.position.x < 400) {
            player.velocity.x = 5;
        } else if (keys.left.pressed && player.position.x > 100) {
            player.velocity.x = -5;
        } else {
            player.velocity.x = 0;
            
            if (keys.right.pressed) {
                scrollOffset += 5;
                platform.position.x -= 5;
            } else if (keys.left.pressed) {
                scrollOffset -= 5;
                platform.position.x += 5;
            }
        }
    });

    player.update();

    if (scrollOffset > 2000) {
        console.log('You win!!!');
    }
}

addEventListener('keydown', ({
    key
}) => {
    switch (key) {
        case 'ArrowLeft':
            keys.left.pressed = true;
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case 'ArrowUp':
            player.velocity.y -= 20;
            break;
    }
});

addEventListener('keyup', ({
    key
}) => {
    switch (key) {
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
    }
});

animate();