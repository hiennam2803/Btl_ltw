<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['fullName']) || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Tất cả các trường là bắt buộc']);
    exit();
}

$fullName = trim($input['fullName']);
$email = trim($input['email']);
$password = $input['password'];

// Validation
if (empty($fullName) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Tất cả các trường không được để trống']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email không hợp lệ']);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['message' => 'Mật khẩu phải có ít nhất 6 ký tự']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if email already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(['message' => 'Email đã được sử dụng']);
        exit();
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $query = "INSERT INTO users (full_name, email, password, created_at) VALUES (:full_name, :email, :password, NOW())";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':full_name', $fullName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Đăng ký thành công'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Không thể tạo tài khoản']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>