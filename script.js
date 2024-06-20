const diceElements = document.querySelectorAll('.dice');
const rollButton = document.getElementById('roll-button');
const submitScoreButton = document.getElementById('submit-score-button');
const highScoreElement = document.getElementById('high-score-value');
const finalScorePopup = document.createElement('div');
const overlay = document.createElement('div');

finalScorePopup.id = 'final-score-popup';
overlay.id = 'overlay';

document.body.appendChild(finalScorePopup);
document.body.appendChild(overlay);

let rollCount = 0;
let diceValues = [0, 0, 0, 0, 0];
const keepDice = [false, false, false, false, false];
const scores = {
    aces: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeKind: null,
    fourKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    chance: null,
    yatzy: null
};
let highScore = 0;

diceElements.forEach(dice => {
    dice.textContent = '-';
    dice.classList.add('initial');
});

loadHighScore();

rollButton.addEventListener('click', () => {
    rollCount++;
    rollDice();
    updateDiceDisplay();
    if (rollCount >= 3) {
        rollButton.disabled = true;
    }
    if (rollCount === 1) {
        diceElements.forEach(dice => {
            dice.classList.remove('initial');
        });
    }
    submitScoreButton.disabled = false;
});

diceElements.forEach((dice, index) => {
    dice.addEventListener('click', () => {
        if (rollCount > 0) {
            keepDice[index] = !keepDice[index];
            dice.classList.toggle('selected');
        }
    });
});

submitScoreButton.addEventListener('click', () => {
    const availableCategories = Object.keys(scores).filter(key => scores[key] === null);
    const chosenCategory = prompt(`Choose a category to score: ${availableCategories.join(', ')}`);

    if (availableCategories.includes(chosenCategory)) {
        scores[chosenCategory] = calculateScore(chosenCategory, diceValues);
        document.getElementById(`score-${convertCategoryToId(chosenCategory)}`).textContent = scores[chosenCategory];
        document.getElementById(`score-${convertCategoryToId(chosenCategory)}`).classList.add('used');
        updateHighScore();
        if (Object.values(scores).every(score => score !== null)) {
            showFinalScorePopup();
        } else {
            resetTurn();
        }
    } else {
        alert('Invalid category chosen or category already scored');
    }
});

function rollDice() {
    for (let i = 0; i < diceValues.length; i++) {
        if (!keepDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
}

function updateDiceDisplay() {
    diceElements.forEach((dice, index) => {
        dice.textContent = diceValues[index];
    });
}

function resetTurn() {
    rollCount = 0;
    diceValues = [0, 0, 0, 0, 0];
    keepDice.fill(false);
    diceElements.forEach(dice => {
        dice.textContent = '-';
        dice.classList.add('initial');
        dice.classList.remove('selected');
    });
    rollButton.disabled = false;
    submitScoreButton.disabled = true;
}

function calculateScore(category, diceValues) {
    const counts = [0, 0, 0, 0, 0, 0];
    diceValues.forEach(value => counts[value - 1]++);

    switch (category) {
        case 'aces':
            return counts[0] * 1;
        case 'twos':
            return counts[1] * 2;
        case 'threes':
            return counts[2] * 3;
        case 'fours':
            return counts[3] * 4;
        case 'fives':
            return counts[4] * 5;
        case 'sixes':
            return counts[5] * 6;
        case 'threeKind':
            return counts.some(count => count >= 3) ? diceValues.reduce((a, b) => a + b) : 0;
        case 'fourKind':
            return counts.some(count => count >= 4) ? diceValues.reduce((a, b) => a + b) : 0;
        case 'fullHouse':
            return counts.includes(3) && counts.includes(2) ? 25 : 0;
        case 'smallStraight':
            return [1, 2, 3, 4, 5].every(num => diceValues.includes(num)) ||
            [2, 3, 4, 5, 6].every(num => diceValues.includes(num)) ? 30 : 0;
        case 'largeStraight':
            return [1, 2, 3, 4, 5, 6].every(num => diceValues.includes(num)) ? 40 : 0;
        case 'chance':
            return diceValues.reduce((a, b) => a + b);
        case 'yatzy':
            return counts.some(count => count === 5) ? 50 : 0;
        default:
            return 0;
    }
}

function convertCategoryToId(category) {
    switch (category) {
        case 'aces': return 'aces';
        case 'twos': return 'twos';
        case 'threes': return 'threes';
        case 'fours': return 'fours';
        case 'fives': return 'fives';
        case 'sixes': return 'sixes';
        case 'threeKind': return 'three-kind';
        case 'fourKind': return 'four-kind';
        case 'fullHouse': return 'full-house';
        case 'smallStraight': return 'small-straight';
        case 'largeStraight': return 'large-straight';
        case 'chance': return 'chance';
        case 'yatzy': return 'yatzy';
        default: return '';
    }
}

function updateHighScore() {
    const currentScore = Object.values(scores).reduce((total, score) => total + (score || 0), 0);
    if (currentScore > highScore) {
        highScore = currentScore;
        saveHighScore();
        if (highScoreElement) {
            highScoreElement.textContent = highScore;
        }
    }
}

function loadHighScore() {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore, 10);
        if (highScoreElement) {
            highScoreElement.textContent = highScore;
        }
    } else {
        highScore = null;
        if (highScoreElement) {
            highScoreElement.textContent = ''; // this broke the layout around 5 times
        }
    }
}
function saveHighScore() {
    localStorage.setItem('highScore', highScore);
}