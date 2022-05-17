import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';
import playerOneStand from '../img/p1_stand.png';
import playerOneWalk1 from '../img/p1_walk01.png';
import playerOneWalk2 from '../img/p1_walk02.png';
import playerOneWalk3 from '../img/p1_walk03.png';
import playerOneWalk4 from '../img/p1_walk04.png';
import playerOneWalk5 from '../img/p1_walk05.png';
import playerOneWalk6 from '../img/p1_walk06.png';
import playerOneWalk7 from '../img/p1_walk07.png';
import playerOneWalk8 from '../img/p1_walk08.png';
import playerOneWalk9 from '../img/p1_walk09.png';
import playerOneWalk10 from '../img/p1_walk10.png';
import playerOneWalk11 from '../img/p1_walk11.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
    constructor({images, width, height}) {
        this.position = {
            x: 100,
            y: 100
        };

        this.velocity = {
            x: 0,
            y: 1
        };

        this.images = images;
        this.currentImageIndex = 0;
        this.width = width;
        this.height = height;

        this.fps = 16;
        this.animationUpdateTime = 1000 / this.fps;
        this.timeSinceLastFrameSwap = 0;

        this.walking = false;
    }

    draw() {
        ctx.drawImage(this.images[this.currentImageIndex], this.position.x, this.position.y);
    }

    update(elapsed) {
        this.timeSinceLastFrameSwap += elapsed;
        
        this.draw();
        
        if (this.walking === true) {

            if (this.timeSinceLastFrameSwap > this.animationUpdateTime) {
                
                // Next walk image
                if (this.currentImageIndex == this.images.length - 1) {
                    this.currentImageIndex = 0;
                } else {
                    this.currentImageIndex += 1;
                }

                this.timeSinceLastFrameSwap = 0;
            }
        }

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
        ctx.drawImage(this.image, this.position.x, this.position.y);
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
        ctx.drawImage(this.image, this.position.x, this.position.y);
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

const playerOneImages = [
    createImage(playerOneStand),
    createImage(playerOneWalk1),
    createImage(playerOneWalk2),
    createImage(playerOneWalk3),
    createImage(playerOneWalk4),
    createImage(playerOneWalk5),
    createImage(playerOneWalk6),
    createImage(playerOneWalk7),
    createImage(playerOneWalk8),
    createImage(playerOneWalk9),
    createImage(playerOneWalk10),
    createImage(playerOneWalk11),
];

const player = new Player({
    images: playerOneImages, 
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
let lastTimeStamp = 0;
let elapsed = 0;

function animate(currentTimeStamp) {
    requestAnimationFrame(animate);

    if (currentTimeStamp) {
        elapsed = currentTimeStamp - lastTimeStamp;
        lastTimeStamp = currentTimeStamp;
    } else {
        elapsed = 0;
        lastTimeStamp = 0;
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    player.update(elapsed);

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
            player.walking = true;
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            player.walking = true;
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
            player.walking = false;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            player.walking = false;
            break;
    }
});

animate();