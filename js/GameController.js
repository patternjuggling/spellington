export default class GameController {
    constructor(wordManager, uiHandler) {
        this.wordManager = wordManager;
        this.uiHandler = uiHandler;
        this.state = { score: 0, currentWordObj: null, isTransitioning: false };
    }

    async start() {
        const dataLoaded = await this.wordManager.init();
        if (!dataLoaded) {
            this.uiHandler.showError("Could not load game data.");
            return;
        }
        
        this.uiHandler.bindInputListener(this.handleInput.bind(this));
        
        // Bind the new hint listener
        this.uiHandler.bindHintListener(this.handleHint.bind(this));
        
        this.loadNextTurn();
    }

    handleHint() {
        if (this.state.isTransitioning || !this.state.currentWordObj) return;

        const fullWord = this.state.currentWordObj.Word;
        // Take the first 3 letters (or the whole word if it's shorter than 3)
        const hint = fullWord.substring(0, 3);
        
        this.uiHandler.showHintInInput(hint);
    }

    loadNextTurn() {
        this.state.isTransitioning = false;
        this.state.currentWordObj = this.wordManager.getNextWord();
        
        const correctWord = this.state.currentWordObj.Word;
        
        // 1. Get 3 random decoys
        const decoys = this.wordManager.getDecoys(3, correctWord);
        
        // 2. Combine with correct word and shuffle for the UI display
        const options = [correctWord, ...decoys];
        this.wordManager.shuffleArray(options);

        // 3. Render everything
        this.uiHandler.renderTurn(
            this.state.currentWordObj.Definition, 
            this.state.currentWordObj.Part_of_Speech,
            options
        );
    }

    handleInput(userInput) {
        if (this.state.isTransitioning) return;

        const targetWord = this.state.currentWordObj.Word.toLowerCase();
        const normalizedInput = userInput.trim().toLowerCase();

        if (normalizedInput === targetWord) {
            this.handleSuccess();
        } else if (normalizedInput.length >= targetWord.length || !targetWord.startsWith(normalizedInput)) {
            this.handleFailure();
        }
    }

    handleSuccess() {
        this.state.isTransitioning = true;
        this.state.score++;
        this.uiHandler.updateScore(this.state.score);
        this.uiHandler.triggerSuccessAnimation();
        setTimeout(() => this.loadNextTurn(), 800); 
    }

    handleFailure() {
        this.state.isTransitioning = true;
        this.uiHandler.triggerErrorAnimation();
        setTimeout(() => {
            this.uiHandler.clearInput();
            this.state.isTransitioning = false;
        }, 500); 
    }
}