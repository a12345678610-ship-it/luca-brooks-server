// 警务调度系统 - 主脚本文件

// 模拟数据
const casesData = [
    {
        id: "CASE-2024-001",
        type: "emergency",
        title: "银行抢劫报警",
        location: "市中心银行大厦",
        time: "10:30",
        status: "pending",
        priority: "high"
    },
    {
        id: "CASE-2024-002",
        type: "traffic",
        title: "重大交通事故",
        location: "环城高速入口",
        time: "09:15",
        status: "in-progress",
        priority: "high"
    },
    {
        id: "CASE-2024-003",
        type: "normal",
        title: "邻里纠纷调解",
        location: "幸福小区3栋",
        time: "08:45",
        status: "pending",
        priority: "medium"
    },
    {
        id: "CASE-2024-004",
        type: "emergency",
        title: "商场盗窃案",
        location: "万达广场",
        time: "14:20",
        status: "in-progress",
        priority: "high"
    },
    {
        id: "CASE-2024-005",
        type: "traffic",
        title: "交通拥堵疏导",
        location: "中山路与解放路交叉口",
        time: "17:30",
        status: "pending",
        priority: "medium"
    }
];

const officersData = [
    {
        id: "OFF-001",
        name: "张明",
        badge: "11001",
        department: "刑侦大队",
        status: "available",
        location: "市中心",
        vehicle: "警A-001",
        phone: "13800138001"
    },
    {
        id: "OFF-002",
        name: "李华",
        badge: "11002",
        department: "交警大队",
        status: "busy",
        location: "环城高速",
        vehicle: "警A-002",
        phone: "13800138002"
    },
    {
        id: "OFF-003",
        name: "王强",
        badge: "11003",
        department: "巡逻大队",
        status: "available",
        location: "东城区",
        vehicle: "警A-003",
        phone: "13800138003"
    },
    {
        id: "OFF-004",
        name: "赵敏",
        badge: "11004",
        department: "特警大队",
        status: "available",
        location: "训练基地",
        vehicle: "特警-001",
        phone: "13800138004"
    },
    {
        id: "OFF-005",
        name: "刘伟",
        badge: "11005",
        department: "派出所",
        status: "busy",
        location: "幸福小区",
        vehicle: "警A-005",
        phone: "13800138005"
    },
    {
        id: "OFF-006",
        name: "陈静",
        badge: "11006",
        department: "交警大队",
        status: "available",
        location: "中山路",
        vehicle: "警A-006",
        phone: "13800138006"
    }
];

const tasksData = [
    {
        id: "TASK-001",
        type: "巡逻任务",
        officer: "张明",
        status: "in-progress",
        startTime: "08:00",
        endTime: "12:00"
    },
    {
        id: "TASK-002",
        type: "交通疏导",
        officer: "李华",
        status: "completed",
        startTime: "07:30",
        endTime: "09:30"
    },
    {
        id: "TASK-003",
        type: "案件调查",
        officer: "王强",
        status: "pending",
        startTime: "10:00",
        endTime: "18:00"
    },
    {
        id: "TASK-004",
        type: "安保任务",
        officer: "赵敏",
        status: "in-progress",
        startTime: "09:00",
        endTime: "17:00"
    }
];

// 地图标记数据
const mapMarkers = [
    { lat: 31.2304, lng: 121.4737, type: "police", title: "巡逻警员-张明" },
    { lat: 31.2310, lng: 121.4745, type: "vehicle", title: "警车-001" },
    { lat: 31.2298, lng: 121.4729, type: "incident", title: "交通事故" },
    { lat: 31.2320, lng: 121.4750, type: "police", title: "巡逻警员-李华" },
    { lat: 31.2285, lng: 121.4710, type: "incident", title: "盗窃案现场" }
];

// 全局变量
let map;
let markers = [];
let currentFilter = "all";

// DOM元素
const casesGrid = document.getElementById('casesGrid');
const officersGrid = document.getElementById('officersGrid');
const tasksTableBody = document.getElementById('tasksTableBody');
const caseFilter = document.getElementById('caseFilter');
const officerSearch = document.getElementById('officerSearch');
const emergencyModal = document.getElementById('emergencyModal');
const emergencyForm = document.getElementById('emergencyForm');
const onlineOfficers = document.getElementById('onlineOfficers');
const availableVehicles = document.getElementById('availableVehicles');
const todayCases = document.getElementById('todayCases');
const processingCases = document.getElementById('processingCases');
const currentTime = document.getElementById('currentTime');
const currentDate = document.getElementById('currentDate');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    initData();
    
    // 初始化地图
    initMap();
    
    // 初始化事件监听
    initEventListeners();
    
    // 更新时间
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 模拟实时更新
    setInterval(updateRealTimeData, 5000);
});

// 初始化数据
function initData() {
    renderCases();
    renderOfficers();
    renderTasks();
    updateStats();
}

// 初始化地图
function initMap() {
    // 创建地图（以上海为中心）
    map = L.map('map').setView([31.2304, 121.4737], 13);
    
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // 添加标记
    addMapMarkers();
    
    // 添加地图控件
    addMapControls();
}

// 添加地图标记
function addMapMarkers() {
    // 清除现有标记
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // 添加新标记
    mapMarkers.forEach(point => {
        let icon;
        let color;
        
        switch(point.type) {
            case 'police':
                color = '#2196f3';
                icon = L.divIcon({
                    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
                    className: 'custom-marker',
                    iconSize: [24, 24]
                });
                break;
            case 'vehicle':
                color = '#4caf50';
                icon = L.divIcon({
                    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); transform: rotate(45deg);"></div>`,
                    className: 'custom-marker',
                    iconSize: [22, 22]
                });
                break;
            case 'incident':
                color = '#f44336';
                icon = L.divIcon({
                    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
                    className: 'custom-marker',
                    iconSize: [26, 26]
                });
                break;
        }
        
        const marker = L.marker([point.lat, point.lng], { icon: icon })
            .addTo(map)
            .bindPopup(`<b>${point.title}</b>`);
        
        markers.push(marker);
    });
}

// 添加地图控件
function addMapControls() {
    // 刷新地图按钮
    document.getElementById('refreshMap').addEventListener('click', function() {
        addMapMarkers();
        showNotification('地图已刷新', 'success');
    });
    
    // 放大按钮
    document.getElementById('zoomIn').addEventListener('click', function() {
        map.zoomIn();
    });
    
    // 缩小按钮
    document.getElementById('zoomOut').addEventListener('click', function() {
        map.zoomOut();
    });
}

// 渲染警情
function renderCases() {
    casesGrid.innerHTML = '';
    
    const filteredCases = currentFilter === 'all' 
        ? casesData 
        : casesData.filter(caseItem => caseItem.type === currentFilter);
    
    filteredCases.forEach(caseItem => {
        const caseCard = document.createElement('div');
        caseCard.className = `case-card ${caseItem.type}`;
        
        caseCard.innerHTML = `
            <div class="case-header">
                <span class="case-id">${caseItem.id}</span>
                <span class="case-time">${caseItem.time}</span>
            </div>
            <h3 class="case-title">${caseItem.title}</h3>
            <div class="case-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${caseItem.location}</span>
            </div>
            <div class="case-actions">
                <button class="case-btn dispatch" data-id="${caseItem.id}">
                    <i class="fas fa-paper-plane"></i> 立即调度
                </button>
                <button class="case-btn details" data-id="${caseItem.id}">
                    <i class="fas fa-info-circle"></i> 详情
                </button>
            </div>
        `;
        
        casesGrid.appendChild(caseCard);
    });
}

// 渲染警员
function renderOfficers() {
    officersGrid.innerHTML = '';
    
    const searchTerm = officerSearch.value.toLowerCase();
    const filteredOfficers = officersData.filter(officer => 
        officer.name.toLowerCase().includes(searchTerm) ||
        officer.badge.includes(searchTerm) ||
        officer.department.toLowerCase().includes(searchTerm)
    );
    
    filteredOfficers.forEach(officer => {
        const officerCard = document.createElement('div');
        officerCard.className = 'officer-card';
        
        // 获取状态类名
        let statusClass = '';
        let statusText = '';
        switch(officer.status) {
            case 'available':
                statusClass = 'status-available';
                statusText = '待命';
                break;
            case 'busy':
                statusClass = 'status-busy';
                statusText = '任务中';
                break;
            case 'offline':
                statusClass = 'status-offline';
                statusText = '离线';
                break;
        }
        
        officerCard.innerHTML = `
            <div class="officer-header">
                <div class="officer-avatar">${officer.name.charAt(0)}</div>
                <div class="officer-info">
                    <h3>${officer.name}</h3>
                    <p>警号: ${officer.badge}</p>
                </div>
            </div>
            <div class="officer-details">
                <div class="detail-item">
                    <span class="detail-label">部门</span>
                    <span class="detail-value">${officer.department}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">状态</span>
                    <span class="detail-value">
                        <span class="officer-status ${statusClass}">${statusText}</span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">位置</span>
                    <span class="detail-value">${officer.location}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">车辆</span>
                    <span class="detail-value">${officer.vehicle}</span>
                </div>
            </div>
            <div class="officer-actions">
                <button class="officer-btn dispatch" data-id="${officer.id}">
                    <i class="fas fa-paper-plane"></i> 调度
                </button>
                <button class="officer-btn details" data-id="${officer.id}">
                    <i class="fas fa-phone"></i> 联系
                </button>
            </div>
        `;
        
        officersGrid.appendChild(officerCard);
    });
}

// 渲染任务
function renderTasks() {
    tasksTableBody.innerHTML = '';
    
    tasksData.forEach(task => {
        const row = document.createElement('tr');
        
        // 获取状态类名和文本
        let statusClass = '';
        let statusText = '';
        switch(task.status) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = '待处理';
                break;
            case 'in-progress':
                statusClass = 'status-in-progress';
                statusText = '进行中';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = '已完成';
                break;
        }
        
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.type}</td>
            <td>${task.officer}</td>
            <td><span class="task-status ${statusClass}">${statusText}</span></td>
            <td>${task.startTime}</td>
            <td class="task-actions">
                <button class="task-btn edit" data-id="${task.id}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="task-btn delete" data-id="${task.id}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </td>
        `;
        
        tasksTableBody.appendChild(row);
    });
}

// 更新统计信息
function updateStats() {
    // 计算在线警员
    const onlineCount = officersData.filter(o => o.status === 'available').length;
    onlineOfficers.textContent = onlineCount;
    
    // 计算可用车辆（简化：假设每个在线警员都有车）
    availableVehicles.textContent = onlineCount;
    
    // 今日警情数
    todayCases.textContent = casesData.length;
    
    // 处理中警情
    const processingCount = casesData.filter(c => c.status === 'in-progress').length;
    processingCases.textContent = processingCount;
}

// 更新日期时间
function updateDateTime() {
    const now = new Date();
    
    // 格式化时间
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 格式化日期
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    currentTime.textContent = timeString;
    currentDate.textContent = dateString;
}

// 模拟实时数据更新
function updateRealTimeData() {
    // 随机更新一些警员状态
    officersData.forEach(officer => {
        if (Math.random() > 0.7) {
            const statuses = ['available', 'busy'];
            officer.status = statuses[Math.floor(Math.random() * statuses.length)];
        }
    });
    
    // 随机添加新警情
    if (Math.random() > 0.8) {
        const newCase = {
            id: `CASE-2024-${String(casesData.length + 1).padStart(3, '0')}`,
            type: ['emergency', 'normal', 'traffic'][Math.floor(Math.random() * 3)],
            title: ['交通事故报警', '纠纷调解请求', '可疑人员报告'][Math.floor(Math.random() * 3)],
            location: ['市中心', '东城区', '西城区'][Math.floor(Math.random() * 3)],
            time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            status: 'pending',
            priority: 'medium'
        };
        
        casesData.unshift(newCase);
        
        // 显示通知
        showNotification(`新警情: ${newCase.title}`, 'info');
    }
    
    // 重新渲染
    renderCases();
    renderOfficers();
    updateStats();
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 初始化事件监听
function initEventListeners() {
    // 警情筛选
    caseFilter.addEventListener('change', function() {
        currentFilter = this.value;
        renderCases();
    });
    
    // 警员搜索
    officerSearch.addEventListener('input', renderOfficers);
    
    // 紧急调度按钮
    document.querySelector('.action-btn.emergency').addEventListener('click', function() {
        emergencyModal.style.display = 'flex';
    });
    
    // 关闭模态框
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            emergencyModal.style.display = 'none';
            emergencyForm.reset();
        });
    });
    
    // 点击模态框背景关闭
    emergencyModal.addEventListener('click', function(e) {
        if (e.target === emergencyModal) {
            emergencyModal.style.display = 'none';
            emergencyForm.reset();
        }
    });
    
    // 紧急调度表单提交
    emergencyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('emergencyType').value;
        const location = document.getElementById('emergencyLocation').value;
        const description = document.getElementById('emergencyDescription').value;
        
        // 创建新警情
        const newCase = {
            id: `CASE-${new Date().getFullYear()}-${String(casesData.length + 1).padStart(3, '0')}`,
            type: 'emergency',
            title: `紧急调度: ${type}`,
            location: location,
            time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            status: 'pending',
            priority: 'high',
            description: description
        };
        
        casesData.unshift(newCase);
        
        // 关闭模态框
        emergencyModal.style.display = 'none';
        emergencyForm.reset();
        
        // 重新渲染
        renderCases();
        updateStats();
        
        // 显示成功通知
        showNotification('紧急调度已发出，警力正在赶往现场', 'success');
        
        // 在地图上添加标记
        addIncidentMarker(location);
    });
    
    // 巡逻安排按钮
    document.querySelector('.action-btn.patrol').addEventListener('click', function() {
        // 随机选择2名在线警员安排巡逻
        const availableOfficers = officersData.filter(o => o.status === 'available');
        if (availableOfficers.length >= 2) {
            const selected = availableOfficers.slice(0, 2);
            selected.forEach(officer => {
                officer.status = 'busy';
            });
            
            renderOfficers();
            updateStats();
            showNotification(`已安排 ${selected.map(o => o.name).join('、')} 执行巡逻任务`, 'success');
        } else {
            showNotification('可用警力不足，无法安排巡逻', 'error');
        }
    });
    
    // 请求支援按钮
    document.querySelector('.action-btn.backup').addEventListener('click', function() {
        showNotification('支援请求已发出，特警队正在待命', 'info');
    });
    
    // 生成报告按钮
    document.querySelector('.action-btn.report').addEventListener('click', function() {
        const reportData = {
            总警情数: casesData.length,
            处理中警情: casesData.filter(c => c.status === 'in-progress').length,
            在线警员: officersData.filter(o => o.status === 'available').length,
            任务中警员: officersData.filter(o => o.status === 'busy').length,
            生成时间: new Date().toLocaleString('zh-CN')
        };
        
        const reportText = JSON.stringify(reportData, null, 2);
        downloadReport(reportText);
    });
    
    // 新建任务按钮
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        const availableOfficers = officersData.filter(o => o.status === 'available');
        if (availableOfficers.length > 0) {
            const officer = availableOfficers[0];
            officer.status = 'busy';
            
            const newTask = {
                id: `TASK-${String(tasksData.length + 1).padStart(3, '0')}`,
                type: '常规巡逻',
                officer: officer.name,
                status: 'in-progress',
                startTime: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                endTime: '--:--'
            };
            
            tasksData.push(newTask);
            renderTasks();
            renderOfficers();
            updateStats();
            showNotification(`已为 ${officer.name} 创建新任务`, 'success');
        } else {
            showNotification('没有可用警员，无法创建新任务', 'error');
        }
    });
    
    // 委托事件：警情卡片按钮
    casesGrid.addEventListener('click', function(e) {
        const target = e.target.closest('.case-btn');
        if (!target) return;
        
        const caseId = target.getAttribute('data-id');
        const caseItem = casesData.find(c => c.id === caseId);
        
        if (target.classList.contains('dispatch')) {
            // 调度警力
            dispatchToCase(caseItem);
        } else if (target.classList.contains('details')) {
            // 查看详情
            showCaseDetails(caseItem);
        }
    });
    
    // 委托事件：警员卡片按钮
    officersGrid.addEventListener('click', function(e) {
        const target = e.target.closest('.officer-btn');
        if (!target) return;
        
        const officerId = target.getAttribute('data-id');
        const officer = officersData.find(o => o.id === officerId);
        
        if (target.classList.contains('dispatch')) {
            // 调度该警员
            dispatchOfficer(officer);
        } else if (target.classList.contains('details')) {
            // 联系警员
            contactOfficer(officer);
        }
    });
    
    // 委托事件：任务表格按钮
    tasksTableBody.addEventListener('click', function(e) {
        const target = e.target.closest('.task-btn');
        if (!target) return;
        
        const taskId = target.getAttribute('data-id');
        const taskIndex = tasksData.findIndex(t => t.id === taskId);
        
        if (target.classList.contains('edit')) {
            // 编辑任务
            editTask(taskIndex);
        } else if (target.classList.contains('delete')) {
            // 删除任务
            deleteTask(taskIndex);
        }
    });
    
    // 导航菜单点击
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加页面切换逻辑
            const page = this.querySelector('span').textContent;
            showNotification(`切换到 ${page} 页面`, 'info');
        });
    });
    
    // 登出按钮
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if (confirm('确定要退出系统吗？')) {
            showNotification('已安全退出系统', 'info');
            // 实际应用中这里应该跳转到登录页面
        }
    });
}

// 调度到警情
function dispatchToCase(caseItem) {
    const availableOfficers = officersData.filter(o => o.status === 'available');
    
    if (availableOfficers.length > 0) {
        // 选择最近的警员（简化：选择第一个）
        const officer = availableOfficers[0];
        officer.status = 'busy';
        
        // 更新警情状态
        caseItem.status = 'in-progress';
        
        // 重新渲染
        renderCases();
        renderOfficers();
        updateStats();
        
        showNotification(`已调度 ${officer.name} 处理 ${caseItem.title}`, 'success');
    } else {
        showNotification('没有可用警员，无法调度', 'error');
    }
}

// 调度警员
function dispatchOfficer(officer) {
    if (officer.status === 'available') {
        officer.status = 'busy';
        renderOfficers();
        updateStats();
        showNotification(`已调度 ${officer.name} 执行任务`, 'success');
    } else {
        showNotification(`${officer.name} 正在执行任务，无法调度`, 'warning');
    }
}

// 联系警员
function contactOfficer(officer) {
    showNotification(`正在呼叫 ${officer.name} (${officer.phone})`, 'info');
    // 实际应用中这里可以集成电话系统
}

// 显示警情详情
function showCaseDetails(caseItem) {
    const details = `
        警情编号: ${caseItem.id}
        类型: ${caseItem.type === 'emergency' ? '紧急' : caseItem.type === 'traffic' ? '交通' : '一般'}
        标题: ${caseItem.title}
        地点: ${caseItem.location}
        时间: ${caseItem.time}
        状态: ${caseItem.status === 'pending' ? '待处理' : '处理中'}
        优先级: ${caseItem.priority === 'high' ? '高' : '中'}
    `;
    
    alert(details);
}

// 编辑任务
function editTask(taskIndex) {
    const task = tasksData[taskIndex];
    const newStatus = prompt('修改任务状态 (pending/in-progress/completed):', task.status);
    
    if (newStatus && ['pending', 'in-progress', 'completed'].includes(newStatus)) {
        task.status = newStatus;
        if (newStatus === 'completed') {
            task.endTime = new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
            
            // 释放警员
            const officer = officersData.find(o => o.name === task.officer);
            if (officer) {
                officer.status = 'available';
                renderOfficers();
                updateStats();
            }
        }
        
        renderTasks();
        showNotification('任务状态已更新', 'success');
    }
}

// 删除任务
function deleteTask(taskIndex) {
    if (confirm('确定要删除这个任务吗？')) {
        const task = tasksData[taskIndex];
        
        // 如果任务进行中，释放警员
        if (task.status === 'in-progress') {
            const officer = officersData.find(o => o.name === task.officer);
            if (officer) {
                officer.status = 'available';
                renderOfficers();
                updateStats();
            }
        }
        
        tasksData.splice(taskIndex, 1);
        renderTasks();
        showNotification('任务已删除', 'success');
    }
}

// 在地图上添加事件标记
function addIncidentMarker(location) {
    // 简化：在当前位置附近随机添加标记
    const center = map.getCenter();
    const lat = center.lat + (Math.random() - 0.5) * 0.01;
    const lng = center.lng + (Math.random() - 0.5) * 0.01;
    
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            html: '<div style="background-color: #f44336; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>',
            className: 'custom-marker',
            iconSize: [26, 26]
        })
    }).addTo(map)
      .bindPopup(`<b>新警情</b><br>${location}`);
    
    markers.push(marker);
    
    // 飞向新标记
    map.flyTo([lat, lng], 15);
}

// 下载报告
function downloadReport(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `警务报告_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('报告已生成并开始下载', 'success');
}

// 添加通知样式
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 3000;
    transform: translateX(120%);
    transition: transform 0.3s ease-out;
    max-width: 350px;
}

.notification.show {
    transform: translateX(0);
}

.notification.info {
    border-left: 4px solid #2196f3;
}

.notification.success {
    border-left: 4px solid #4caf50;
}

.notification.error {
    border-left: 4px solid #f44336;
}

.notification.warning {
    border-left: 4px solid #ff9800;
}

.notification i {
    font-size: 1.2rem;
}

.notification.info i {
    color: #2196f3;
}

.notification.success i {
    color: #4caf50;
}

.notification.error i {
    color: #f44336;
}

.notification.warning i {
    color: #ff9800;
}
`;
document.head.appendChild(notificationStyle);

// 系统初始化完成
console.log('警务调度系统初始化完成！');