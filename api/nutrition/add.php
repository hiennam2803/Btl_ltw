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

if (!$input || !isset($input['foodName'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Chưa nhập tên món ăn!']);
    exit();
}

// Hàm dịch văn bản sử dụng Google Apps Script
function translateText($text) {
    $url = "https://script.google.com/macros/s/AKfycbzaDdjozCE4Y17-0JRhKd1mJclxFd56ei7rsarFld7xgg6DL5VtzBsHYBtKfuPmFRa0zA/exec";

    $postData = http_build_query([
        'q' => $text
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception("Lỗi khi gọi translate API: " . curl_error($ch));
    }

    curl_close($ch);

    // Giải mã JSON
    $data = json_decode($response, true);

    // Ghi log để kiểm tra response thực tế
    error_log("Response from translation API: " . $response);

    if (!isset($data['translatedText'])) {
        throw new Exception("API dịch không trả kết quả hợp lệ.");
    }

    return trim($data['translatedText']);
}



// API Nutritionix
function getNutritionData($foodName) {
    $url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
    $app_id = "71691517";
    $app_key = "5d41925bebb6b5309b1b61e82817bd1f";

    $postData = [
        "query" => trim($foodName),
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-app-id: $app_id",
        "x-app-key: $app_key",
        "Content-Type: application/json"
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception("Lỗi cURL: " . curl_error($ch));
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if (!isset($data['foods'])) {
        throw new Exception("Dữ liệu không hợp lệ từ API Nutritionix");
    }

    return $data['foods'];
}

try {
    $translatedText = trim(translateText($input['foodName']));
    error_log("Translated text: $translatedText");
    $foods = getNutritionData($translatedText);

    $database = new Database();
    $db = $database->getConnection();
    $userId = $_SESSION['user_id'];

    $query = "INSERT INTO nutrition_logs (user_id, meal_type, food_name, calories, quantity, created_at) 
              VALUES (:user_id, :meal_type, :food_name, :calories, :quantity, NOW())";
    $stmt = $db->prepare($query);

    $inserted = 0;

    foreach ($foods as $food) {
        $stmt->execute([
            ':user_id' => $userId,
            ':meal_type' => $input['mealType'],
            ':food_name' => $food['food_name'],
            ':calories' => $food['nf_calories'],
            ':quantity' => $food['serving_weight_grams'],
        ]);
        $inserted++;
    }

    echo json_encode([
        'success' => true,
        'message' => "Đã thêm món ăn thành công!"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}


?>
