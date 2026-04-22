export default class WordManager {
    constructor(dataPath) {
        this.dataPath = dataPath;
        this.vocabulary = [];
        this.currentIndex = -1;
    }

    async init() {
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) throw new Error('Network response was not ok');
            this.vocabulary = await response.json();
            this.shuffleArray(this.vocabulary);
            return true;
        } catch (error) {
            console.error("Failed to load vocabulary:", error);
            return false;
        }
    }

    getNextWord() {
        if (this.vocabulary.length === 0) return null;
        
        this.currentIndex++;
        if (this.currentIndex >= this.vocabulary.length) {
            this.currentIndex = 0;
            this.shuffleArray(this.vocabulary); 
        }
        return this.vocabulary[this.currentIndex];
    }

    // Still used to shuffle the 4 choices so the correct one isn't always first
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}