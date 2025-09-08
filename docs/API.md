# API 文档

本文档描述了每日打卡应用的内部 API 和数据结构。

## 📊 数据结构

### 应用状态 (appState)

```javascript
const appState = {
    completedTasks: {},      // 今日完成的任务
    streak: 0,               // 连续打卡天数
    lastCheckDate: null,     // 最后检查日期
    history: {},             // 历史打卡数据
    user: null               // 当前登录用户
};
```

### 任务组 (taskGroups)

```javascript
const taskGroups = [
    {
        title: "分类标题",
        theme: "Tailwind CSS 类名",
        tasks: [
            {
                id: "唯一标识符",
                name: "任务名称", 
                icon: "Lucide 图标名"
            }
        ]
    }
];
```

### 历史数据格式

```javascript
// 日期键格式: YYYY-MM-DD
const history = {
    "2025-01-01": {
        "dumbbell": true,
        "read": true
        // ... 其他任务ID
    },
    "2025-01-02": {
        // 当日完成的任务
    }
};
```

## 🔧 核心函数

### 数据管理

#### `loadData()`
加载本地和云端数据
```javascript
async function loadData()
```

#### `saveData()`
保存数据到本地和云端
```javascript
async function saveData()
```

#### `formatDateKey(date)`
格式化日期为键值
```javascript
function formatDateKey(date) // 返回 "YYYY-MM-DD"
```

### 任务管理

#### `toggleTask(taskId)`
切换任务完成状态
```javascript
function toggleTask(taskId)
```

#### `renderTasks()`
渲染任务卡片
```javascript
function renderTasks()
```

#### `createTaskCard(task, isCompleted, isToday)`
创建单个任务卡片
```javascript
function createTaskCard(task, isCompleted, isToday = true)
```

### 进度计算

#### `updateProgress()`
更新进度显示
```javascript
function updateProgress()
```

#### `calculateStreak()`
计算连续打卡天数
```javascript
function calculateStreak()
```

#### `calculateStats()`
计算统计数据
```javascript
function calculateStats() // 返回统计对象
```

### 日期导航

#### `changeDate(days)`
切换显示日期
```javascript
function changeDate(days) // days: 正数向后，负数向前
```

#### `getCurrentDateData()`
获取当前显示日期的数据
```javascript
function getCurrentDateData() // 返回当日数据对象
```

#### `isCurrentDateToday()`
检查当前显示日期是否为今天
```javascript
function isCurrentDateToday() // 返回 boolean
```

## 🔄 数据同步 API

### 云存储 (CloudStorage)

#### `loginUser(email, password)`
用户登录
```javascript
async function loginUser(email, password)
// 返回: { success: boolean, isNewUser: boolean, error?: string }
```

#### `saveToCloud(data)`
保存数据到云端
```javascript
async function saveToCloud(data)
// 返回: { success: boolean, queued?: boolean }
```

#### `loadFromCloud()`
从云端加载数据
```javascript
async function loadFromCloud()
// 返回: { success: boolean, data?: object, error?: string }
```

#### `mergeData(localData, cloudData)`
合并本地和云端数据
```javascript
function mergeData(localData, cloudData)
// 返回: 合并后的数据对象
```

### 数据同步 (DataSync)

#### `exportData()`
导出数据到文件
```javascript
function exportData()
// 返回: { success: boolean, message?: string, error?: string }
```

#### `importData(file)`
从文件导入数据
```javascript
async function importData(file)
// 返回: Promise<{ success: boolean, data?: object, info?: object }>
```

#### `generateShareCode()`
生成分享码
```javascript
function generateShareCode()
// 返回: { success: boolean, code?: string, error?: string }
```

## 🎨 UI 组件

### 模态框管理

#### `showStats()`
显示统计模态框
```javascript
function showStats()
```

#### `showLogin()`
显示登录模态框
```javascript
function showLogin()
```

#### `showSync()`
显示同步模态框
```javascript
function showSync()
```

### 通知系统

#### `showNotification(message, type)`
显示通知消息
```javascript
function showNotification(message, type = 'info')
// type: 'success' | 'error' | 'info'
```

## 🎯 事件系统

### 页面事件

```javascript
// 页面加载完成
document.addEventListener('DOMContentLoaded', init);

// 主题切换
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// 日期导航
document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
```

### 自定义事件

可以监听以下自定义事件：

```javascript
// 数据更新事件
window.addEventListener('dataUpdated', (event) => {
    console.log('数据已更新', event.detail);
});

// 同步完成事件
window.addEventListener('syncCompleted', (event) => {
    console.log('同步完成', event.detail);
});
```

## 🔧 配置选项

### 任务配置

```javascript
// 添加新的任务分类
const newTaskGroup = {
    title: '新分类',
    theme: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white',
    tasks: [
        { id: 'new-task', name: '新任务', icon: 'star' }
    ]
};

taskGroups.push(newTaskGroup);
```

### 主题配置

```javascript
// 自定义主题色
const customTheme = {
    primary: 'blue',
    secondary: 'gray',
    accent: 'green'
};
```

## 📱 浏览器兼容性

### 必需的 API
- `localStorage` - 数据存储
- `fetch` - 网络请求（如果使用云同步）
- `Promise` - 异步操作
- `ES6+` - 现代 JavaScript 语法

### 可选的 API
- `crypto.subtle` - 数据加密（云存储）
- `navigator.onLine` - 网络状态检测
- `matchMedia` - 深色模式检测

## 🐛 错误处理

### 常见错误类型

```javascript
// 数据加载错误
try {
    await loadData();
} catch (error) {
    console.error('数据加载失败:', error);
    showNotification('数据加载失败', 'error');
}

// 同步错误
try {
    await saveToCloud(data);
} catch (error) {
    console.error('云端同步失败:', error);
    // 数据会保存到本地队列，稍后重试
}
```

### 错误恢复

应用具有以下错误恢复机制：
- 本地数据备份
- 离线模式支持
- 自动重试机制
- 数据验证和修复

## 📈 性能优化

### 最佳实践
- 使用 `requestAnimationFrame` 进行动画
- 防抖处理频繁操作
- 懒加载非关键资源
- 缓存计算结果

### 内存管理
- 及时清理事件监听器
- 避免内存泄漏
- 合理使用闭包

---

更多详细信息请参考源代码注释。
