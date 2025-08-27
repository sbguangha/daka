// 数据同步功能 - 导入/导出方案
class DataSync {
    constructor() {
        this.version = '1.0';
    }

    // 导出数据到文件
    exportData() {
        try {
            const exportData = {
                version: this.version,
                timestamp: new Date().toISOString(),
                data: appState,
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                }
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `daka-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
            
            return { success: true, message: '数据导出成功' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 导入数据从文件
    importData(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('请选择文件'));
                return;
            }

            if (!file.name.endsWith('.json')) {
                reject(new Error('请选择JSON格式的备份文件'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // 验证数据格式
                    if (!this.validateImportData(importData)) {
                        reject(new Error('备份文件格式不正确'));
                        return;
                    }

                    // 合并数据
                    const mergedData = this.mergeImportData(appState, importData.data);
                    
                    resolve({
                        success: true,
                        data: mergedData,
                        info: {
                            version: importData.version,
                            timestamp: importData.timestamp,
                            deviceInfo: importData.deviceInfo
                        }
                    });
                } catch (error) {
                    reject(new Error('文件解析失败：' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('文件读取失败'));
            };

            reader.readAsText(file);
        });
    }

    // 验证导入数据格式
    validateImportData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.data || typeof data.data !== 'object') return false;
        if (!data.version || !data.timestamp) return false;
        
        const requiredFields = ['completedTasks', 'streak', 'history'];
        return requiredFields.every(field => data.data.hasOwnProperty(field));
    }

    // 合并导入的数据
    mergeImportData(currentData, importData) {
        const merged = { ...currentData };

        // 合并历史记录（保留所有记录）
        if (importData.history) {
            merged.history = { ...merged.history, ...importData.history };
        }

        // 合并连续打卡记录（取最大值）
        if (importData.streak && importData.streak > merged.streak) {
            merged.streak = importData.streak;
        }

        // 如果当前没有今日数据，使用导入的今日数据
        if (importData.completedTasks && Object.keys(merged.completedTasks).length === 0) {
            merged.completedTasks = { ...importData.completedTasks };
        }

        // 更新最后检查日期
        if (importData.lastCheckDate) {
            merged.lastCheckDate = importData.lastCheckDate;
        }

        return merged;
    }

    // 创建二维码分享（简化版）
    generateShareCode() {
        try {
            const shareData = {
                version: this.version,
                data: {
                    streak: appState.streak,
                    totalDays: Object.keys(appState.history).length,
                    completedDays: Object.values(appState.history).filter(day => 
                        Object.keys(day).length > 0
                    ).length
                },
                timestamp: new Date().toISOString()
            };

            const shareCode = btoa(JSON.stringify(shareData));
            return { success: true, code: shareCode };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 解析分享码
    parseShareCode(code) {
        try {
            const shareData = JSON.parse(atob(code));
            return { success: true, data: shareData };
        } catch (error) {
            return { success: false, error: '分享码格式错误' };
        }
    }

    // 自动备份到浏览器存储
    autoBackup() {
        try {
            const backupKey = `daka-backup-${new Date().toISOString().split('T')[0]}`;
            const backupData = {
                version: this.version,
                timestamp: new Date().toISOString(),
                data: appState
            };

            localStorage.setItem(backupKey, JSON.stringify(backupData));
            
            // 清理旧备份（保留最近7天）
            this.cleanOldBackups();
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 清理旧备份
    cleanOldBackups() {
        const keys = Object.keys(localStorage);
        const backupKeys = keys.filter(key => key.startsWith('daka-backup-'));
        
        if (backupKeys.length > 7) {
            backupKeys.sort().slice(0, -7).forEach(key => {
                localStorage.removeItem(key);
            });
        }
    }

    // 获取备份列表
    getBackupList() {
        const keys = Object.keys(localStorage);
        const backupKeys = keys.filter(key => key.startsWith('daka-backup-'));
        
        return backupKeys.map(key => {
            try {
                const backup = JSON.parse(localStorage.getItem(key));
                return {
                    key: key,
                    date: backup.timestamp,
                    version: backup.version,
                    size: JSON.stringify(backup).length
                };
            } catch (error) {
                return null;
            }
        }).filter(backup => backup !== null).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // 恢复备份
    restoreBackup(backupKey) {
        try {
            const backup = JSON.parse(localStorage.getItem(backupKey));
            if (!backup || !this.validateImportData(backup)) {
                throw new Error('备份数据无效');
            }

            return {
                success: true,
                data: backup.data,
                info: {
                    version: backup.version,
                    timestamp: backup.timestamp
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// 创建实例
const dataSync = new DataSync();

// 每天自动备份
setInterval(() => {
    dataSync.autoBackup();
}, 24 * 60 * 60 * 1000); // 24小时

// 页面卸载时备份
window.addEventListener('beforeunload', () => {
    dataSync.autoBackup();
});
