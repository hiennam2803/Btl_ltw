<?php
header('Content-Type: application/json');
include_once '../config/database.php';

session_start();

// Tạm gán user_id nếu cần test
// $_SESSION['user_id'] = 1;

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Khởi tạo kết nối CSDL
$database = new Database();
$conn = $database->getConnection();

try {
    $stmt = $conn->prepare("SELECT * FROM workout_logs WHERE user_id = ? ORDER BY workout_date DESC");
    $stmt->execute([$user_id]);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($logs);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
