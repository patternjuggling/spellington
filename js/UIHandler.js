export default class UIHandler {
    constructor() {
        this.elements = {
            input: document.getElementById('word-input'),
            definition: document.getElementById('definition'),
            pos: document.getElementById('part-of-speech'),
            score: document.getElementById('score'),
            hintBtn: document.getElementById('hint-btn'),
            choices: document.getElementById('choices-container') // New
        };
    }

    bindInputListener(callback) {
        this.elements.input.addEventListener('input', (e) => {
            callback(e.target.value);
        });
    }

    renderTurn(definition, pos, options) {
        this.elements.definition.textContent = definition;
        this.elements.pos.textContent = pos;
        
        // Clear and render choices
        this.elements.choices.innerHTML = '';
        options.forEach(word => {
            const span = document.createElement('span');
            span.className = 'choice-item';
            span.textContent = word;
            this.elements.choices.appendChild(span);
        });

        this.clearInput();
        this.elements.input.focus();
    }

    updateScore(score) {
        this.elements.score.textContent = score;
    }

    triggerSuccessAnimation() {
        this.elements.input.classList.add('state-success');
    }

    triggerErrorAnimation() {
        this.elements.input.classList.add('state-error');
    }

    clearInput() {
        this.elements.input.value = '';
        this.elements.input.classList.remove('state-success', 'state-error');
    }

    showError(message) {
        this.elements.definition.textContent = message;
        this.elements.definition.style.color = "var(--error-color)";
    }
    bindHintListener(callback) {
        this.elements.hintBtn.addEventListener('click', () => {
            callback();
        });
    }

    showHintInInput(hintText) {
        this.elements.input.value = hintText;
        this.elements.input.focus();
        // Add a temporary class to show it's a hint
        this.elements.input.classList.add('hint-reveal');
        
        // Remove the hint styling once the user starts typing again
        const clearHintStyle = () => {
            this.elements.input.classList.remove('hint-reveal');
            this.elements.input.removeEventListener('input', clearHintStyle);
        };
        this.elements.input.addEventListener('input', clearHintStyle);
    }
}