<?php
header('Content-Type: application/json');
include_once '../config/database.php';

session_start();
// Test tạm user_id nếu chưa login
// $_SESSION['user_id'] = $_SESSION['user_id'] ?? 1;

// Kiểm tra đăng nhập
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Kết nối CSDL
$database = new Database();
$pdo = $database->getConnection();

try {
    $startOfWeek = date('Y-m-d', strtotime('monday this week'));
    $today = date('Y-m-d');

    // Thống kê tuần này
    $stmt = $pdo->prepare("SELECT COUNT(*) as count, SUM(duration) as duration, SUM(calories_burned) as calories FROM workout_logs WHERE user_id = ? AND workout_date >= ?");
    $stmt->execute([$user_id, $startOfWeek]);
    $weekStats = $stmt->fetch(PDO::FETCH_ASSOC);

    $goal = 5; // Mục tiêu buổi tập mỗi tuần
    $percentage = min(100, round(($weekStats['count'] / $goal) * 100));

    // Tính chuỗi streak ngày liên tiếp có tập
    $streak = 0;
    $date = $today;
    while (true) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM workout_logs WHERE user_id = ? AND workout_date = ?");
        $stmt->execute([$user_id, $date]);
        if ($stmt->fetchColumn() > 0) {
            $streak++;
            $date = date('Y-m-d', strtotime('-1 day', strtotime($date)));
        } else {
            break;
        }
    }

    // Trả kết quả
    echo json_encode([
        "thisWeek" => [
            "count" => (int)$weekStats['count'],
            "duration" => round(($weekStats['duration'] ?? 0) / 60, 1),
            "calories" => (int)$weekStats['calories'],
            "percentage" => $percentage
        ],
        "streak" => $streak
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
