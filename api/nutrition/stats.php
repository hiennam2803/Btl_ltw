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
    
    // Get today's nutrition stats
    $query = "SELECT SUM(calories) as total_calories FROM nutrition_logs WHERE user_id = :user_id AND DATE(created_at) = CURDATE()";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalCalories = $result['total_calories'] ?: 0;
    
    // Calculate estimated macros (rough estimates)
    $carbs = round($totalCalories * 0.45 / 4); // 45% of calories from carbs, 4 cal/g
    $protein = round($totalCalories * 0.25 / 4); // 25% of calories from protein, 4 cal/g
    $fat = round($totalCalories * 0.30 / 9); // 30% of calories from fat, 9 cal/g
    
    $stats = [
        'calories' => [
            'total' => $totalCalories,
            'goal' => 2000
        ],
        'macros' => [
            'carbs' => $carbs,
            'carbsPercent' => 45,
            'protein' => $protein,
            'proteinPercent' => 25,
            'fat' => $fat,
            'fatPercent' => 30
        ]
    ];
    
    echo json_encode($stats);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>