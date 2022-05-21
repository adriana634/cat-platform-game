import Game from './game';

const startGameButton = document.querySelector('button');
startGameButton.addEventListener('click', startGame);

function startGame() {
    const canvasElement = document.createElement("canvas");
    const body = document.querySelector('body');
    startGameButton.remove();
    body.appendChild(canvasElement);

    Game.init();
    Game.loadAssets();
    Game.setupGame();
    Game.render();
    Game.playMusic();
}