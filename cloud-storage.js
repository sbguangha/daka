// 云存储功能模块
// 使用 Firebase Firestore 作为免费云数据库

class CloudStorage {
    constructor() {
        this.isOnline = navigator.onLine;
        this.currentUser = null;
        this.syncQueue = [];
        
        // 监听网络状态
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // 初始化 Firebase（需要配置）
    async initFirebase() {
        // 这里需要你的 Firebase 配置
        // 免费额度：每天 50,000 次读取，20,000 次写入
        const firebaseConfig = {
            // 你需要在 Firebase 控制台获取这些配置
            apiKey: "your-api-key",
            authDomain: "your-project.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "123456789",
            appId: "your-app-id"
        };
        
        // 注意：实际使用时需要引入 Firebase SDK
        // <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
        // <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>
        // <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
    }

    // 简单的用户认证（使用邮箱作为用户ID）
    async loginUser(email, password) {
        try {
            // 简化版：使用邮箱的哈希作为用户ID
            const userId = await this.hashString(email);
            
            // 验证密码（简化版，实际应该使用更安全的方法）
            const storedPassword = localStorage.getItem(`pwd_${userId}`);
            
            if (!storedPassword) {
                // 新用户注册
                localStorage.setItem(`pwd_${userId}`, await this.hashString(password));
                this.currentUser = { id: userId, email: email };
                return { success: true, isNewUser: true };
            } else if (storedPassword === await this.hashString(password)) {
                // 用户登录成功
                this.currentUser = { id: userId, email: email };
                return { success: true, isNewUser: false };
            } else {
                return { success: false, error: '密码错误' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 登出
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // 保存数据到云端
    async saveToCloud(data) {
        if (!this.currentUser) {
            throw new Error('用户未登录');
        }

        const dataToSave = {
            userId: this.currentUser.id,
            data: data,
            timestamp: new Date().toISOString(),
            version: Date.now()
        };

        if (this.isOnline) {
            try {
                // 这里应该调用 Firebase API
                // await db.collection('userdata').doc(this.currentUser.id).set(dataToSave);
                
                // 临时方案：保存到 localStorage 并标记为已同步
                localStorage.setItem(`cloud_${this.currentUser.id}`, JSON.stringify(dataToSave));
                return { success: true };
            } catch (error) {
                // 如果云端保存失败，加入同步队列
                this.syncQueue.push(dataToSave);
                return { success: false, queued: true };
            }
        } else {
            // 离线时加入同步队列
            this.syncQueue.push(dataToSave);
            return { success: false, queued: true };
        }
    }

    // 从云端加载数据
    async loadFromCloud() {
        if (!this.currentUser) {
            throw new Error('用户未登录');
        }

        try {
            // 这里应该调用 Firebase API
            // const doc = await db.collection('userdata').doc(this.currentUser.id).get();
            
            // 临时方案：从 localStorage 读取
            const cloudData = localStorage.getItem(`cloud_${this.currentUser.id}`);
            
            if (cloudData) {
                const parsed = JSON.parse(cloudData);
                return { success: true, data: parsed.data };
            } else {
                return { success: true, data: null };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 同步待处理的数据
    async syncPendingData() {
        if (!this.isOnline || this.syncQueue.length === 0) return;

        const toSync = [...this.syncQueue];
        this.syncQueue = [];

        for (const data of toSync) {
            try {
                await this.saveToCloud(data.data);
            } catch (error) {
                // 如果同步失败，重新加入队列
                this.syncQueue.push(data);
            }
        }
    }

    // 合并本地和云端数据
    mergeData(localData, cloudData) {
        if (!cloudData) return localData;
        if (!localData) return cloudData;

        // 简单的合并策略：以最新的数据为准
        const merged = { ...localData };

        // 合并历史记录
        if (cloudData.history) {
            merged.history = { ...merged.history, ...cloudData.history };
        }

        // 合并连续打卡记录（取最大值）
        if (cloudData.streak > merged.streak) {
            merged.streak = cloudData.streak;
        }

        // 合并今日任务（本地优先）
        if (cloudData.completedTasks && Object.keys(merged.completedTasks).length === 0) {
            merged.completedTasks = cloudData.completedTasks;
        }

        return merged;
    }

    // 工具函数：字符串哈希
    async hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否在线
    isUserOnline() {
        return this.isOnline;
    }

    // 获取同步状态
    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            pendingSync: this.syncQueue.length,
            lastSync: localStorage.getItem('lastSyncTime')
        };
    }
}

// 导出实例
const cloudStorage = new CloudStorage();
