import Input from './engine/input';
import Player from './player';
import Platform from './platform';
import SceneryItem from './scenery_item';

import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';

import { createImage } from './utils';

const Game = {
    WIN_TEXT: 'You win!!!',
    GAME_OVER_TEXT: 'Game Over',

    init() {
        this.canvas                 = document.querySelector('canvas');
        this.context                = this.canvas.getContext('2d');

        this.width                  = 1024;
        this.height                 = 576;

        this.gravity                = 0.5;

        this.scrollOffset           = 0;
        this.lastFrameTimeStamp     = 0;
        this.elapsedSinceLastFrame  = 0;

        this.images                 = {};

        this.endOfGame              = false;
    },

    loadAssets() {
        this.images['platform']     = createImage(platform);
        this.images['background']   = createImage(background);
        this.images['hills']        = createImage(hills);
    },

    setupGame() {
        this.platforms = [
            new Platform({
                x: -1, 
                y: 506, 
                image: this.images['platform'],
                width: 350,
                height: 70
            }), 
            new Platform({
                x: 345, 
                y: 506, 
                image: this.images['platform'],
                width: 350,
                height: 70
            }),
            new Platform({
                x: 800, 
                y: 506, 
                image: this.images['platform'],
                width: 350,
                height: 70
            }),
            new Platform({
                x: 1145, 
                y: 506, 
                image: this.images['platform'],
                width: 350,
                height: 70
            })
        ];

        this.sceneryItems = [
            new SceneryItem({
                x: 0, 
                y: 0, 
                image: this.images['background'],
                width: 1024,
                height: 576
            }), 
            new SceneryItem({
                x: 0, 
                y: 0, 
                image: this.images['hills'],
                width: 1024,
                height: 576
            })
        ];

        Input.init();
        Player.init();

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    handleCollisions() {
        // Canvas collision detection
        if (Player.position.y + Player.height + Player.velocity.y <= this.height) {
            Player.velocity.y += this.gravity;
        }
    
        // Platform collision detection
        this.platforms.forEach(platform => {
            if (Player.position.y + Player.height <= platform.position.y &&
                Player.position.y + Player.height + Player.velocity.y >= platform.position.y &&
                Player.position.x + Player.width >= platform.position.x &&
                Player.position.x + Player.width <= platform.position.x + platform.width + 20) {
                Player.velocity.y = 0;
            }
        });
    },

    handlePlayerMovement() {
        if (Input.isPressed('right') && Player.position.x < 400) {
            Player.velocity.x = 5;
        } else if (Input.isPressed('left') && Player.position.x > 100) {
            Player.velocity.x = -5;
        } else {
            Player.velocity.x = 0;
            
            if (Input.isPressed('right')) {
                this.scrollOffset += 5;

                // Platforms movement
                this.platforms.forEach(platform => platform.position.x -= 5);

                // Parallax effect
                this.sceneryItems.forEach(sceneryItem => sceneryItem.position.x -= 3);
            } else if (Input.isPressed('left')) {
                this.scrollOffset -= 5;

                // Platforms movement
                this.platforms.forEach(platform => platform.position.x += 5);

                // Parallax effect
                this.sceneryItems.forEach(sceneryItem => sceneryItem.position.x += 3);
            }
        }
    },

    displayCenteredText(text) {
        this.context.font = '64px sans-serif';

        const textWidth = this.context.measureText(text).width;
        const { x, y } = { 
            x: (this.width / 2) - (textWidth / 2), 
            y: this.height / 2 
        };

        this.context.fillText(text, x, y);
    },

    render(currentFrameTimeStamp) {
        // Check slapsed time
        if (currentFrameTimeStamp) {
            this.elapsedSinceLastFrame = currentFrameTimeStamp - this.lastFrameTimeStamp;
            this.lastFrameTimeStamp = currentFrameTimeStamp;
        } else {
            this.elapsedSinceLastFrame = 0;
            this.lastFrameTimeStamp = 0;
        }
    
        // Clear the screen
        this.context.clearRect(0, 0, this.width, this.height);
        
        // Updates
        Player.update(this.elapsedSinceLastFrame);
        
        // Handle player movement
        this.handlePlayerMovement();

        // Handle collisions
        this.handleCollisions();

        // Draw scenery items
        this.sceneryItems.forEach(sceneryItem => sceneryItem.draw(this.context));

        // Draw platforms
        this.platforms.forEach(platform => platform.draw(this.context));

        // Draw player
        Player.draw(this.context);
        
        // Win condition
        if (this.scrollOffset > 2000) {
            this.endOfGame = true;
            this.displayCenteredText(Game.WIN_TEXT);
        }

        // Lose condition
        if (Player.position.y > this.canvas.height) {
            this.endOfGame = true;
            this.displayCenteredText(Game.GAME_OVER_TEXT);
        }
    
        // Loop
        if (this.endOfGame == false) {
            requestAnimationFrame(this.render.bind(this));
        }
    }
}

export default Game;