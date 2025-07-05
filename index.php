<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UTH Health & Fitness Tracking</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="assets/css/toast.css">
    <link rel="stylesheet" href="assets/css/all.min.css">


</head>

<body>
    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle" id="mobileMenuToggle">
        <span></span>
        <span></span>
        <span></span>
    </div>

    <div class="app">
        <!-- Sidebar -->
        <nav class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <img src="assets/img/uth-logo.png" alt="UTH Logo" class="logo-img">
                    <div class="logo-text">
                        <h1>Health</h1>
                        <p>Chăm sóc sức khỏe - thể hình</p>
                    </div>
                </div>
                <button class="logout-btn" onclick="logout()">
                    <span>🚪</span> Đăng xuất
                </button>
            </div>

            <ul class="nav-menu">
                <li><a href="#" class="nav-item active" data-section="dashboard">📊 Tổng quan</a></li>
                <li><a href="#" class="nav-item" data-section="health">❤️ Sức khỏe</a></li>
                <li><a href="#" class="nav-item" data-section="nutrition">🍽️ Dinh dưỡng</a></li>
                <li><a href="#" class="nav-item" data-section="workouts">💪 Luyện tập</a></li>
                <li><a href="#" class="nav-item" data-section="sleep">🌙 Giấc ngủ</a></li>
                <li><a href="#" class="nav-item" data-section="alert">⚠️ Cảnh báo</a></li>
                <li><a href="#" class="nav-item" data-section="profile">👤 Hồ sơ</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Dashboard Section -->
            <section id="dashboard" class="content-section active">
                <div class="section-header">
                    <h2>Chào buổi sáng, <span
                            id="userName"><?php echo htmlspecialchars($_SESSION['full_name']); ?></span>! 👋</h2>
                    <p>Hôm nay là một ngày tuyệt vời để chăm sóc sức khỏe</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-info">
                                <p class="stat-label">BMI hiện tại</p>
                                <div class="stat-value">
                                    <span class="value" id="currentBMI">--</span>
                                    <span class="unit">kg/m²</span>
                                </div>
                                <p id="bmiStatus">Đang tải...</p>
                            </div>
                            <div class="stat-icon health">❤️</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-info">
                                <p class="stat-label">Calo hôm nay</p>
                                <div class="stat-value">
                                    <span class="value" id="todayCalories">--</span>
                                    <span class="unit">kcal</span>
                                </div>
                                <p class="stat-change" id="calorieGoal">Mục tiêu: 2000</p>
                            </div>
                            <div class="stat-icon nutrition">🍽️</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-info">
                                <p class="stat-label">Bài tập tuần</p>
                                <div class="stat-value">
                                    <span class="value" id="weeklyWorkouts">--</span>
                                    <span class="unit">buổi</span>
                                </div>
                                <p class="stat-change positive" id="workoutProgress">Đang tải...</p>
                            </div>
                            <div class="stat-icon workout">💪</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-content">
                            <div class="stat-info">
                                <p class="stat-label">Giấc ngủ TB</p>
                                <div class="stat-value">
                                    <span class="value" id="avgSleep">--</span>
                                    <span class="unit">giờ</span>
                                </div>
                                <p class="stat-change positive" id="sleepQuality">Đang tải...</p>
                            </div>
                            <div class="stat-icon sleep">🌙</div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3>Mục tiêu tuần này</h3>
                            <span class="icon">🎯</span>
                        </div>
                        <div class="progress-list" id="weeklyGoals">
                            <!-- Goals will be loaded here -->
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Hoạt động gần đây</h3>
                            <span class="icon">📈</span>
                        </div>
                        <div class="activity-list" id="recentActivities">
                            <!-- Activities will be loaded here -->
                        </div>
                    </div>
                </div>
            </section>

            <!-- Health Section -->
            <section id="health" class="content-section">
                <div class="section-header">
                    <h2>Theo dõi Sức khỏe</h2>
                    <p>Ghi nhận và theo dõi các chỉ số sức khỏe của bạn</p>
                </div>

                <div class="stats-grid" id="healthStats">
                    <!-- Health stats will be loaded here -->
                </div>

                <div class="dashboard-grid">
                    <div class="form-card">
                        <div class="card-header">
                            <h3>Thêm chỉ số mới</h3>
                            <span class="icon">➕</span>
                        </div>
                        <form class="health-form" id="healthForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Cân nặng (kg)</label>
                                    <input type="number" step="0.1" placeholder="70" id="weight" required>
                                </div>
                                <div class="form-group">
                                    <label>Chiều cao (cm)</label>
                                    <input type="number" placeholder="175" id="height" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Huyết áp tâm thu (mmHg)</label>
                                    <input type="number" placeholder="120" id="systolic">
                                </div>
                                <div class="form-group">
                                    <label>Huyết áp tâm trương (mmHg)</label>
                                    <input type="number" placeholder="80" id="diastolic">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Nhịp tim (bpm)</label>
                                    <input type="number" placeholder="72" id="heartRate">
                                </div>
                                <div class="form-group">
                                    <label>Ngày đo</label>
                                    <input type="date" id="measureDate" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Ghi chú tình trạng</label>
                                <textarea placeholder="Cảm thấy khỏe mạnh, năng lượng tốt..."
                                    id="healthNotes"></textarea>
                            </div>
                            <button type="submit" class="btn-primary">Lưu chỉ số</button>
                        </form>
                    </div>
                    <!-- Lịch sử chỉ số sức khỏe -->
                    <div class="card">
                        <div class="card-header">
                            <h3>Lịch sử chỉ số sức khỏe</h3>
                            <span class="icon">📅</span>
                        </div>

                        <div class="history-filter" id="healthHistoryFilter"
                            style="display: flex; align-items: center; gap: 8px;">
                            <input type="month" id="filterMonthYear">
                            <div class="filter-btn-group">
                                <button class="filter-btn" id="prevMonthBtn">&#8592;</button>
                                <button class="filter-btn" id="currentMonthBtn"><span>&#128197; HIỆN TẠI</span></button>
                                <button class="filter-btn" id="nextMonthBtn">&#8594;</button>
                            </div>
                        </div>

                        <div class="health-history" id="healthHistory">
                            <!-- Health history will be loaded here -->
                        </div>
                    </div>
                </div>
                <div class="charts-container">
                    <h3>Biểu đồ chỉ số sức khỏe</h3>
                    <canvas id="lineChart"></canvas>

                    <h3>Chiều cao và Cân nặng</h3>
                    <canvas id="barChart"></canvas>
                </div>
            </section>

            <!-- Nutrition Section -->
            <section id="nutrition" class="content-section">
                <div class="section-header">
                    <h2>Theo dõi Dinh dưỡng</h2>
                    <p>Quản lý chế độ ăn uống và calo hàng ngày</p>
                </div>

                <div class="stats-grid" id="nutritionStats">
                    <!-- Nutrition stats will be loaded here -->
                </div>

                <div class="nutrition-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3>Thêm món ăn</h3>
                            <span class="icon">➕</span>
                        </div>
                        <form class="nutrition-form" id="nutritionForm">
                            <div class="meal-selector">
                                <button type="button" class="meal-btn active" data-meal="breakfast">🌅 Bữa sáng</button>
                                <button type="button" class="meal-btn" data-meal="lunch">☀️ Bữa trưa</button>
                                <button type="button" class="meal-btn" data-meal="dinner">🌙 Bữa tối</button>
                                <button type="button" class="meal-btn" data-meal="snack">🍎 Ăn vặt</button>
                            </div>
                            <input type="hidden" id="selectedMeal" value="breakfast">
                            <div class="form-group">
                                <label>Tên món ăn</label>
                                <textarea type="text" placeholder="Ví dụ: 1 chén cơm + 200g gà nướng..." id="foodName"
                                    required></textarea>
                            </div>
                            <!-- <div class="form-row">
                                <div class="form-group">
                                    <label>Khối lượng (g)</label>
                                    <input type="number" placeholder="200" id="foodQuantity" required>
                                </div>
                                <div class="form-group">
                                    <label>Calo (kcal)</label>
                                    <input type="number" placeholder="300" id="foodCalories" required>
                                </div>
                            </div> -->
                            <button type="submit" class="btn-primary">Thêm món ăn</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Bữa ăn hôm nay</h3>
                            <span class="icon">🍽️</span>
                        </div>
                        <div class="meals-list" id="todayMeals">
                            <!-- Today's meals will be loaded here -->
                        </div>
                    </div>

                </div>
                <div class="charts-container">
                    <h3>Biểu đồ chỉ số sức khỏe</h3>
                    <canvas id="macroLineChart"></canvas>
                </div>
            </section>

            <!-- Workouts Section -->
            <section id="workouts" class="content-section">
                <div class="section-header">
                    <h2>Lịch trình Luyện tập</h2>
                    <p>Quản lý và theo dõi các buổi tập luyện</p>
                </div>

                <!-- Stats hiển thị thông tin tổng quan -->
                <div class="stats-grid" id="workoutStats">
                    <!-- Workout stats will be loaded here -->
                </div>

                <div class="workouts-grid">
                    <!-- Form thêm buổi tập -->
                    <div class="card">
                        <div class="card-header">
                            <h3>Thêm buổi tập</h3>
                            <span class="icon">➕</span>
                        </div>
                        <form class="workout-form" id="workoutForm">
                            <div class="form-group">
                                <label for="workoutType">Loại bài tập</label>
                                <select id="workoutType" required>
                                    <option value="">-- Chọn loại bài tập --</option>
                                    <option value="cardio">Cardio</option>
                                    <option value="strength">Tập tạ</option>
                                    <option value="yoga">Yoga</option>
                                    <option value="running">Chạy bộ</option>
                                    <option value="swimming">Bơi lội</option>
                                    <option value="cycling">Đạp xe</option>
                                </select>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="workoutDuration">Thời gian (phút)</label>
                                    <input type="number" id="workoutDuration" placeholder="30" min="1" required>
                                </div>

                                <!-- Đã bỏ bắt buộc nhập calo -->
                                <div class="form-group">
                                    <label for="workoutCalories">Calo đốt (tuỳ chọn)</label>
                                    <input type="number" id="workoutCalories" placeholder="Tự động tính">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="workoutDate">Ngày tập</label>
                                <input type="date" id="workoutDate" required>
                            </div>

                            <div class="form-group">
                                <label for="workoutNotes">Ghi chú</label>
                                <textarea id="workoutNotes" placeholder="Cảm giác sau khi tập..."></textarea>
                            </div>

                            <button type="submit" class="btn-primary">Lưu buổi tập</button>
                        </form>
                    </div>

                    <!-- Lịch sử buổi tập -->
                    <div class="card">
                        <div class="card-header">
                            <h3>Lịch sử tập luyện</h3>
                            <span class="icon">📅</span>
                        </div>
                        <div class="workout-history" id="workoutHistory">
                            <!-- Workout history will be loaded here -->
                        </div>
                    </div>
                </div>
            </section>


            <!-- Sleep Section -->
            <section id="sleep" class="content-section">
                <div class="section-header">
                    <h2>Quản lý Giấc ngủ</h2>
                    <p>Theo dõi chất lượng giấc ngủ và sức khỏe tinh thần</p>
                </div>

                <div class="stats-grid" id="sleepStats">
                    <!-- Sleep stats will be loaded here -->
                </div>

                <div class="sleep-grid">
                    <div class="card">
                        <div class="card-header">
                            <h3>Ghi nhận giấc ngủ</h3>
                            <span class="icon">➕</span>
                        </div>
                        <form class="sleep-form" id="sleepForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Giờ đi ngủ</label>
                                    <input type="time" id="bedtime" required>
                                </div>
                                <div class="form-group">
                                    <label>Giờ thức dậy</label>
                                    <input type="time" id="wakeTime" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Ngày ngủ</label>
                                <input type="date" id="sleepDate" required>
                            </div>
                            <div class="form-group">
                                <label>Chất lượng giấc ngủ: <span id="qualityValue">5</span>/10</label>
                                <input type="range" min="1" max="10" value="5" id="sleepQuality" class="slider">
                            </div>
                            <div class="form-group">
                                <label>Ghi chú</label>
                                <textarea placeholder="Cảm giác khi thức dậy, các yếu tố ảnh hưởng..."
                                    id="sleepNotes"></textarea>
                            </div>
                            <button type="submit" class="btn-primary">Lưu dữ liệu giấc ngủ</button>
                        </form>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Lịch sử giấc ngủ</h3>
                            <span class="icon">🌙</span>
                        </div>
                        <div class="sleep-history" id="sleepHistory">
                            <!-- Sleep history will be loaded here -->
                        </div>
                    </div>
                </div>
            </section>

            <!-- Alert Section -->
            <section id="alert" class="content-section alert-section">
                <div class="section-header">
                    <h2>Cảnh báo & Gợi ý</h2>
                    <p>Thông tin tổng hợp từ các chỉ số sức khỏe gần đây</p>
                </div>

                <div class="alert-container">
                    <div class="alert-grid">
                        <div class="alert-card" id="healthAlert">
                            <h4>🩺 Sức khỏe tổng thể</h4>
                            <p>⚠️ Bạn đang thiếu ngủ và nạp quá ít năng lượng so với nhu cầu.</p>
                        </div>

                        <div class="alert-card" id="dietAlert">
                            <h4>🍽️ Ăn uống</h4>
                            <p>📉 Lượng calo hôm nay thấp hơn nhu cầu tối thiểu 500 kcal.</p>
                        </div>

                        <div class="alert-card" id="exerciseAlert">
                            <h4>💪 Luyện tập</h4>
                            <p>🏃‍♂️ Bạn chưa ghi nhận bất kỳ hoạt động thể chất nào trong 3 ngày qua.</p>
                        </div>

                        <div class="alert-card" id="sleepAlert">
                            <h4>🌙 Giấc ngủ</h4>
                            <p>😴 Chất lượng giấc ngủ gần đây dưới 6/10 — nên điều chỉnh giờ đi ngủ và hạn chế dùng
                                thiết bị điện tử.</p>
                        </div>
                    </div>
                </div>
            </section>


            <!-- Profile Section -->
            <section id="profile" class="content-section">
                <div class="section-header">
                    <h2>Hồ sơ cá nhân</h2>
                    <p>Quản lý thông tin và mục tiêu của bạn</p>
                </div>

                <div class="profile-grid">
                    <div class="card profile-card">
                        <div class="profile-avatar">
                            <div class="avatar">👤</div>
                            <h3 id="profileName"><?php echo htmlspecialchars($_SESSION['full_name']); ?></h3>
                            <p>Sinh viên UTH</p>
                        </div>
                        <div class="profile-info" id="profileInfo">
                            <!-- Profile info will be loaded here -->
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Cập nhật thông tin</h3>
                            <span class="icon">✏️</span>
                        </div>
                        <form class="profile-form" id="profileForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Họ và tên</label>
                                    <input type="text" id="fullName"
                                        value="<?php echo htmlspecialchars($_SESSION['full_name']); ?>" required>
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" id="email"
                                        value="<?php echo htmlspecialchars($_SESSION['email']); ?>" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Tuổi</label>
                                    <input type="number" id="age" placeholder="22">
                                </div>
                                <div class="form-group">
                                    <label>Giới tính</label>
                                    <select id="gender">
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn-primary">Cập nhật thông tin</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner"></div>
    </div>

    <script src="assets/js/script.js"></script>
</body>

</html>