import Input from './engine/input';
import Player from './player';

import Platforms from './platforms';
import Platform from './platform';

import SceneryItems from './scenery_items';
import SceneryItem from './scenery_item';

import CollectibleItems from './collectible_items';
import CollectibleItem from './collectible_item';

import Enemies from './enemies';
import Enemy from './enemy';

import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';

import coinBronze from '../img/coinBronze.png';
import coinGold from '../img/coinGold.png';
import coinSilver from '../img/coinSilver.png';
import gemBlue from '../img/gemBlue.png';
import gemGreen from '../img/gemGreen.png';
import gemRed from '../img/gemRed.png';
import gemYellow from '../img/gemYellow.png';

import slimeWalkOne from '../img/slimeWalk1.png';
import slimeWalkOneReverse from '../img/slimeWalk1_reverse.png';

import stageOne from '../music/stage_1.wav';

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

        this.score                  = 0;

        this.endOfGame              = false;
    },

    loadAssets() {
        this.images['platform']             = createImage(platform);
        this.images['background']           = createImage(background);
        this.images['hills']                = createImage(hills);
        this.images['coinBronze']           = createImage(coinBronze);
        this.images['coinGold']             = createImage(coinGold);
        this.images['coinSilver']           = createImage(coinSilver);
        this.images['gemBlue']              = createImage(gemBlue);
        this.images['gemGreen']             = createImage(gemGreen);
        this.images['gemRed']               = createImage(gemRed);
        this.images['gemYellow']            = createImage(gemYellow);
        this.images['slimeWalkOne']         = createImage(slimeWalkOne);
        this.images['slimeWalkOneReverse']  = createImage(slimeWalkOneReverse);
    },

    setupGame() {
        this.platforms = Platforms.map(platform => new Platform({
            x: platform.x, 
            y: platform.y, 
            image: this.images['platform'],
            width: 350,
            height: 70
        }));

        this.sceneryItems = SceneryItems.map(sceneryItem => new SceneryItem({
            x: sceneryItem.x, 
            y: sceneryItem.y, 
            image: this.images[sceneryItem.image],
            width: 1024,
            height: 576
        }));

        this.collectibleItems = CollectibleItems.map(collectibleItem => new CollectibleItem({
            x: collectibleItem.x, 
            y: collectibleItem.y, 
            image: this.images[collectibleItem.image],
            width: collectibleItem.width,
            height: collectibleItem.height,
            points: collectibleItem.points
        }));

        this.enemies = Enemies.map(enemy => new Enemy({
            x: enemy.x, 
            y: enemy.y, 
            waypoints: enemy.waypoints,
            image: this.images[enemy.image],
            imageReverse: this.images[enemy.imageReverse],
            width: 50,
            height: 28
        }));

        Input.init();
        Player.init();

        this.audioElement = document.createElement("audio");
        this.audioElement.src = stageOne;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    handleCollisions() {
        // Canvas collision detection (player)
        if (Player.position.y + Player.height + Player.velocity.y <= this.height) {
            Player.velocity.y += this.gravity;
        }

        // Canvas collision detection (enemies)
        this.enemies.forEach(enemy => {
            if (enemy.position.y + enemy.height + enemy.velocity.y <= this.height) {
                enemy.velocity.y += this.gravity;
            }
        });
    
        // Platform collision detection (player)
        this.platforms.forEach(platform => {
            if (Player.position.y + Player.height <= platform.position.y &&
                Player.position.y + Player.height + Player.velocity.y >= platform.position.y &&
                Player.position.x + Player.width >= platform.position.x &&
                Player.position.x + Player.width <= platform.position.x + platform.width + 20) {
                Player.velocity.y = 0;
            }
        });

        // Platform collision detection (enemies)
        this.platforms.forEach(platform => {
            this.enemies.forEach(enemy => {
                if (enemy.position.y + enemy.height <= platform.position.y &&
                    enemy.position.y + enemy.height + enemy.velocity.y >= platform.position.y &&
                    enemy.position.x + enemy.width >= platform.position.x &&
                    enemy.position.x + enemy.width <= platform.position.x + platform.width + 20) {
                    enemy.velocity.y = 0;
                }
            });
        });

        // Collectible items collision detection
        this.collectibleItems.forEach(collectibleItem => {
            const collisionOffsetX = Player.position.x - collectibleItem.position.x;
            const collisionOffsetY = Player.position.y - collectibleItem.position.y;

            if (collisionOffsetX >= -10 && collisionOffsetX <= 10 
                && collisionOffsetY >= -100 && collisionOffsetY <= 100) {
                collectibleItem.collect();
            }
        });

        // Remove collected items and update score
        for (let i = this.collectibleItems.length - 1; i >= 0; i--) {
            const collectibleItem = this.collectibleItems[i];
            if (collectibleItem.collected) {
                this.score += collectibleItem.points;
                this.collectibleItems.splice(i, 1);
            }
        }
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

                // Collectible items movement
                this.collectibleItems.forEach(collectibleItem => collectibleItem.position.x -= 5);

                // Enemies movement
                this.enemies.forEach(enemy => enemy.position.x -= 5);

                // Parallax effect
                this.sceneryItems.forEach(sceneryItem => sceneryItem.position.x -= 3);
            } else if (Input.isPressed('left')) {
                this.scrollOffset -= 5;

                // Platforms movement
                this.platforms.forEach(platform => platform.position.x += 5);

                // Collectible items movement
                this.collectibleItems.forEach(collectibleItem => collectibleItem.position.x += 5);

                // Enemies movement
                this.enemies.forEach(enemy => enemy.position.x += 5);

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

    displayScore() {
        this.context.font = '32px sans-serif';
        this.context.fillText(`Score: ${this.score}`, 10, 30);
    },

    playMusic() {
        this.audioElement.play();
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

        // Draw collectible items
        this.collectibleItems.forEach(collectibleItem => collectibleItem.draw(this.context));

        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.context));

        // Draw player
        Player.draw(this.context);
        
        // Display score
        this.displayScore();

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