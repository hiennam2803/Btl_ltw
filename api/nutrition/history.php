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

    // Truy vấn tổng calo mỗi ngày, và tính macros ước lượng
    $query = "
        SELECT 
            DATE(created_at) as date,
            ROUND(SUM(calories) * 0.45 / 4) AS carbs,
            ROUND(SUM(calories) * 0.25 / 4) AS protein,
            ROUND(SUM(calories) * 0.30 / 9) AS fat
        FROM nutrition_logs
        WHERE user_id = :user_id
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
        LIMIT 7
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
