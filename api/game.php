<?php
session_start();

if (!isset($_SESSION['game_state'])) {
    resetGameState();
}

$requestMethod = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

switch ($requestMethod) {
    case 'GET':
        echo json_encode($_SESSION['game_state']);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action'])) {
            handleAction($data['action'], $data);
        }
        echo json_encode($_SESSION['game_state']);
        break;
    case 'DELETE':
        resetGameState();
        echo json_encode(['message' => 'Game reset']);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function handleAction($action, $data) {
    switch ($action) {
        case 'roll':
            if (!$_SESSION['game_state']['game_over']) {
                rollDice();
            }
            break;
        case 'score':
            if (isset($data['category']) && !isset($_SESSION['game_state']['scores'][$data['category']])) {
                scoreCategory($data['category']);
            } else {
                echo json_encode(['error' => 'Invalid or already scored category']);
            }
            break;
        case 'keep':
            if (isset($data['keep_dice'])) {
                $_SESSION['game_state']['keep_dice'] = $data['keep_dice'];
            }
            break;
    }
}

function rollDice() {
    if ($_SESSION['game_state']['roll_count'] < 3) {
        for ($i = 0; $i < 5; $i++) {
            if (!$_SESSION['game_state']['keep_dice'][$i]) {
                $_SESSION['game_state']['dice_values'][$i] = rand(1, 6);
            }
        }
        $_SESSION['game_state']['roll_count']++;
    }
    error_log('Roll Dice - Dice Values: ' . json_encode($_SESSION['game_state']['dice_values']));
}

function scoreCategory($category) {
    $_SESSION['game_state']['scores'][$category] = calculateScore($category, $_SESSION['game_state']['dice_values']);
    $_SESSION['game_state']['roll_count'] = 0;
    $_SESSION['game_state']['dice_values'] = [0, 0, 0, 0, 0];
    $_SESSION['game_state']['keep_dice'] = [false, false, false, false, false];
    checkGameOver();
}

function calculateScore($category, $diceValues) {
    $counts = array_count_values($diceValues);
    switch ($category) {
        case 'aces':
            return (isset($counts[1]) ? $counts[1] : 0) * 1;
        case 'twos':
            return (isset($counts[2]) ? $counts[2] : 0) * 2;
        case 'threes':
            return (isset($counts[3]) ? $counts[3] : 0) * 3;
        case 'fours':
            return (isset($counts[4]) ? $counts[4] : 0) * 4;
        case 'fives':
            return (isset($counts[5]) ? $counts[5] : 0) * 5;
        case 'sixes':
            return (isset($counts[6]) ? $counts[6] : 0) * 6;
        case 'threeKind':
            return max($counts) >= 3 ? array_sum($diceValues) : 0;
        case 'fourKind':
            return max($counts) >= 4 ? array_sum($diceValues) : 0;
        case 'fullHouse':
            return count($counts) == 2 && in_array(3, $counts) ? 25 : 0;
        case 'smallStraight':
            return checkStraight($diceValues, 4) ? 30 : 0;
        case 'largeStraight':
            return checkStraight($diceValues, 5) ? 40 : 0;
        case 'chance':
            return array_sum($diceValues);
        case 'yatzy':
            return max($counts) == 5 ? 50 : 0;
        default:
            return 0;
    }
}

function checkStraight($diceValues, $length) {
    $straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [1, 2, 3, 4, 5],
        [2, 3, 4, 5, 6]
    ];
    foreach ($straights as $straight) {
        if (count(array_intersect($straight, $diceValues)) >= $length) {
            return true;
        }
    }
    return false;
}

function checkGameOver() {
    if (count(array_filter($_SESSION['game_state']['scores'], function ($score) {
            return $score !== null;
        })) == 13) {
        $_SESSION['game_state']['game_over'] = true;
    }
}

function resetGameState() {
    $_SESSION['game_state'] = [
        'roll_count' => 0,
        'dice_values' => [0, 0, 0, 0, 0],
        'keep_dice' => [false, false, false, false, false],
        'scores' => [
            'aces' => null,
            'twos' => null,
            'threes' => null,
            'fours' => null,
            'fives' => null,
            'sixes' => null,
            'threeKind' => null,
            'fourKind' => null,
            'fullHouse' => null,
            'smallStraight' => null,
            'largeStraight' => null,
            'chance' => null,
            'yatzy' => null
        ],
        'game_over' => false
    ];
    error_log('Game State Reset');
}
?>
