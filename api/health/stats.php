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

    $stats = [];

    // Lấy bản ghi mới nhất
    $query = "SELECT * FROM health_records WHERE user_id = :user_id ORDER BY measure_date DESC LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $latest = $stmt->fetch(PDO::FETCH_ASSOC);

        // So sánh cân nặng với lần trước
        $weightQuery = "SELECT weight FROM health_records WHERE user_id = :user_id ORDER BY measure_date DESC LIMIT 2";
        $weightStmt = $db->prepare($weightQuery);
        $weightStmt->bindParam(':user_id', $userId);
        $weightStmt->execute();

        $weights = $weightStmt->fetchAll(PDO::FETCH_ASSOC);
        $weightChange = '';
        if (count($weights) >= 2) {
            $change = $weights[0]['weight'] - $weights[1]['weight'];
            if ($change > 0) {
                $weightChange = "↑ " . number_format($change, 1) . "kg từ lần trước";
            } elseif ($change < 0) {
                $weightChange = "↓ " . number_format(abs($change), 1) . "kg từ lần trước";
            } else {
                $weightChange = "Không thay đổi";
            }
        }

        $stats['weight'] = [
            'current' => (float)$latest['weight'],
            'change' => $weightChange
        ];

        // BMI
        $bmi = $latest['weight'] / (($latest['height'] / 100) ** 2);
        $bmi = round($bmi, 1);
        $bmiStatus = 'Bình thường';
        if ($bmi < 18.5) $bmiStatus = 'Thiếu cân';
        elseif ($bmi >= 25 && $bmi < 30) $bmiStatus = 'Thừa cân';
        elseif ($bmi >= 30) $bmiStatus = 'Béo phì';

        $stats['bmi'] = [
            'value' => $bmi,
            'status' => $bmiStatus
        ];

        // Huyết áp
        $bpValue = $latest['systolic_bp'] . '/' . $latest['diastolic_bp'];
        $bpStatus = 'Tốt';
        if ($latest['systolic_bp'] >= 140 || $latest['diastolic_bp'] >= 90) {
            $bpStatus = 'Cao';
        } elseif ($latest['systolic_bp'] < 90 || $latest['diastolic_bp'] < 60) {
            $bpStatus = 'Thấp';
        }

        $stats['bloodPressure'] = [
            'value' => $bpValue,
            'status' => $bpStatus
        ];

        // Nhịp tim
        $hrStatus = 'Bình thường';
        if ($latest['heart_rate'] > 100) {
            $hrStatus = 'Cao';
        } elseif ($latest['heart_rate'] < 60) {
            $hrStatus = 'Thấp';
        }

        $stats['heartRate'] = [
            'value' => (int)$latest['heart_rate'],
            'status' => $hrStatus
        ];
    }

    // Lấy toàn bộ lịch sử 
    $historyQuery = "SELECT weight, height, systolic_bp, diastolic_bp, heart_rate, measure_date 
                     FROM health_records 
                     WHERE user_id = :user_id 
                     ORDER BY measure_date ASC";
    $historyStmt = $db->prepare($historyQuery);
    $historyStmt->bindParam(':user_id', $userId);
    $historyStmt->execute();

    $history = [];
    while ($row = $historyStmt->fetch(PDO::FETCH_ASSOC)) {
        $bmi = round($row['weight'] / pow($row['height'] / 100, 2), 1);
        $history[] = [
            'measure_date' => $row['measure_date'],
            'weight' => (float)$row['weight'],
            'height' => (int)$row['height'],
            'bmi' => $bmi,
            'systolic' => (int)$row['systolic_bp'],
            'diastolic' => (int)$row['diastolic_bp'],
            'heart_rate' => (int)$row['heart_rate']
        ];
    }

    $stats['history'] = $history;

    echo json_encode($stats);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
