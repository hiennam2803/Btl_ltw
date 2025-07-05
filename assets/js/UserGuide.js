// Gym equipment data
const gymEquipment = [
    {
        id: 'treadmill',
        name: 'Máy chạy bộ (Treadmill)',
        category: 'cardio',
        description: 'Thiết bị cardio phổ biến nhất, giúp cải thiện sức khỏe tim mạch và đốt cháy calo hiệu quả.',
        muscles: ['Cơ chân', 'Cơ mông', 'Cơ core'],
        instructions: [
            'Bước lên máy và đứng ở giữa thảm chạy',
            'Bắt đầu với tốc độ chậm (2-3 km/h) để làm nóng',
            'Giữ tay vào tay vịn khi bắt đầu, sau đó thả tay tự nhiên',
            'Tăng dần tốc độ theo khả năng của bạn',
            'Giảm tốc độ từ từ trước khi dừng hoàn toàn',
            'Sử dụng nút dừng khẩn cấp khi cần thiết'
        ],
        safety: [
            'Luôn sử dụng dây an toàn khi chạy',
            'Không nhảy xuống khi máy đang chạy',
            'Mặc giày thể thao có đế chống trượt',
            'Không chạy quá nhanh so với khả năng'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'bench-press',
        name: 'Ghế đẩy ngực (Bench Press)',
        category: 'strength',
        description: 'Bài tập cơ bản và hiệu quả nhất để phát triển cơ ngực, vai và tay sau.',
        muscles: ['Cơ ngực', 'Cơ vai trước', 'Cơ tay sau'],
        instructions: [
            'Nằm ngửa trên ghế, chân đặt chắc chắn xuống sàn',
            'Nắm thanh tạ với khoảng cách rộng hơn vai',
            'Hạ thanh tạ xuống ngực từ từ và kiểm soát',
            'Đẩy thanh tạ lên cao cho đến khi tay duỗi thẳng',
            'Thở ra khi đẩy lên, thở vào khi hạ xuống',
            'Lặp lại động tác với nhịp độ ổn định'
        ],
        safety: [
            'Luôn có người hỗ trợ (spotter) khi nâng tạ nặng',
            'Đảm bảo thanh tạ được cố định an toàn',
            'Không nâng quá sức chịu đựng',
            'Kiểm tra tạ đĩa được khóa chặt'
        ],
        difficulty: 'intermediate'
    },
    {
        id: 'leg-press',
        name: 'Máy đẩy chân (Leg Press)',
        category: 'strength',
        description: 'Máy tập chân an toàn và hiệu quả, phù hợp cho mọi trình độ từ người mới bắt đầu.',
        muscles: ['Cơ đùi trước', 'Cơ đùi sau', 'Cơ mông'],
        instructions: [
            'Ngồi trên ghế máy, lưng áp sát vào tựa lưng',
            'Đặt chân lên bệ đẩy, khoảng cách bằng vai',
            'Hạ bệ đẩy xuống cho đến khi đầu gối gập 90 độ',
            'Đẩy bệ lên cao với lực từ gót chân',
            'Không duỗi thẳng hoàn toàn đầu gối',
            'Kiểm soát tốc độ xuống và lên'
        ],
        safety: [
            'Không khóa hoàn toàn đầu gối khi đẩy lên',
            'Giữ lưng áp sát vào tựa lưng',
            'Không để đầu gối vào trong quá mức',
            'Bắt đầu với trọng lượng nhẹ'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'lat-pulldown',
        name: 'Máy kéo xà cao (Lat Pulldown)',
        category: 'strength',
        description: 'Máy tập lưng hiệu quả, giúp phát triển cơ lưng xô và tạo hình chữ V cho thân hình.',
        muscles: ['Cơ lưng xô', 'Cơ thoi', 'Cơ tay trước'],
        instructions: [
            'Ngồi trên ghế, chân kẹp chặt dưới miếng đệm',
            'Nắm thanh kéo với tay rộng hơn vai',
            'Nghiêng người về phía sau một chút',
            'Kéo thanh xuống về phía ngực trên',
            'Siết chặt cơ lưng khi kéo xuống',
            'Nhả thanh lên từ từ và kiểm soát'
        ],
        safety: [
            'Không sử dụng động lực quá mạnh',
            'Không kéo thanh xuống sau gáy',
            'Giữ ngực thẳng trong suốt bài tập',
            'Chọn trọng lượng phù hợp'
        ],
        difficulty: 'intermediate'
    },
    {
        id: 'rowing-machine',
        name: 'Máy chèo thuyền (Rowing Machine)',
        category: 'cardio',
        description: 'Thiết bị cardio toàn thân, kết hợp rèn luyện sức bền và sức mạnh cho cả thân trên và dưới.',
        muscles: ['Cơ lưng', 'Cơ chân', 'Cơ vai', 'Cơ core'],
        instructions: [
            'Ngồi trên ghế, chân đặt vào bàn đạp',
            'Nắm tay cầm với hai tay, lưng thẳng',
            'Bắt đầu bằng cách đẩy chân ra sau',
            'Khi chân gần duỗi thẳng, kéo tay về phía ngực',
            'Nghiêng lưng ra sau nhẹ khi kéo về',
            'Thực hiện động tác ngược lại để trở về vị trí ban đầu'
        ],
        safety: [
            'Giữ lưng thẳng trong suốt bài tập',
            'Không kéo quá mạnh gây căng cơ',
            'Điều chỉnh trở lực phù hợp',
            'Làm nóng trước khi tập cường độ cao'
        ],
        difficulty: 'intermediate'
    },
    {
        id: 'smith-machine',
        name: 'Máy Smith (Smith Machine)',
        category: 'strength',
        description: 'Máy tập đa năng với thanh tạ cố định, giúp thực hiện các bài tập squat, deadlift an toàn.',
        muscles: ['Toàn thân', 'Cơ chân', 'Cơ lưng', 'Cơ vai'],
        instructions: [
            'Điều chỉnh thanh tạ ở độ cao phù hợp',
            'Đặt vai dưới thanh tạ (với squat)',
            'Mở khóa thanh tạ bằng cách xoay',
            'Thực hiện động tác squat hoặc bài tập khác',
            'Giữ lưng thẳng và core chặt',
            'Khóa thanh tạ vào vị trí an toàn khi kết thúc'
        ],
        safety: [
            'Luôn khóa thanh tạ khi nghỉ',
            'Kiểm tra các chốt an toàn',
            'Không thực hiện động tác quá nhanh',
            'Sử dụng trọng lượng phù hợp'
        ],
        difficulty: 'advanced'
    },
    {
        id: 'elliptical',
        name: 'Máy tập elip (Elliptical)',
        category: 'cardio',
        description: 'Máy cardio ít tác động, phù hợp cho người có vấn đề về khớp nhưng vẫn muốn đốt cháy calo hiệu quả.',
        muscles: ['Cơ chân', 'Cơ mông', 'Cơ tay', 'Cơ core'],
        instructions: [
            'Bước lên máy và đặt chân vào bàn đạp',
            'Nắm tay cầm di động hoặc cố định',
            'Bắt đầu với tốc độ chậm để làm quen',
            'Di chuyển chân theo hình elip tự nhiên',
            'Giữ thân người thẳng, không nghiêng về phía trước',
            'Tăng dần cường độ và thời gian tập'
        ],
        safety: [
            'Không bước xuống khi máy đang chạy',
            'Giữ thăng bằng bằng tay cầm',
            'Mặc giày thể thao chống trượt',
            'Không tập quá sức trong lần đầu'
        ],
        difficulty: 'beginner'
    },
    {
        id: 'cable-machine',
        name: 'Máy cáp kéo (Cable Machine)',
        category: 'strength',
        description: 'Máy đa năng với hệ thống cáp linh hoạt, cho phép thực hiện nhiều bài tập khác nhau.',
        muscles: ['Toàn thân', 'Cơ ngực', 'Cơ lưng', 'Cơ vai', 'Cơ tay'],
        instructions: [
            'Chọn phụ kiện phù hợp (thanh thẳng, dây đơn, v.v.)',
            'Điều chỉnh độ cao của cáp theo bài tập',
            'Đứng ở vị trí ổn định, chân rộng bằng vai',
            'Thực hiện động tác với tốc độ kiểm soát',
            'Giữ core chặt trong suốt bài tập',
            'Trở về vị trí ban đầu một cách từ từ'
        ],
        safety: [
            'Kiểm tra phụ kiện được gắn chắc chắn',
            'Không để cáp bật lại đột ngột',
            'Đứng đúng vị trí tránh cáp quét qua',
            'Chọn trọng lượng phù hợp với khả năng'
        ],
        difficulty: 'intermediate'
    }
];

// DOM elements
const equipmentGrid = document.getElementById('equipmentGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderEquipment(gymEquipment);
    setupFilterButtons();
});

// Render equipment cards
function renderEquipment(equipment) {
    equipmentGrid.innerHTML = '';
    
    equipment.forEach(item => {
        const card = createEquipmentCard(item);
        equipmentGrid.appendChild(card);
    });
}

// Create equipment card HTML
function createEquipmentCard(equipment) {
    const card = document.createElement('div');
    card.className = 'equipment-card';
    card.dataset.category = equipment.category;
    
    const difficultyClass = `difficulty-${equipment.difficulty}`;
    const difficultyText = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    }[equipment.difficulty];
    
    // Get image from HTML data
    const imageUrl = window.equipmentImages[equipment.id] || '';
    
    card.innerHTML = `
        <div class="equipment-image">
            <img src="${imageUrl}" alt="${equipment.name}" loading="lazy">
            <div class="difficulty-badge ${difficultyClass}">
                ${difficultyText}
            </div>
        </div>
        <div class="equipment-content">
            <div class="equipment-header">
                <h3 class="equipment-title">${equipment.name}</h3>
                <span class="category-badge">${equipment.category === 'cardio' ? 'Cardio' : 'Sức mạnh'}</span>
            </div>
            <p class="equipment-description">${equipment.description}</p>
            <div class="muscles-section">
                <h4 class="muscles-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    Cơ được tập:
                </h4>
                <div class="muscles-list">
                    ${equipment.muscles.map(muscle => `<span class="muscle-tag">${muscle}</span>`).join('')}
                </div>
            </div>
            <button class="expand-btn" onclick="toggleDetails('${equipment.id}')">
                <span class="expand-text">Xem hướng dẫn chi tiết</span>
                <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6,9 12,15 18,9"/>
                </svg>
            </button>
            <div class="equipment-details" id="details-${equipment.id}">
                <div class="instructions-section">
                    <h4 class="section-title instructions-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        Hướng dẫn sử dụng:
                    </h4>
                    <ol class="instructions-list">
                        ${equipment.instructions.map((instruction, index) => `
                            <li class="instruction-item">
                                <span class="instruction-number">${index + 1}</span>
                                <span class="instruction-text">${instruction}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
                <div class="safety-section">
                    <h4 class="section-title safety-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                            <path d="M12 9v4"/>
                            <path d="m12 17 .01 0"/>
                        </svg>
                        Lưu ý an toàn:
                    </h4>
                    <ul class="safety-list">
                        ${equipment.safety.map(safety => `
                            <li class="safety-item">
                                <span class="safety-icon">!</span>
                                <span class="safety-text">${safety}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Toggle equipment details
function toggleDetails(equipmentId) {
    const details = document.getElementById(`details-${equipmentId}`);
    const button = details.previousElementSibling;
    const expandText = button.querySelector('.expand-text');
    const expandIcon = button.querySelector('.expand-icon');
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        expandText.textContent = 'Xem hướng dẫn chi tiết';
        expandIcon.style.transform = 'rotate(0deg)';
    } else {
        details.classList.add('expanded');
        expandText.textContent = 'Thu gọn';
        expandIcon.style.transform = 'rotate(180deg)';
    }
}

// Setup filter buttons
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter equipment
            const category = this.dataset.category;
            filterEquipment(category);
        });
    });
}

function filterEquipment(category) {
    const cards = document.querySelectorAll('.equipment-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});