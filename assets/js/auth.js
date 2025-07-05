// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
});

function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        remember: document.getElementById('remember').checked
    };
    
    // Basic validation
    if (!formData.email || !formData.password) {
        showAlert('Vui lòng điền đầy đủ thông tin', 'warning');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch('api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('Đăng nhập thành công!', 'success');
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 1500);
        } else {
            showAlert(result.message || 'Đăng nhập thất bại', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Có lỗi xảy ra khi đăng nhập', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        showAlert('Vui lòng điền đầy đủ thông tin', 'warning');
        return;
    }
    
    if (formData.password.length < 6) {
        showAlert('Mật khẩu phải có ít nhất 6 ký tự', 'warning');
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp', 'warning');
        return;
    }
    
    if (!document.getElementById('terms').checked) {
        showAlert('Vui lòng đồng ý với điều khoản sử dụng', 'warning');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch('api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(result.message || 'Đăng ký thất bại', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAlert('Có lỗi xảy ra khi đăng ký', 'error');
    } finally {
        hideLoading();
    }
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
    const alertModal = document.getElementById('alertModal');
    const alertIcon = document.getElementById('alertIcon');
    const alertMessage = document.getElementById('alertMessage');
    
    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    alertIcon.textContent = icons[type] || icons.info;
    alertMessage.textContent = message;
    alertModal.classList.add('show');
}

function closeAlert() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        alertModal.classList.remove('show');
    }
}