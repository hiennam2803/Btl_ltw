# Thiết kế cơ sở dữ liệu

## Bảng `users`

| Tên cột         | Kiểu dữ liệu           | Ràng buộc                             | Ghi chú                           |
|------------------|------------------------|----------------------------------------|-----------------------------------|
| id               | INT                    | PK, AUTO_INCREMENT                    | Khóa chính                        |
| full_name        | VARCHAR(100)           | NOT NULL                              | Họ và tên đầy đủ                 |
| email            | VARCHAR(100)           | UNIQUE, NOT NULL                      | Email duy nhất                   |
| password         | VARCHAR(255)           | NOT NULL                              | Mật khẩu đã mã hóa               |
| age              | INT                    | NULL                                  | Tuổi                              |
| gender           | ENUM('male','female','other') | NULL                             | Giới tính                         |
| is_active        | BOOLEAN                | DEFAULT TRUE                          | Trạng thái hoạt động             |
| remember_token   | VARCHAR(255)           | NULL                                  | Token ghi nhớ đăng nhập          |
| last_login       | TIMESTAMP              | NULL                                  | Lần đăng nhập cuối               |
| created_at       | TIMESTAMP              | DEFAULT CURRENT_TIMESTAMP             | Thời gian tạo                    |
| updated_at       | TIMESTAMP              | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật cuối |

## Bảng `health_records`

| Tên cột       | Kiểu dữ liệu    | Ràng buộc             | Ghi chú                        |
|---------------|------------------|------------------------|--------------------------------|
| id            | INT              | PK, AUTO_INCREMENT    | Khóa chính                     |
| user_id       | INT              | NOT NULL, FK          | Khóa ngoại đến bảng `users`   |
| weight        | DECIMAL(5,2)     | NOT NULL              | Cân nặng                       |
| height        | INT              | NOT NULL              | Chiều cao                      |
| systolic_bp   | INT              | NULL                  | Huyết áp tâm thu               |
| diastolic_bp  | INT              | NULL                  | Huyết áp tâm trương            |
| heart_rate    | INT              | NULL                  | Nhịp tim                       |
| measure_date  | DATE             | NOT NULL              | Ngày đo                        |
| notes         | TEXT             | NULL                  | Ghi chú                        |
| created_at    | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo             |

## Bảng `nutrition_logs`

| Tên cột     | Kiểu dữ liệu  | Ràng buộc              | Ghi chú                         |
|-------------|----------------|-------------------------|----------------------------------|
| id          | INT            | PK, AUTO_INCREMENT     | Khóa chính                      |
| user_id     | INT            | NOT NULL, FK           | Khóa ngoại đến bảng `users`    |
| meal_type   | ENUM(...)      | NOT NULL               | Loại bữa ăn                     |
| food_name   | VARCHAR(100)   | NOT NULL               | Tên món ăn                      |
| quantity    | INT            | NOT NULL               | Khối lượng món ăn              |
| calories    | INT            | NOT NULL               | Lượng calo                      |
| created_at  | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo              |

## Bảng `workout_logs`

| Tên cột        | Kiểu dữ liệu   | Ràng buộc               | Ghi chú                      |
|----------------|----------------|--------------------------|------------------------------|
| id             | INT            | PK, AUTO_INCREMENT      | Khóa chính                   |
| user_id        | INT            | NOT NULL, FK            | Khóa ngoại đến bảng `users` |
| workout_type   | VARCHAR(50)    | NOT NULL                | Loại bài tập                 |
| duration       | INT            | NOT NULL                | Thời lượng (phút)            |
| calories_burned| INT            | NOT NULL                | Calo tiêu thụ                |
| workout_date   | DATE           | NOT NULL                | Ngày tập                     |
| notes          | TEXT           | NULL                    | Ghi chú                      |
| created_at     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo             |

## Bảng `sleep_logs`

| Tên cột     | Kiểu dữ liệu  | Ràng buộc                 | Ghi chú                         |
|-------------|----------------|----------------------------|----------------------------------|
| id          | INT            | PK, AUTO_INCREMENT        | Khóa chính                      |
| user_id     | INT            | NOT NULL, FK              | Khóa ngoại đến bảng `users`    |
| bedtime     | TIME           | NOT NULL                  | Giờ đi ngủ                      |
| wake_time   | TIME           | NOT NULL                  | Giờ thức dậy                    |
| sleep_date  | DATE           | NOT NULL                  | Ngày ngủ                        |
| quality     | INT            | CHECK (1 <= quality <= 10)| Chất lượng giấc ngủ (1-10)     |
| notes       | TEXT           | NULL                      | Ghi chú                         |
| created_at  | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo                   |

## Bảng `goals`

| Tên cột        | Kiểu dữ liệu    | Ràng buộc                      | Ghi chú                          |
|----------------|------------------|---------------------------------|----------------------------------|
| id             | INT              | PK, AUTO_INCREMENT             | Khóa chính                       |
| user_id        | INT              | NOT NULL, FK                   | Khóa ngoại đến bảng `users`     |
| goal_type      | VARCHAR(50)      | NOT NULL                       | Loại mục tiêu                    |
| target_value   | DECIMAL(10,2)    | NOT NULL                       | Giá trị mục tiêu                 |
| current_value  | DECIMAL(10,2)    | DEFAULT 0                      | Giá trị hiện tại                 |
| unit           | VARCHAR(20)      | NOT NULL                       | Đơn vị đo                        |
| target_date    | DATE             | NULL                           | Hạn đạt mục tiêu                 |
| is_active      | BOOLEAN          | DEFAULT TRUE                   | Trạng thái hoạt động mục tiêu   |
| created_at     | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP      | Thời gian tạo                    |
| updated_at     | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời gian cập nhật |
