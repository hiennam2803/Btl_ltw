<?php
header('Content-Type: application/json');
include_once '../config/database.php';

session_start();
// $_SESSION['user_id'] = 1; // Chỉ test, sau này xóa khi có login thật

// Kết nối cơ sở dữ liệu
$database = new Database();
$conn = $database->getConnection();

// Kiểm tra đăng nhập
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Chưa đăng nhập"]);
    exit;
}

// $user_id = $_SESSION['user_id'];

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $_SESSION['user_id'];
    $type = $data['workoutType'];
    $duration = (int) $data['duration'];
    $notes = trim($data['notes'] ?? '');
    $date = $data['workoutDate'];

    // Tính calo theo loại bài tập
    $caloriesPerHour = [
        'cardio' => 500,
        'strength' => 400,
        'yoga' => 200,
        'running' => 600,
        'swimming' => 550,
        'cycling' => 450
    ];

    $calories = $data['caloriesBurned'] ?? 0;
    if (!$calories) {
        $calories = round(($caloriesPerHour[$type] ?? 400) * $duration / 60);
    }

    $stmt = $conn->prepare("INSERT INTO workout_logs (user_id, workout_type, duration, calories_burned, workout_date, notes) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $type, $duration, $calories, $date, $notes]);

    echo json_encode(["success" => true, "message" => "Đã thêm buổi tập"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
