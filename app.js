// 打卡任务分组数据
const taskGroups = [
    {
        title: '身体是革命的本钱',
        theme: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        tasks: [
            { id: 'dumbbell', name: '哑铃', icon: 'dumbbell' },
            { id: 'calf', name: '踮脚跟', icon: 'arrow-up' },
            { id: 'stretch', name: '身体拉升', icon: 'stretch-horizontal' }
        ]
    },
    {
        title: '月入万刀，加油！',
        theme: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        tasks: [
            { id: 'zhishixingqiu', name: '看知识星球', icon: 'book-open' },
            { id: 'gefei', name: '看哥飞社群', icon: 'users' },
            { id: 'build', name: '实操建站', icon: 'code' }
        ]
    },
    {
        title: '明心净心',
        theme: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
        tasks: [
            { id: 'read', name: '阅读', icon: 'book' }
        ]
    }
];

// 应用状态
let appState = {
    completedTasks: {},
    streak: 0,
    lastCheckDate: null,
    history: {} // 存储历史打卡数据
};

// 当前显示日期
let currentDisplayDate = new Date();

// 初始化
function init() {
    loadData();
    setupEventListeners();
    renderTasks();
    updateDateDisplay();
    updateProgress();
    setupThemeToggle();
    checkNewDay();
    updateDateNavigation();
}

// 加载数据
function loadData() {
    const saved = localStorage.getItem('dakaApp');
    if (saved) {
        appState = { ...appState, ...JSON.parse(saved) };
    }
}

// 保存数据
function saveData() {
    localStorage.setItem('dakaApp', JSON.stringify(appState));
}

// 设置事件监听器
function setupEventListeners() {
    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
    document.getElementById('statsToggle').addEventListener('click', showStats);
    document.getElementById('closeStats').addEventListener('click', hideStats);
    document.getElementById('statsModal').addEventListener('click', (e) => {
        if (e.target.id === 'statsModal') hideStats();
    });
}

// 更新日期显示
function updateDateDisplay() {
    const dateDisplay = document.getElementById('dateDisplay');
    const dateStatus = document.getElementById('dateStatus');
    
    const options = { month: 'long', day: 'numeric', weekday: 'long' };
    dateDisplay.textContent = currentDisplayDate.toLocaleDateString('zh-CN', options);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const displayDay = new Date(currentDisplayDate);
    displayDay.setHours(0, 0, 0, 0);
    
    if (displayDay.getTime() === today.getTime()) {
        dateStatus.textContent = '今日打卡';
    } else {
        dateStatus.textContent = '历史记录（只读）';
    }
}

// 更新日期导航按钮状态
function updateDateNavigation() {
    const nextBtn = document.getElementById('nextDay');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const displayDay = new Date(currentDisplayDate);
    displayDay.setHours(0, 0, 0, 0);
    
    nextBtn.disabled = displayDay.getTime() >= today.getTime();
}

// 切换日期
function changeDate(days) {
    currentDisplayDate.setDate(currentDisplayDate.getDate() + days);
    updateDateDisplay();
    updateDateNavigation();
    renderTasks();
    updateProgress();
}

// 获取当前显示日期的数据
function getCurrentDateData() {
    const dateKey = formatDateKey(currentDisplayDate);
    return appState.history[dateKey] || {};
}

// 格式化日期键
function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

// 检查新的一天
function checkNewDay() {
    const today = new Date().toDateString();
    if (appState.lastCheckDate !== today) {
        // 保存昨天的数据到历史
        if (appState.lastCheckDate) {
            const lastDate = new Date(appState.lastCheckDate);
            const lastDateKey = formatDateKey(lastDate);
            appState.history[lastDateKey] = { ...appState.completedTasks };
        }

        // 计算连续打卡天数
        calculateStreak();

        // 重置今日任务
        appState.completedTasks = {};
        appState.lastCheckDate = today;

        saveData();
    }
}

// 计算连续打卡天数
function calculateStreak() {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // 从昨天开始往前检查
    currentDate.setDate(currentDate.getDate() - 1);

    while (true) {
        const dateKey = formatDateKey(currentDate);
        const dayData = appState.history[dateKey] || {};

        // 检查这一天是否有完成任务
        const hasCompletedTasks = Object.keys(dayData).some(key => dayData[key]);

        if (hasCompletedTasks) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    appState.streak = streak;
}

// 渲染任务卡片
function renderTasks() {
    const grid = document.getElementById('tasksGrid');
    grid.innerHTML = '';
    
    const isToday = isCurrentDateToday();
    const dateData = getCurrentDateData();
    
    taskGroups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'mb-8';
        
        // 主题标题
        const titleDiv = document.createElement('div');
        titleDiv.className = `rounded-xl p-4 mb-4 ${group.theme}`;
        titleDiv.innerHTML = `
            <h3 class="text-xl font-bold text-center">${group.title}</h3>
        `;
        groupDiv.appendChild(titleDiv);
        
        // 任务卡片网格
        const cardsGrid = document.createElement('div');
        const gridCols = group.tasks.length === 1 ? 'grid-cols-1' : 
                        group.tasks.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                        'grid-cols-1 md:grid-cols-3';
        cardsGrid.className = `grid ${gridCols} gap-4`;
        
        // 如果只有一项，居中显示
        if (group.tasks.length === 1) {
            cardsGrid.className += ' md:grid-cols-1 max-w-md mx-auto';
        }
        
        group.tasks.forEach(task => {
            const isCompleted = isToday ? 
                (appState.completedTasks[task.id] || false) : 
                (dateData[task.id] || false);
            const card = createTaskCard(task, isCompleted, isToday);
            cardsGrid.appendChild(card);
        });
        
        groupDiv.appendChild(cardsGrid);
        grid.appendChild(groupDiv);
    });
}

// 检查当前显示日期是否为今天
function isCurrentDateToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const displayDay = new Date(currentDisplayDate);
    displayDay.setHours(0, 0, 0, 0);
    return displayDay.getTime() === today.getTime();
}

// 创建任务卡片
function createTaskCard(task, isCompleted, isToday = true) {
    const card = document.createElement('div');
    card.className = `glass-effect rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
        isCompleted ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''
    } ${!isToday ? 'opacity-90' : ''}`;
    
    const buttonClass = isToday 
        ? (isCompleted 
            ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer' 
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer')
        : (isCompleted 
            ? 'bg-green-500 text-white cursor-not-allowed opacity-70' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50');
    
    const buttonText = isCompleted ? '已完成' : (isToday ? '打卡' : '未完成');
    const onclick = isToday ? `toggleTask('${task.id}')` : '';
    
    card.innerHTML = `
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full ${
                isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
            } flex items-center justify-center mb-4 transition-colors duration-300">
                <i data-lucide="${task.icon}" class="w-8 h-8 ${
                    isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                }"></i>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">${task.name}</h3>
            <button ${onclick ? `onclick="${onclick}"` : ''} class="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${buttonClass}"
                ${!isToday ? 'disabled' : ''}>
                ${buttonText}
            </button>
        </div>
    `;
    
    return card;
}

// 切换任务状态
function toggleTask(taskId) {
    if (!isCurrentDateToday()) return; // 如果不是今天，不能修改

    const isCompleted = appState.completedTasks[taskId];

    if (isCompleted) {
        delete appState.completedTasks[taskId];
    } else {
        appState.completedTasks[taskId] = true;
    }

    saveData();
    renderTasks();
    updateProgress();
    lucide.createIcons();
}

// 更新进度
function updateProgress() {
    const dateData = isCurrentDateToday() ? appState.completedTasks : getCurrentDateData();
    const completed = Object.keys(dateData).filter(key => dateData[key]).length;
    const allTasks = taskGroups.flatMap(group => group.tasks);
    const total = allTasks.length;
    const percent = Math.round((completed / total) * 100);
    
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('progressPercent').textContent = `${percent}%`;
    document.getElementById('streakCount').textContent = appState.streak;
    
    // 更新进度环
    const circle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

// 主题切换
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // 检查系统主题偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

// 显示统计
function showStats() {
    const modal = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');

    // 计算统计数据
    const stats = calculateStats();
    const allTasks = taskGroups.flatMap(group => group.tasks);

    content.innerHTML = `
        <div class="space-y-6">
            <!-- 总览 -->
            <div class="glass-effect rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">总览</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${stats.totalDays}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">总天数</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400">${stats.completedDays}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">完成天数</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">${stats.averageCompletion.toFixed(0)}%</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">平均完成度</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">${stats.currentStreak}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">连续打卡</p>
                    </div>
                </div>
            </div>

            <!-- 各项目统计 -->
            <div class="glass-effect rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">各项目打卡情况</h3>
                <div class="space-y-3">
                    ${allTasks.map(task => `
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <i data-lucide="${task.icon}" class="w-4 h-4 text-gray-600 dark:text-gray-400"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-gray-100">${task.name}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-gray-900 dark:text-gray-100">${stats.taskStats[task.id]?.completed || 0} / ${stats.totalDays}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${stats.totalDays > 0 ? ((stats.taskStats[task.id]?.completed || 0) / stats.totalDays * 100).toFixed(0) : 0}%</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 月度热力图 -->
            <div class="glass-effect rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">月度打卡热力图</h3>
                <div class="grid grid-cols-7 gap-1 text-xs">
                    ${generateHeatmap()}
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    lucide.createIcons();
}

// 隐藏统计
function hideStats() {
    const modal = document.getElementById('statsModal');
    modal.classList.add('hidden');
}

// 计算统计数据
function calculateStats() {
    const history = appState.history;
    const today = formatDateKey(new Date());

    // 合并今日数据
    const allData = { ...history, [today]: appState.completedTasks };

    const allTasks = taskGroups.flatMap(group => group.tasks);
    const totalDays = Object.keys(allData).length;
    const completedDays = Object.values(allData).filter(day =>
        Object.keys(day).length > 0
    ).length;

    let totalCompletions = 0;
    let taskStats = {};

    // 初始化任务统计
    allTasks.forEach(task => {
        taskStats[task.id] = { completed: 0, total: totalDays, name: task.name };
    });

    // 计算每个任务的完成次数
    Object.values(allData).forEach(dayData => {
        const completedCount = Object.keys(dayData).filter(key => dayData[key]).length;
        totalCompletions += completedCount;

        allTasks.forEach(task => {
            if (dayData[task.id]) {
                taskStats[task.id].completed++;
            }
        });
    });

    const averageCompletion = totalDays > 0 ? (totalCompletions / (totalDays * allTasks.length)) * 100 : 0;

    return {
        totalDays,
        completedDays,
        averageCompletion,
        currentStreak: appState.streak,
        taskStats
    };
}

// 生成热力图
function generateHeatmap() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const allTasks = taskGroups.flatMap(group => group.tasks);
    let html = '';
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

    // 添加星期标题
    dayNames.forEach(day => {
        html += `<div class="text-center font-medium text-gray-600 dark:text-gray-400">${day}</div>`;
    });

    // 生成30天的热力图
    for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(thirtyDaysAgo.getDate() + i);
        const dateKey = formatDateKey(date);

        const dayData = appState.history[dateKey] || {};
        const todayKey = formatDateKey(new Date());
        const todayData = dateKey === todayKey ? appState.completedTasks : {};
        const combinedData = { ...dayData, ...todayData };

        const completedCount = Object.keys(combinedData).filter(key => combinedData[key]).length;
        const intensity = allTasks.length > 0 ? completedCount / allTasks.length : 0;

        let bgColor = 'bg-gray-100 dark:bg-gray-800';
        if (intensity > 0) {
            if (intensity <= 0.3) bgColor = 'bg-green-200 dark:bg-green-800';
            else if (intensity <= 0.7) bgColor = 'bg-green-400 dark:bg-green-600';
            else bgColor = 'bg-green-600 dark:bg-green-400';
        }

        html += `
            <div class="aspect-square rounded ${bgColor} flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300"
                 title="${date.toLocaleDateString('zh-CN')}: ${completedCount}/${allTasks.length}">
                ${date.getDate()}
            </div>
        `;
    }

    return html;
}

// 初始化Lucide图标
lucide.createIcons();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);