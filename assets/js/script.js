// Global variables
let currentUser = null;
let healthHistoryRaw = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
});

function initializeApp() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });

    // Initialize sleep quality slider
    const sleepQualitySlider = document.getElementById('sleepQuality');
    const qualityValue = document.getElementById('qualityValue');
    if (sleepQualitySlider && qualityValue) {
        sleepQualitySlider.addEventListener('input', function() {
            qualityValue.textContent = this.value;
        });
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('show');
        });
    }

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            if (sidebar) {
                sidebar.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Meal selector buttons
    const mealBtns = document.querySelectorAll('.meal-btn');
    const selectedMealInput = document.getElementById('selectedMeal');
    
    mealBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            mealBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (selectedMealInput) {
                selectedMealInput.value = this.dataset.meal;
            }
        });
    });

    // Form submissions
    setupFormHandlers();
}

function setupFormHandlers() {
    // Health form
    const healthForm = document.getElementById('healthForm');
    if (healthForm) {
        healthForm.addEventListener('submit', handleHealthSubmit);
    }

    // Nutrition form
    const nutritionForm = document.getElementById('nutritionForm');
    if (nutritionForm) {
        nutritionForm.addEventListener('submit', handleNutritionSubmit);
    }

    // Workout form
    const workoutForm = document.getElementById('workoutForm');
    if (workoutForm) {
        workoutForm.addEventListener('submit', handleWorkoutSubmit);
    }

    // Sleep form
    const sleepForm = document.getElementById('sleepForm');
    if (sleepForm) {
        sleepForm.addEventListener('submit', handleSleepSubmit);
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionId) {
            case 'health':
                loadHealthData();
                break;
            case 'nutrition':
                loadNutritionData();
                break;
            case 'workouts':
                loadWorkoutData();
                break;
            case 'sleep':
                loadSleepData();
                break;
            case 'profile':
                loadProfileData();
                break;
        }
    }
}

// API Functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    showLoading();
    
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`api/${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showToast('Có lỗi xảy ra: ' + error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const [stats, goals, activities] = await Promise.all([
            apiRequest('dashboard/stats.php'),
            apiRequest('dashboard/goals.php'),
            apiRequest('dashboard/activities.php')
        ]);
        
        updateDashboardStats(stats);
        updateWeeklyGoals(goals);
        updateRecentActivities(activities);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateDashboardStats(stats) {
    if (stats.bmi) {
        const bmiValue = stats.bmi.value || '--';
        const bmiStatus = stats.bmi.status || 'Đang tải...';

        const bmiStatusElement = document.getElementById('bmiStatus');
        const currentBMIElement = document.getElementById('currentBMI');

        if (bmiStatusElement && currentBMIElement) {
            currentBMIElement.textContent = bmiValue;
            bmiStatusElement.textContent = bmiStatus;

            // Gán màu trực tiếp bằng style
            switch (bmiStatus) {
                case 'Thiếu cân':
                    bmiStatusElement.style.color = '#ffc107'; // Vàng
                    break;
                case 'Bình thường':
                    bmiStatusElement.style.color = '#28a745'; // Xanh
                    break;
                case 'Thừa cân':
                    bmiStatusElement.style.color = '#fd7e14'; // Cam
                    break;
                case 'Béo phì':
                    bmiStatusElement.style.color = '#dc3545'; // Đỏ
                    break;
                default:
                    bmiStatusElement.style.color = '#1f2937'; // Mặc định
            }
        }
    }
    
    if (stats.calories) {
        document.getElementById('todayCalories').textContent = stats.calories.today || '--';
        document.getElementById('calorieGoal').textContent = `Mục tiêu: ${stats.calories.goal || 2000}`;
    }
    
    if (stats.workouts) {
        document.getElementById('weeklyWorkouts').textContent = stats.workouts.count || '--';
        document.getElementById('workoutProgress').textContent = stats.workouts.progress || 'Đang tải...';
    }
    
    if (stats.sleep) {
        document.getElementById('avgSleep').textContent = stats.sleep.average || '--';
        document.getElementById('sleepQuality').textContent = stats.sleep.quality || 'Đang tải...';
    }
}

function updateWeeklyGoals(goals) {
    const container = document.getElementById('weeklyGoals');
    if (!container || !goals.length) return;
    
    container.innerHTML = goals.map(goal => `
        <div class="progress-item">
            <div class="progress-info">
                <span>${goal.name}</span>
                <span>${goal.current} ${goal.unit}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${goal.percentage}%"></div>
            </div>
        </div>
    `).join('');
}

function updateRecentActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!container || !activities.length) {
        container.innerHTML = '<div class="empty-state"><div class="icon">📝</div><h3>Chưa có hoạt động</h3><p>Bắt đầu ghi nhận hoạt động của bạn</p></div>';
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-dot"></div>
            <div class="activity-info">
                <p>${activity.name}</p>
                <span>${activity.time}</span>
            </div>
            <span class="activity-calories">${activity.calories} kcal</span>
        </div>
    `).join('');
}

// Health Functions
async function loadHealthData() {
    try {
        const healthData = await apiRequest('health/stats.php');
        updateHealthHistory(healthData.history);

        // Filter tháng/năm
        const monthInput = document.getElementById('filterMonthYear');
        const prevBtn = document.getElementById('prevMonthBtn');
        const nextBtn = document.getElementById('nextMonthBtn');
        const nowBtn = document.getElementById('currentMonthBtn');

        // Set mặc định là tháng hiện tại
        const now = new Date();
        const pad = n => n < 10 ? '0' + n : n;
        monthInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;

        function updateFilter() {
            updateHealthHistory(healthHistoryRaw, monthInput.value);
        }

        monthInput.onchange = updateFilter;

        prevBtn.onclick = function() {
            let [y, m] = monthInput.value.split('-').map(Number);
            m--;
            if (m < 1) { m = 12; y--; }
            monthInput.value = `${y}-${pad(m)}`;
            updateFilter();
        };
        nextBtn.onclick = function() {
            let [y, m] = monthInput.value.split('-').map(Number);
            m++;
            if (m > 12) { m = 1; y++; }
            monthInput.value = `${y}-${pad(m)}`;
            updateFilter();
        };
        nowBtn.onclick = function() {
            monthInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
            updateFilter();
        };

        // Lọc ngay khi load
        updateFilter();

        updateHealthStats(healthData);
        renderHealthCharts(healthData.history);
    } catch (error) {
        console.error('Failed to load health data:', error);
    }
}

function updateHealthStats(data) {
    const container = document.getElementById('healthStats');
    if (!container) return;
    
    const stats = [
        { label: 'Cân nặng', value: data.weight?.current || '--', unit: 'kg', change: data.weight?.change || '', icon: '⚖️' },
        { label: 'BMI', value: data.bmi?.value || '--', unit: 'kg/m²', change: data.bmi?.status || '', icon: '📏' },
        { label: 'Huyết áp', value: data.bloodPressure?.value || '--', unit: 'mmHg', change: data.bloodPressure?.status || '', icon: '❤️' },
        { label: 'Nhịp tim', value: data.heartRate?.value || '--', unit: 'bpm', change: data.heartRate?.status || '', icon: '💓' }
    ];
    
    container.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-info">
                    <p class="stat-label">${stat.label}</p>
                    <div class="stat-value">
                        <span class="value">${stat.value}</span>
                        <span class="unit">${stat.unit}</span>
                    </div>
                    <p class="stat-change ${stat.change.includes('Tốt') || stat.change.includes('Bình thường') ? 'positive' : ''}">${stat.change}</p>
                </div>
                <div class="stat-icon">${stat.icon}</div>
            </div>
        </div>
    `).join('');
}

function updateHealthHistory(history, filterMonthYear = '') {
    const container = document.getElementById('healthHistory');
    if (!container) return;
    healthHistoryRaw = history;

    let filtered = history || [];
    if (filterMonthYear) {
        const [year, month] = filterMonthYear.split('-');
        filtered = filtered.filter(item => {
            const d = new Date(item.measure_date);
            return d.getFullYear() == year && (d.getMonth() + 1) == Number(month);
        });
    }

    filtered.sort((a, b) => new Date(b.measure_date) - new Date(a.measure_date));

    if (!filtered.length) {
        container.innerHTML = '<div class="empty-state"><div class="icon">❤️</div><h3>Chưa có dữ liệu</h3><p>Hãy thêm chỉ số sức khỏe đầu tiên của bạn</p></div>';
        return;
    }

    container.innerHTML = filtered.map(item => `
        <div class="history-item">
            <div class="history-info">
                <h4>${formatDate(item.measure_date)}</h4>
                <p>
                    Cân nặng: <b>${item.weight} kg</b>,
                    Cao: <b>${item.height} cm</b>,
                    Huyết áp: <b>${item.systolic}/${item.diastolic} mmHg</b>,
                    Nhịp tim: <b>${item.heart_rate} bpm</b>
                </p>
                ${item.notes ? `<p>Ghi chú: ${item.notes}</p>` : ''}
            </div>
        </div>
    `).join('');
}

async function handleHealthSubmit(e) {
    e.preventDefault();
    
    const formData = {
        weight: parseFloat(document.getElementById('weight').value),
        height: parseInt(document.getElementById('height').value),
        systolic: parseInt(document.getElementById('systolic').value),
        diastolic: parseInt(document.getElementById('diastolic').value),
        heartRate: parseInt(document.getElementById('heartRate').value),
        measureDate: document.getElementById('measureDate').value,
        notes: document.getElementById('healthNotes').value
    };
    
    try {
        await apiRequest('health/add.php', 'POST', formData);
        showToast('Đã lưu thông tin sức khỏe thành công!', 'success');
        document.getElementById('healthForm').reset();
        loadHealthData();
        loadDashboardData();
    } catch (error) {
        showToast('Không thể lưu thông tin sức khỏe', 'error');
    }
}

// Nutrition Functions
async function loadNutritionData() {
    try {
        const [stats, meals, history] = await Promise.all([
            apiRequest('nutrition/stats.php'),
            apiRequest('nutrition/today.php'),
            apiRequest('nutrition/history.php') // <- thêm dòng này
        ]);
        
        updateNutritionStats(stats);
        updateTodayMeals(meals);
        renderMacroLineChart(history); // <- vẽ biểu đồ từ dữ liệu lịch sử
    } catch (error) {
        console.error('Failed to load nutrition data:', error);
    }
}


function updateNutritionStats(data) {
    const container = document.getElementById('nutritionStats');
    if (!container) return;
    
    const stats = [
        { label: 'Tổng Calo', value: data.calories?.total || '--', unit: 'kcal', change: `Mục tiêu: ${data.calories?.goal || 2000} kcal`, icon: '⚡' },
        { label: 'Carbs', value: data.macros?.carbs || '--', unit: 'g', change: `${data.macros?.carbsPercent || 0}% tổng calo`, icon: '🌾' },
        { label: 'Protein', value: data.macros?.protein || '--', unit: 'g', change: `${data.macros?.proteinPercent || 0}% tổng calo`, icon: '🥩' },
        { label: 'Fat', value: data.macros?.fat || '--', unit: 'g', change: `${data.macros?.fatPercent || 0}% tổng calo`, icon: '🥑' }
    ];
    
    container.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-info">
                    <p class="stat-label">${stat.label}</p>
                    <div class="stat-value">
                        <span class="value">${stat.value}</span>
                        <span class="unit">${stat.unit}</span>
                    </div>
                    <p class="stat-change positive">${stat.change}</p>
                </div>
                <div class="stat-icon">${stat.icon}</div>
            </div>
        </div>
    `).join('');
}

function updateTodayMeals(meals) {
    const container = document.getElementById('todayMeals');
    if (!container) return;
    
    if (!meals.length) {
        container.innerHTML = '<div class="empty-state"><div class="icon">🍽️</div><h3>Chưa có bữa ăn</h3><p>Thêm món ăn đầu tiên của bạn</p></div>';
        return;
    }
    
    const mealTypes = {
        breakfast: { name: '🌅 Bữa sáng', items: [] },
        lunch: { name: '☀️ Bữa trưa', items: [] },
        dinner: { name: '🌙 Bữa tối', items: [] },
        snack: { name: '🍎 Ăn vặt', items: [] }
    };
    
    meals.forEach(meal => {
        if (mealTypes[meal.meal_type]) {
            mealTypes[meal.meal_type].items.push(meal);
        }
    });
    
    container.innerHTML = Object.entries(mealTypes)
        .filter(([type, data]) => data.items.length > 0)
        .map(([type, data]) => {
            const totalCalories = data.items.reduce((sum, item) => sum + parseInt(item.calories), 0);
            return `
                <div class="meal-section">
                    <h4>${data.name} <span class="meal-calories">${totalCalories} kcal</span></h4>
                    ${data.items.map(item => `
                        <div class="food-item">
                            <span>${item.food_name} (${item.quantity}g)</span>
                            <span>${item.calories} kcal</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('');
}

async function handleNutritionSubmit(e) {
    e.preventDefault();

    const formData = {
        mealType: document.getElementById('selectedMeal').value,
        foodName: document.getElementById('foodName').value
    };

    try {
        const res = await apiRequest('nutrition/add.php', 'POST', formData);
        showToast(res.message || 'Đã thêm món ăn thành công!', 'success');
        document.getElementById('nutritionForm').reset();
        loadNutritionData();
        loadDashboardData();
    } catch (error) {
        showToast('Không thể thêm món ăn', 'error');
    }
}

// Tải dữ liệu workout
async function loadWorkoutData() {
    try {
        const [stats, history] = await Promise.all([
            apiRequest('workouts/stats.php'),
            apiRequest('workouts/history.php')
        ]);
        renderWorkoutStats(stats);
        renderWorkoutHistory(history);
    } catch (error) {
        console.error('❌ Lỗi tải dữ liệu workout:', error);
        showToast('Không thể tải dữ liệu workout', 'error');
    }
}

// Hiển thị thống kê workout
function renderWorkoutStats(data) {
    const container = document.getElementById('workoutStats');
    if (!container) return;

    const stats = [
        {
            label: 'Tuần này',
            value: `${data.thisWeek?.count ?? 0}/5`,
            unit: 'buổi',
            change: `${data.thisWeek?.percentage ?? 0}% hoàn thành`,
            icon: '💪'
        },
        {
            label: 'Calo đốt',
            value: data.thisWeek?.calories ?? '--',
            unit: 'kcal',
            change: 'Tuần này',
            icon: '🔥'
        },
        {
            label: 'Thời gian tập',
            value: data.thisWeek?.duration ?? '--',
            unit: 'giờ',
            change: 'Tuần này',
            icon: '⏱️'
        },
        {
            label: 'Chuỗi ngày',
            value: data.streak ?? '--',
            unit: 'ngày',
            change: 'Streak hiện tại',
            icon: '✅'
        }
    ];

    container.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-info">
                    <p class="stat-label">${stat.label}</p>
                    <div class="stat-value">
                        <span class="value">${stat.value}</span>
                        <span class="unit">${stat.unit}</span>
                    </div>
                    <p class="stat-change positive">${stat.change}</p>
                </div>
                <div class="stat-icon">${stat.icon}</div>
            </div>
        </div>
    `).join('');
}

// Hiển thị lịch sử workout
function renderWorkoutHistory(history) {
    const container = document.getElementById('workoutHistory');
    if (!container) return;

    if (!history.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">💪</div>
                <h3>Chưa có buổi tập</h3>
                <p>Thêm buổi tập đầu tiên của bạn</p>
            </div>`;
        return;
    }

    container.innerHTML = history.map(workout => `
        <div class="history-item">
            <div class="history-info">
                <h4>${getWorkoutTypeName(workout.workout_type)}</h4>
                <p>${workout.duration} phút • ${workout.calories_burned} kcal</p>
            </div>
            <div class="history-meta">
                <div>${formatDate(workout.workout_date)}</div>
                <button class="btn-delete" onclick="deleteWorkout(${workout.id})">Xóa</button>
            </div>
        </div>
    `).join('');
}

// Map loại bài tập sang tiếng Việt
function getWorkoutTypeName(type) {
    const types = {
        cardio: 'Cardio',
        strength: 'Tập tạ',
        yoga: 'Yoga',
        running: 'Chạy bộ',
        swimming: 'Bơi lội',
        cycling: 'Đạp xe'
    };
    return types[type] || type;
}

// Gửi dữ liệu buổi tập mới
async function handleWorkoutSubmit(e) {
    e.preventDefault();

    const formData = {
        workoutType: document.getElementById('workoutType').value,
        duration: parseInt(document.getElementById('workoutDuration').value),
        caloriesBurned: parseInt(document.getElementById('workoutCalories').value) || 0,
        workoutDate: document.getElementById('workoutDate').value,
        notes: document.getElementById('workoutNotes').value.trim()
    };

    try {
        const res = await apiRequest('workouts/add.php', 'POST', formData);
        showToast(res.message || 'Đã lưu buổi tập thành công!', 'success');
        document.getElementById('workoutForm').reset();
        loadWorkoutData();
        loadDashboardData?.(); // Optional chaining nếu không có dashboard
    } catch (error) {
        console.error(error);
        showToast('Không thể lưu buổi tập', 'error');
    }
}

// Xóa buổi tập
async function deleteWorkout(id) {
    if (!confirm('Bạn có chắc muốn xóa buổi tập này?')) return;

    try {
        await apiRequest('workouts/delete.php', 'POST', { id });
        showToast('Đã xóa buổi tập thành công!', 'success');
        loadWorkoutData();
        loadDashboardData?.();
    } catch (error) {
        console.error(error);
        showToast('Không thể xóa buổi tập', 'error');
    }
}


// Sleep Functions
async function loadSleepData() {
    try {
        const [stats, history] = await Promise.all([
            apiRequest('sleep/stats.php'),
            apiRequest('sleep/history.php')
        ]);
        
        updateSleepStats(stats);
        updateSleepHistory(history);
    } catch (error) {
        console.error('Failed to load sleep data:', error);
    }
}

function updateSleepStats(data) {
    const container = document.getElementById('sleepStats');
    if (!container) return;
    
    const stats = [
        { label: 'Trung bình/đêm', value: data.average?.duration || '--', unit: 'giờ', change: '7 ngày qua', icon: '🌙' },
        { label: 'Chất lượng', value: data.average?.quality || '--', unit: '/10', change: data.average?.qualityText || 'Đang tải...', icon: '📈' },
        { label: 'Giờ đi ngủ TB', value: data.average?.bedtime || '--', unit: '', change: data.bedtimeAdvice || '', icon: '🕐' },
        { label: 'Giờ thức dậy TB', value: data.average?.wakeTime || '--', unit: '', change: data.wakeAdvice || '', icon: '☀️' }
    ];
    
    container.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-info">
                    <p class="stat-label">${stat.label}</p>
                    <div class="stat-value">
                        <span class="value">${stat.value}</span>
                        <span class="unit">${stat.unit}</span>
                    </div>
                    <p class="stat-change ${stat.change.includes('Tốt') || stat.change.includes('Ổn định') ? 'positive' : ''}">${stat.change}</p>
                </div>
                <div class="stat-icon">${stat.icon}</div>
            </div>
        </div>
    `).join('');
}

function updateSleepHistory(history) {
    const container = document.getElementById('sleepHistory');
    if (!container) return;
    
    if (!history.length) {
        container.innerHTML = '<div class="empty-state"><div class="icon">🌙</div><h3>Chưa có dữ liệu giấc ngủ</h3><p>Thêm dữ liệu giấc ngủ đầu tiên</p></div>';
        return;
    }
    
    container.innerHTML = history.map(sleep => `
        <div class="history-item">
            <div class="history-info">
                <h4>${sleep.duration} giờ ngủ</h4>
                <p>Chất lượng: ${sleep.quality}/10 • ${sleep.bedtime} - ${sleep.wake_time}</p>
            </div>
            <div class="history-meta">
                <div>${formatDate(sleep.sleep_date)}</div>
                <button class="btn-delete" onclick="deleteSleep(${sleep.id})">Xóa</button>
            </div>
        </div>
    `).join('');
}

async function handleSleepSubmit(e) {
    e.preventDefault();
    
    const formData = {
        bedtime: document.getElementById('bedtime').value,
        wakeTime: document.getElementById('wakeTime').value,
        sleepDate: document.getElementById('sleepDate').value,
        quality: parseInt(document.getElementById('sleepQuality').value),
        notes: document.getElementById('sleepNotes').value
    };
    
    try {
        await apiRequest('sleep/add.php', 'POST', formData);
        showToast('Đã lưu dữ liệu giấc ngủ thành công!', 'success');
        document.getElementById('sleepForm').reset();
        loadSleepData();
        loadDashboardData();
    } catch (error) {
        showToast('Không thể lưu dữ liệu giấc ngủ', 'error');
    }
}

async function deleteSleep(id) {
    if (!confirm('Bạn có chắc muốn xóa dữ liệu giấc ngủ này?')) return;
    
    try {
        await apiRequest('sleep/delete.php', 'POST', { id });
        showToast('Đã xóa dữ liệu giấc ngủ thành công!', 'success');
        loadSleepData();
        loadDashboardData();
    } catch (error) {
        showToast('Không thể xóa dữ liệu giấc ngủ', 'error');
    }
}

// Profile Functions
async function loadProfileData() {
    try {
        const profileData = await apiRequest('profile/get.php');
        updateProfileInfo(profileData);
        populateProfileForm(profileData);
    } catch (error) {
        console.error('Failed to load profile data:', error);
    }
}

function updateProfileInfo(data) {
    const container = document.getElementById('profileInfo');
    if (!container) return;
    
    const info = [
        { label: 'Tuổi', value: data.age ? `${data.age} tuổi` : 'Chưa cập nhật' },
        { label: 'Giới tính', value: getGenderText(data.gender) },
        { label: 'Chiều cao', value: data.height ? `${data.height} cm` : 'Chưa cập nhật' },
        { label: 'Cân nặng', value: data.current_weight ? `${data.current_weight} kg` : 'Chưa cập nhật' },
        { label: 'BMI', value: data.bmi ? data.bmi : 'Chưa tính được' }
    ];
    
    container.innerHTML = info.map(item => `
        <div class="info-item">
            <span>${item.label}:</span>
            <span class="${item.label === 'BMI' && item.value !== 'Chưa tính được' ? 'positive' : ''}">${item.value}</span>
        </div>
    `).join('');
}

function populateProfileForm(data) {
    if (data.age) document.getElementById('age').value = data.age;
    if (data.gender) document.getElementById('gender').value = data.gender;
}

function getGenderText(gender) {
    const genders = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác'
    };
    return genders[gender] || 'Chưa cập nhật';
}

async function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value) || null,
        gender: document.getElementById('gender').value
    };
    
    try {
        await apiRequest('profile/update.php', 'POST', formData);
        showToast('Đã cập nhật thông tin thành công!', 'success');
        loadProfileData();
    } catch (error) {
        showToast('Không thể cập nhật thông tin', 'error');
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function showAlert(message, type = 'info') {
    // Create alert if it doesn't exist
    let alertModal = document.getElementById('alertModal');
    if (!alertModal) {
        alertModal = document.createElement('div');
        alertModal.id = 'alertModal';
        alertModal.className = 'alert-modal';
        alertModal.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon" id="alertIcon">ℹ️</div>
                <div class="alert-message" id="alertMessage"></div>
                <button class="alert-close" onclick="closeAlert()">OK</button>
            </div>
        `;
        document.body.appendChild(alertModal);
    }
    
    const icon = document.getElementById('alertIcon');
    const messageEl = document.getElementById('alertMessage');
    
    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    icon.textContent = icons[type] || icons.info;
    messageEl.textContent = message;
    alertModal.classList.add('show');
}

function closeAlert() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        alertModal.classList.remove('show');
    }
}

async function logout() {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
    
    try {
        await apiRequest('auth/logout.php', 'POST');
        window.location.href = 'login.html';
    } catch (error) {
        showToast('Không thể đăng xuất', 'error');
    }
}

function renderHealthCharts(data) {
    if (!data || !data.length) return;
    

    const labels = data.map(item => formatDate(item.measure_date));
    const bmi = data.map(item => item.bmi);
    const systolic = data.map(item => item.systolic);
    const diastolic = data.map(item => item.diastolic);
    const heartRate = data.map(item => item.heart_rate);
    const weights = data.map(item => item.weight);
    const heights = data.map(item => item.height);
    

    const defaultFont = {
        family: 'Arial, "Segoe UI", Roboto, sans-serif',
        size: 14,
        weight: 'normal'
    };

    // Biểu đồ đường – Chỉ số sức khỏe
    new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'BMI',
                    data: bmi,
                    borderColor: 'blue',
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'Huyết áp Tâm thu',
                    data: systolic,
                    borderColor: 'red',
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'Huyết áp Tâm trương',
                    data: diastolic,
                    borderColor: 'orange',
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'Nhịp tim',
                    data: heartRate,
                    borderColor: 'green',
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Chỉ số sức khỏe theo thời gian',
                    font: {
                        ...defaultFont,
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333'
                },
                legend: {
                    position: 'top',
                    labels: {
                        font: defaultFont,
                        color: '#333'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: defaultFont
                    }
                },
                y: {
                    ticks: {
                        font: defaultFont
                    }
                }
            }
        }
    });

    // Biểu đồ cột – Chiều cao và Cân nặng
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Cân nặng (kg)',
                    data: weights,
                    backgroundColor: 'purple'
                },
                {
                    label: 'Chiều cao (cm)',
                    data: heights,
                    backgroundColor: 'gray'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Chiều cao và Cân nặng',
                    font: {
                        ...defaultFont,
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333'
                },
                legend: {
                    position: 'top',
                    labels: {
                        font: defaultFont,
                        color: '#333'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: defaultFont
                    }
                },
                y: {
                    ticks: {
                        font: defaultFont
                    }
                }
            }
        }
    });
}

function showToast(message, type = 'success') {
    // Xóa toast cũ nếu có
    let oldToast = document.getElementById('toastNotification');
    if (oldToast) oldToast.remove();

    // Tạo toast mới
    const toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <span class="message">${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">×</button>
        <div class="progress-bar"></div>
    `;
    document.body.appendChild(toast);

    // Hiện toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Tự động ẩn sau 5s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}


// Vẽ biểu đồ dinh dưỡng đường theo ngày
function renderMacroLineChart(data) {
    const ctx = document.getElementById('macroLineChart').getContext('2d');
    if (window.macroChart) window.macroChart.destroy();

    const labels = data.map(d => d.date);
    const carbsData = data.map(d => d.carbs);
    const proteinData = data.map(d => d.protein);
    const fatData = data.map(d => d.fat);

    window.macroChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Carbs (g)',
                    data: carbsData,
                    borderColor: '#f4c542',
                    backgroundColor: '#f4c54222',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Protein (g)',
                    data: proteinData,
                    borderColor: '#ff6f61',
                    backgroundColor: '#ff6f6122',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Fat (g)',
                    data: fatData,
                    borderColor: '#6bd098',
                    backgroundColor: '#6bd09822',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Lượng Carbs, Protein, Fat theo ngày'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Gram (g)'
                    },
                    beginAtZero: true
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ngày'
                    }
                }
            }
        }
    });
}

// Gọi khi load trang
async function loadNutritionHistoryChart() {
    try {
        const history = await apiRequest('nutrition/history.php');
        renderMacroLineChart(history);
    } catch (error) {
        console.error('Không thể tải dữ liệu lịch sử dinh dưỡng:', error);
    }
}

// Gọi khi trang tải hoặc sau khi thêm món ăn
loadNutritionHistoryChart();
