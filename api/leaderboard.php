<?php
session_start();

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

$requestMethod = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

switch ($requestMethod) {
    case 'GET':
        echo json_encode($_SESSION['leaderboard']);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['score'])) {
            updateLeaderboard($data['score']);
        }
        echo json_encode($_SESSION['leaderboard']);
        break;
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

function updateLeaderboard($score) {
    $_SESSION['leaderboard'][] = $score;
    rsort($_SESSION['leaderboard']);
    $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
}
?>
