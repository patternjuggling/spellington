import WordManager from './WordManager.js';
import UIHandler from './UIHandler.js';
import GameController from './GameController.js';

document.addEventListener('DOMContentLoaded', () => {
    const wordManager = new WordManager('./data/vocabulary_list.json');
    const uiHandler = new UIHandler();
    const game = new GameController(wordManager, uiHandler);
    
    game.start();
});