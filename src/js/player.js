import Input from './engine/input';

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

import { createImage } from './utils';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

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

const Player = {
    init() {
        this.position = {
            x: 100,
            y: 100
        };

        this.velocity = {
            x: 0,
            y: 1
        };

        this.images = playerOneImages;
        this.currentImageIndex = 0;
        this.width = 66;
        this.height = 92;

        this.fps = 16;
        this.animationUpdateTime = 1000 / this.fps;
        this.timeSinceLastFrameSwap = 0;

        this.walking = false;
    },

    draw() {
        ctx.drawImage(this.images[this.currentImageIndex], this.position.x, this.position.y);
    },

    update(elapsed) {
        this.timeSinceLastFrameSwap += elapsed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Jump
        if (Input.isPressed('up')) {
            this.velocity.y = -5;
        } else {
            this.velocity.y = 5;
        }

        if (Input.isPressed('left') || Input.isPressed('right')) {
            this.walking = true;
        } else {
            this.walking = false;
        }
        
        // Walking effect
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

        this.draw();
    }
};

export default Player;