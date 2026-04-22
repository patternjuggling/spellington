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
        // Loop back and reshuffle if we run out
        if (this.currentIndex >= this.vocabulary.length) {
            this.currentIndex = 0;
            this.shuffleArray(this.vocabulary); 
        }
        return this.vocabulary[this.currentIndex];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // New: Get decoy words for the multiple choice display
    getDecoys(count, correctWord) {
        // Filter out the correct word to ensure no duplicates
        const others = this.vocabulary.filter(item => item.Word !== correctWord);
        
        // Shuffle the others and take the first N
        this.shuffleArray(others);
        return others.slice(0, count).map(item => item.Word);
    }
}