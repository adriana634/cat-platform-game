import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';

import Input from './engine/input';
import Player from './player';
import Platform from './platform';
import SceneryItem from './scenery_item';

import { createImage } from './utils';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

const platformImage = createImage(platform);
const backgroundImage = createImage(background);
const hillsImage = createImage(hills);

Player.init();

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

function handleCollisions() {
    // Canvas collision detection
    if (Player.position.y + Player.height + Player.velocity.y <= canvas.height) {
        Player.velocity.y += gravity;
    } else {
        Player.velocity.y = 0;
    }

    // Platform collision detection
    platforms.forEach(platform => {
        if (Player.position.y + Player.height <= platform.position.y &&
            Player.position.y + Player.height + Player.velocity.y >= platform.position.y &&
            Player.position.x + Player.width >= platform.position.x &&
            Player.position.x + Player.width <= platform.position.x + platform.width + 20) {
            Player.velocity.y = 0;
        }
    });
}

let scrollOffset = 0;
let lastTimeStamp = 0;
let elapsed = 0;

function animate(currentTimeStamp) {
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

        if (Input.isPressed('right') && Player.position.x < 400) {
            Player.velocity.x = 5;
        } else if (Input.isPressed('left') && Player.position.x > 100) {
            Player.velocity.x = -5;
        } else {
            Player.velocity.x = 0;
            
            if (Input.isPressed('right')) {
                scrollOffset += 5;
                platform.position.x -= 5;
            } else if (Input.isPressed('left')) {
                scrollOffset -= 5;
                platform.position.x += 5;
            }
        }
    });

    handleCollisions();

    Player.update(elapsed);

    if (scrollOffset > 2000) {
        console.log('You win!!!');
    }

    requestAnimationFrame(animate);
}

Input.init();

animate();