# yatzy
Single Player Yatzy Game

## Description

This web-based Yatzy game  allows a single player to roll dice and score points in different categories. The game ends when all score categories have been used, and the final score is displayed. The game also keeps track of the high score, which is saved in the browser's local storage.

## Usage

- Click the "Roll Dice" button to roll the dice.
- Click on individual dice to select or deselect them for keeping.
- After up to three rolls, select a category to score in.
- The game will indicate used categories with a star.
- Once all categories are used, the final score will be displayed.
- The high score will be updated if the current score exceeds the previous high score.

## Game Rules

- **Rolling Dice**: The player can roll five dice up to three times per turn.
- **Selecting Dice**: After each roll, the player can choose which dice to keep and which to reroll.
- **Scoring**: The player must select a category to score in after each turn. Each category can only be used once.
- **End of Game**: The game ends when all score categories have been used. The final score is then displayed, and if it is higher than the current high score, the high score is updated.

## Design System

The design system for this project includes the following components:

- **Header**: Contains the game title and high score.
- **Main Area**: Includes the scoreboard and dice area.
- **Buttons**: For rolling dice and submitting scores.
- **Popup**: Displays the final score and indicates if a new high score is achieved.

For more details, refer to the [Design System Documentation](docs/design_system.md).



## API Endpoints

### Game State

- **GET /api/game.php**: Get the current game state.
- **POST /api/game.php**: Update the game state (roll dice, score category).
- **DELETE /api/game.php**: Reset the game state.

### Leaderboard

- **GET /api/leaderboard.php**: Get the current leaderboard.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd yatzy-game
    ```

2. Set up a local PHP server:
    ```sh
    php -S localhost:8000
    ```

3. Open `index.html` in your web browser:
    ```sh
    open http://localhost:8000/index.html
    ```
