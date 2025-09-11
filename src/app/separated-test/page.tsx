"use client"

import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useSeparatedAppStore } from "@/store/separated-app-store"
import { DataSourceIndicator } from "@/components/ui/data-source-indicator"
import { DataMigrationModal } from "@/components/modals/data-migration-modal"
import { cloudCache } from "@/utils/cloud-cache"
import { 
  Database, 
  HardDrive, 
  RefreshCw, 
  Trash2, 
  LogIn, 
  LogOut,
  Plus,
  Minus,
  BarChart3
} from "lucide-react"

export default function SeparatedTestPage() {
  const { data: session, status } = useSession()
  const [cacheStats, setCacheStats] = useState<any>(null)
  
  const {
    // 状态
    isAuthenticated,
    user,
    dataSource,
    localData,
    cloudData,
    currentData,
    isLoading,
    showMigrationModal,
    
    // 操作
    setUser,
    clearUser,
    loadLocalData,
    loadCloudData,
    switchToLocalMode,
    switchToCloudMode,
    toggleTaskLocal,
    toggleTaskCloud,
    invalidateCloudCache,
    migrateLocalToCloud,
    showMigrationDialog,
    hideMigrationDialog,
    formatDateKey,
    currentDate,
    getCurrentDateTasks,
    getTodayProgress
  } = useSeparatedAppStore()

  // 初始化
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      })
    } else if (status === "unauthenticated") {
      clearUser()
      loadLocalData()
    }
  }, [status, session, setUser, clearUser, loadLocalData])

  // 更新缓存统计
  useEffect(() => {
    const updateCacheStats = () => {
      setCacheStats(cloudCache.getStats())
    }
    
    updateCacheStats()
    const interval = setInterval(updateCacheStats, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleLogin = () => {
    signIn('google')
  }

  const handleLogout = () => {
    signOut()
  }

  const handleAddLocalTask = () => {
    const taskId = '1' // 使用第一个任务进行测试
    toggleTaskLocal(taskId)
  }

  const handleAddCloudTask = async () => {
    const taskId = '1' // 使用第一个任务进行测试
    try {
      await toggleTaskCloud(taskId)
    } catch (error) {
      console.error('云端打卡失败:', error)
    }
  }

  const handleMigration = async () => {
    try {
      const result = await migrateLocalToCloud()
      console.log('迁移结果:', result)
      await switchToCloudMode()
      hideMigrationDialog()
    } catch (error) {
      console.error('迁移失败:', error)
      hideMigrationDialog()
    }
  }

  const handleSkipMigration = async () => {
    await switchToCloudMode()
    hideMigrationDialog()
  }

  const dateKey = formatDateKey(currentDate)
  const todayCheckIns = currentData.checkInHistory[dateKey] || {}
  const tasks = getCurrentDateTasks()
  const progress = getTodayProgress()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            分离式数据存储测试
          </h1>
          <p className="text-gray-600">
            测试本地模式和云端模式的完全分离
          </p>
        </div>

        {/* 认证状态 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            认证状态
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>登录状态:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isAuthenticated 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {isAuthenticated ? '已登录' : '未登录'}
              </span>
            </div>
            
            {user && (
              <div className="flex items-center justify-between">
                <span>用户邮箱:</span>
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              {!isAuthenticated ? (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  登录 Google
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  登出
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 数据源状态 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            数据源状态
          </h2>
          
          <DataSourceIndicator showDetails={true} className="mb-4" />
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={switchToLocalMode}
              disabled={dataSource === 'local'}
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                dataSource === 'local'
                  ? 'bg-gray-100 border-gray-300 text-gray-500'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>切换到本地模式</span>
            </button>
            
            <button
              onClick={switchToCloudMode}
              disabled={!isAuthenticated || dataSource === 'cloud'}
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                !isAuthenticated || dataSource === 'cloud'
                  ? 'bg-gray-100 border-gray-300 text-gray-500'
                  : 'hover:bg-blue-50 border-blue-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>切换到云端模式</span>
            </button>
          </div>
        </div>

        {/* 数据操作 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            数据操作测试
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* 本地数据 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                本地数据
              </h3>
              
              <div className="text-sm text-gray-600">
                <p>打卡记录: {Object.keys(localData.checkInHistory).length} 天</p>
                <p>今日打卡: {Object.values(todayCheckIns).filter(Boolean).length} 个</p>
              </div>
              
              <button
                onClick={handleAddLocalTask}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                本地打卡测试
              </button>
            </div>

            {/* 云端数据 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <Database className="w-4 h-4" />
                云端数据
              </h3>
              
              <div className="text-sm text-gray-600">
                <p>打卡记录: {Object.keys(cloudData.checkInHistory).length} 天</p>
                <p>最后同步: {cloudData.lastSynced ? new Date(cloudData.lastSynced).toLocaleTimeString() : '未同步'}</p>
              </div>
              
              <button
                onClick={handleAddCloudTask}
                disabled={!isAuthenticated}
                className={`w-full px-3 py-2 rounded flex items-center justify-center gap-2 ${
                  isAuthenticated
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                云端打卡测试
              </button>
            </div>
          </div>
        </div>

        {/* 缓存状态 */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              缓存状态
            </h2>
            
            {cacheStats && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                  <p>缓存条目: {cacheStats.validEntries}/{cacheStats.totalEntries}</p>
                  <p>缓存大小: {Math.round(cacheStats.totalSize / 1024)}KB</p>
                </div>
                <div className="text-sm">
                  <p>过期条目: {cacheStats.expiredEntries}</p>
                  <p>命中率: {Math.round(cacheStats.hitRate * 100)}%</p>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => loadCloudData(true)}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                强制刷新
              </button>
              
              <button
                onClick={invalidateCloudCache}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                清除缓存
              </button>
            </div>
          </div>
        )}

        {/* 数据迁移测试 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">数据迁移测试</h2>
          
          <button
            onClick={showMigrationDialog}
            disabled={!isAuthenticated}
            className={`px-4 py-2 rounded ${
              isAuthenticated
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            显示迁移对话框
          </button>
        </div>

        {/* 当前数据预览 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">当前数据预览</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">今日进度</h3>
              <div className="text-sm text-gray-600">
                完成: {progress.completed}/{progress.total} ({progress.percentage}%)
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">任务状态</h3>
              <div className="space-y-1">
                {tasks.map(group => (
                  <div key={group.id} className="text-sm">
                    <span className="font-medium">{group.title}:</span>
                    {group.tasks.map(task => (
                      <span key={task.id} className="ml-2">
                        {task.name} {task.completed ? '✅' : '⭕'}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据迁移模态框 */}
      <DataMigrationModal
        isOpen={showMigrationModal}
        onClose={hideMigrationDialog}
        onMigrate={handleMigration}
        onSkip={handleSkipMigration}
        localDataCount={Object.values(localData.checkInHistory).reduce(
          (total, dayCheckIns) => total + Object.keys(dayCheckIns).length,
          0
        )}
      />
    </div>
  )
}
