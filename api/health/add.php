<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

include_once '../config/database.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['weight']) || !isset($input['height'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Cân nặng và chiều cao là bắt buộc']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $userId = $_SESSION['user_id'];
    
    $query = "INSERT INTO health_records (user_id, weight, height, systolic_bp, diastolic_bp, heart_rate, measure_date, notes, created_at) 
              VALUES (:user_id, :weight, :height, :systolic, :diastolic, :heart_rate, :measure_date, :notes, NOW())";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':weight', $input['weight']);
    $stmt->bindParam(':height', $input['height']);
    $stmt->bindParam(':systolic', $input['systolic']);
    $stmt->bindParam(':diastolic', $input['diastolic']);
    $stmt->bindParam(':heart_rate', $input['heartRate']);
    $stmt->bindParam(':measure_date', $input['measureDate']);
    $stmt->bindParam(':notes', $input['notes']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Đã lưu thông tin sức khỏe thành công'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Không thể lưu thông tin sức khỏe']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>