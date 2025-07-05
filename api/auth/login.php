<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

include_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Email và mật khẩu là bắt buộc']);
    exit();
}

$email = trim($input['email']);
$password = $input['password'];

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email và mật khẩu không được để trống']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT id, full_name, email, password FROM users WHERE email = :email AND is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() == 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($password, $user['password'])) {
            // Update last login
            $updateQuery = "UPDATE users SET last_login = NOW() WHERE id = :id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':id', $user['id']);
            $updateStmt->execute();
            
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['email'] = $user['email'];
            
            // Set remember me cookie if requested
            if (isset($input['remember']) && $input['remember']) {
                $token = bin2hex(random_bytes(32));
                setcookie('remember_token', $token, time() + (86400 * 30), '/'); // 30 days
                
                // Store token in database
                $tokenQuery = "UPDATE users SET remember_token = :token WHERE id = :id";
                $tokenStmt = $db->prepare($tokenQuery);
                $tokenStmt->bindParam(':token', password_hash($token, PASSWORD_DEFAULT));
                $tokenStmt->bindParam(':id', $user['id']);
                $tokenStmt->execute();
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Đăng nhập thành công',
                'user' => [
                    'id' => $user['id'],
                    'full_name' => $user['full_name'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Mật khẩu không chính xác']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Email không tồn tại hoặc tài khoản đã bị khóa']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>