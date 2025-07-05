-- UTH Health & Fitness Tracking Database

CREATE DATABASE IF NOT EXISTS uth_health;
USE uth_health;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT NULL,
    gender ENUM('male', 'female', 'other') NULL,
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(255) NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height INT NOT NULL,
    systolic_bp INT NULL,
    diastolic_bp INT NULL,
    heart_rate INT NULL,
    measure_date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Nutrition logs table
CREATE TABLE nutrition_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    calories INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Workout logs table
CREATE TABLE workout_logs (
    
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workout_type VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    calories_burned INT NOT NULL,
    workout_date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sleep logs table
CREATE TABLE sleep_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bedtime TIME NOT NULL,
    wake_time TIME NOT NULL,
    sleep_date DATE NOT NULL,
    quality INT NOT NULL CHECK (quality >= 1 AND quality <= 10),
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goals table
CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    target_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (full_name, email, password, age, gender) VALUES
('Nguyễn Văn An', 'admin@uth.edu.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 22, 'male');

-- Sample health record
INSERT INTO health_records (user_id, weight, height, systolic_bp, diastolic_bp, heart_rate, measure_date, notes) VALUES
(1, 70.0, 175, 120, 80, 72, CURDATE(), 'Cảm thấy khỏe mạnh');

-- Sample nutrition logs
INSERT INTO nutrition_logs (user_id, meal_type, food_name, quantity, calories) VALUES
(1, 'breakfast', 'Bánh mì thịt', 200, 320),
(1, 'breakfast', 'Sữa tươi', 250, 150),
(1, 'lunch', 'Cơm gà nướng', 300, 650),
(1, 'lunch', 'Canh chua', 200, 80);

-- Sample workout logs
INSERT INTO workout_logs (user_id, workout_type, duration, calories_burned, workout_date, notes) VALUES
(1, 'running', 30, 320, CURDATE(), 'Chạy bộ buổi sáng'),
(1, 'strength', 45, 280, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Tập ngực và vai');

-- Sample sleep logs
INSERT INTO sleep_logs (user_id, bedtime, wake_time, sleep_date, quality, notes) VALUES
(1, '23:00:00', '07:00:00', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 8, 'Ngủ ngon');

-- Create indexes for better performance
CREATE INDEX idx_health_user_date ON health_records(user_id, measure_date);
CREATE INDEX idx_nutrition_user_date ON nutrition_logs(user_id, created_at);
CREATE INDEX idx_workout_user_date ON workout_logs(user_id, workout_date);
CREATE INDEX idx_sleep_user_date ON sleep_logs(user_id, sleep_date);