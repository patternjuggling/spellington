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
        this.uiHandler.bindHintListener(this.handleHint.bind(this));
        this.loadNextTurn();
    }

    loadNextTurn() {
        this.state.isTransitioning = false;
        const wordData = this.wordManager.getNextWord();
        this.state.currentWordObj = wordData;

        // 1. Gather the correct spelling and the 3 specific distractors
        const choices = [
            wordData.Correct_Spelling,
            wordData.Distractor_1,
            wordData.Distractor_2,
            wordData.Distractor_3
        ];

        // 2. Shuffle them so the correct one appears in a random position
        this.wordManager.shuffleArray(choices);

        // 3. Render
        this.uiHandler.renderTurn(
            wordData.Definition, 
            wordData.Part_of_Speech,
            choices
        );
    }

    handleInput(userInput) {
        if (this.state.isTransitioning) return;

        // Update: Use 'Correct_Spelling' instead of 'Word'
        const targetWord = this.state.currentWordObj.Correct_Spelling.toLowerCase();
        const normalizedInput = userInput.trim().toLowerCase();

        if (normalizedInput === targetWord) {
            this.handleSuccess();
        } else if (normalizedInput.length >= targetWord.length || !targetWord.startsWith(normalizedInput)) {
            this.handleFailure();
        }
    }

    handleHint() {
        if (this.state.isTransitioning || !this.state.currentWordObj) return;
        // Update: Use 'Correct_Spelling'
        const hint = this.state.currentWordObj.Correct_Spelling.substring(0, 3);
        this.uiHandler.showHintInInput(hint);
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