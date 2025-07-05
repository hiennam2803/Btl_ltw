<?php
header('Content-Type: application/json');
include_once '../config/database.php';

session_start();

// Gán user_id tạm để test (nếu chưa có hệ thống đăng nhập)
// $_SESSION['user_id'] = $_SESSION['user_id'] ?? 1;

// Kiểm tra đăng nhập
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
    $today = date('Y-m-d');

    $stmt = $conn->prepare("SELECT * FROM workout_logs WHERE user_id = ? AND workout_date = ?");
    $stmt->execute([$user_id, $today]);

    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($logs);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
