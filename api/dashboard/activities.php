<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $userId = $_SESSION['user_id'];
    
    $activities = [];
    
    // Get recent workouts
    $workoutQuery = "SELECT workout_type, calories_burned, TIME(created_at) as time FROM workout_logs WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 3";
    $workoutStmt = $db->prepare($workoutQuery);
    $workoutStmt->bindParam(':user_id', $userId);
    $workoutStmt->execute();
    
    $workouts = $workoutStmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($workouts as $workout) {
        $activities[] = [
            'name' => getWorkoutName($workout['workout_type']),
            'time' => date('H:i', strtotime($workout['time'])),
            'calories' => $workout['calories_burned']
        ];
    }
    
    // Get recent meals
    $mealQuery = "SELECT food_name, calories, TIME(created_at) as time FROM nutrition_logs WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 2";
    $mealStmt = $db->prepare($mealQuery);
    $mealStmt->bindParam(':user_id', $userId);
    $mealStmt->execute();
    
    $meals = $mealStmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($meals as $meal) {
        $activities[] = [
            'name' => $meal['food_name'],
            'time' => date('H:i', strtotime($meal['time'])),
            'calories' => $meal['calories']
        ];
    }
    
    // Sort by time (most recent first)
    usort($activities, function($a, $b) {
        return strcmp($b['time'], $a['time']);
    });
    
    echo json_encode(array_slice($activities, 0, 5));
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}

function getWorkoutName($type) {
    $types = [
        'cardio' => 'Cardio',
        'strength' => 'Tập tạ',
        'yoga' => 'Yoga',
        'running' => 'Chạy bộ',
        'swimming' => 'Bơi lội',
        'cycling' => 'Đạp xe'
    ];
    return $types[$type] ?? $type;
}
?>