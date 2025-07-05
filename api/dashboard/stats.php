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
    
    $stats = [];
    
    // BMI Stats
    $bmiQuery = "SELECT weight, height FROM health_records WHERE user_id = :user_id ORDER BY measure_date DESC LIMIT 1";
    $bmiStmt = $db->prepare($bmiQuery);
    $bmiStmt->bindParam(':user_id', $userId);
    $bmiStmt->execute();
    
    if ($bmiStmt->rowCount() > 0) {
        $health = $bmiStmt->fetch(PDO::FETCH_ASSOC);
        $bmi = $health['weight'] / (($health['height'] / 100) ** 2);
        $bmi = round($bmi, 1);
        
        $status = 'Bình thường';
        if ($bmi < 18.5) $status = 'Thiếu cân';
        elseif ($bmi >= 25) $status = 'Thừa cân';
        elseif ($bmi >= 30) $status = 'Béo phì';
        
        $stats['bmi'] = [
            'value' => $bmi,
            'status' => $status
        ];
    }
    
    // Calories today
    $caloriesQuery = "SELECT SUM(calories) as total FROM nutrition_logs WHERE user_id = :user_id AND DATE(created_at) = CURDATE()";
    $caloriesStmt = $db->prepare($caloriesQuery);
    $caloriesStmt->bindParam(':user_id', $userId);
    $caloriesStmt->execute();
    
    $caloriesResult = $caloriesStmt->fetch(PDO::FETCH_ASSOC);
    $stats['calories'] = [
        'today' => $caloriesResult['total'] ?: 0,
        'goal' => 2000
    ];
    
    // Workouts this week
    $workoutsQuery = "SELECT COUNT(*) as count FROM workout_logs WHERE user_id = :user_id AND YEARWEEK(workout_date) = YEARWEEK(NOW())";
    $workoutsStmt = $db->prepare($workoutsQuery);
    $workoutsStmt->bindParam(':user_id', $userId);
    $workoutsStmt->execute();
    
    $workoutsResult = $workoutsStmt->fetch(PDO::FETCH_ASSOC);
    $workoutCount = $workoutsResult['count'];
    $stats['workouts'] = [
        'count' => $workoutCount . '/5',
        'progress' => round(($workoutCount / 5) * 100) . '% hoàn thành'
    ];
    
    // Sleep average
    $sleepQuery = "SELECT AVG(TIMESTAMPDIFF(HOUR, bedtime, wake_time)) as avg_duration FROM sleep_logs WHERE user_id = :user_id AND sleep_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    $sleepStmt = $db->prepare($sleepQuery);
    $sleepStmt->bindParam(':user_id', $userId);
    $sleepStmt->execute();
    
    $sleepResult = $sleepStmt->fetch(PDO::FETCH_ASSOC);
    $avgSleep = $sleepResult['avg_duration'] ? round($sleepResult['avg_duration'], 1) : 0;
    $stats['sleep'] = [
        'average' => $avgSleep,
        'quality' => $avgSleep >= 7 ? 'Tốt' : 'Cần cải thiện'
    ];
    
    echo json_encode($stats);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>