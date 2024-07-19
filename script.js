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

let gameState = {};

function loadGameState() {
    fetch('/yatzy/api/game.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                gameState = data;
                console.log('Game state loaded:', gameState);
                updateUI();
                if (gameState.game_over) {
                    showFinalScorePopup();
                }
            }
        })
        .catch(error => console.error('Error loading game state:', error));
}

function saveGameState(action, data = {}) {
    fetch('/yatzy/api/game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...data })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                gameState = data;
                console.log(`Game state after ${action}:`, gameState);
                updateUI();
                if (gameState.game_over) {
                    showFinalScorePopup();
                }
            }
        })
        .catch(error => console.error('Error saving game state:', error));
}

function rollDice() {
    console.log('Rolling dice...');
    saveGameState('roll');
}

function submitScore(category) {
    console.log(`Submitting score for category: ${category}`);
    saveGameState('score', { category });
}

function resetGame() {
    console.log('Resetting game...');
    fetch('/yatzy/api/game.php', {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => {
            loadGameState();
        })
        .catch(error => console.error('Error resetting game:', error));
}

function updateUI() {
    console.log('Updating UI with game state:', gameState);
    diceElements.forEach((dice, index) => {
        dice.textContent = gameState.dice_values[index];
        if (gameState.keep_dice[index]) {
            dice.classList.add('selected');
        } else {
            dice.classList.remove('selected');
        }
    });

    rollButton.disabled = gameState.roll_count >= 3;
    submitScoreButton.disabled = gameState.roll_count === 0;

    // Update scores
    Object.keys(gameState.scores).forEach(category => {
        const scoreElement = document.getElementById(`score-${convertCategoryToId(category)}`);
        scoreElement.textContent = gameState.scores[category];
        if (gameState.scores[category] !== null) {
            scoreElement.classList.add('used');
        } else {
            scoreElement.classList.remove('used');
        }
    });

    // Update leaderboard
    fetch('/yatzy/api/leaderboard.php')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById('leaderboard-list');
            leaderboardList.innerHTML = '';
            data.forEach((score, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${score}`;
                leaderboardList.appendChild(li);
            });
        })
        .catch(error => console.error('Error updating leaderboard:', error));

    // Check for end of game
    if (Object.keys(gameState.scores).filter(key => gameState.scores[key] === null).length === 0) {
        showFinalScorePopup();
    }
}

rollButton.addEventListener('click', rollDice);

submitScoreButton.addEventListener('click', () => {
    const availableCategories = Object.keys(gameState.scores).filter(key => gameState.scores[key] === null);
    const chosenCategory = prompt(`Choose a category to score: ${availableCategories.join(', ')}`);

    if (availableCategories.length === 0) {
        console.error('No available categories left');
    } else {
        console.log('Available categories:', availableCategories);
    }

    if (availableCategories.includes(chosenCategory)) {
        submitScore(chosenCategory);
    } else {
        console.error('Invalid category chosen or category already scored');
        console.log('Chosen category:', chosenCategory);
        console.log('Available categories:', availableCategories);
        alert('Invalid category chosen or category already scored');
    }
});

diceElements.forEach((dice, index) => {
    dice.addEventListener('click', () => {
        if (gameState.roll_count > 0) {
            gameState.keep_dice[index] = !gameState.keep_dice[index];
            saveGameState('keep', { keep_dice: gameState.keep_dice });
            console.log(`Dice ${index + 1} selected status: ${gameState.keep_dice[index]}`);
            updateUI();
        }
    });
});

function showFinalScorePopup() {
    const finalScore = Object.values(gameState.scores).reduce((total, score) => total + (score || 0), 0);
    finalScorePopup.innerHTML = `
        <h2>Game Over</h2>
        <p>Your final score is ${finalScore}</p>
        <button onclick="closeFinalScorePopup()">Close</button>
    `;
    finalScorePopup.style.display = 'block';
    overlay.style.display = 'block';
    updateLeaderboard(finalScore);
}

function closeFinalScorePopup() {
    finalScorePopup.style.display = 'none';
    overlay.style.display = 'none';
    resetGame();
}

function updateLeaderboard(score) {
    fetch('/yatzy/api/leaderboard.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score })
    })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => console.error('Error updating leaderboard:', error));
}

function convertCategoryToId(category) {
    return category.replace(/([A-Z])/g, '-$1').toLowerCase();
}

loadGameState();
