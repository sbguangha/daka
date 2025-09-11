"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useSeparatedAppStore } from "@/store/separated-app-store"
import { DataSourceIndicator, DataSourceStatusBar, NetworkStatusIndicator } from "@/components/ui/data-source-indicator"
import { DataMigrationModal, LocalDataRiskToast } from "@/components/modals/data-migration-modal"
import { TimesheetGrid } from "@/components/timesheet/timesheet-grid"
import { TimesheetHeader } from "@/components/timesheet/timesheet-header"
import { TimesheetStats } from "@/components/timesheet/timesheet-stats"
import { AddTaskModal } from "@/components/modals/add-task-modal"
import { Loader2 } from "lucide-react"

export function SeparatedTimesheetClient() {
  const { data: session, status } = useSession()
  const [showAddModal, setShowAddModal] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const {
    // 状态
    isAuthenticated,
    dataSource,
    isLoading,
    isLoadingTasks,
    showMigrationModal,
    showRiskToast,
    currentData,
    
    // 操作
    setUser,
    clearUser,
    loadLocalData,
    switchToCloudMode,
    switchToLocalMode,
    migrateLocalToCloud,
    hideMigrationDialog,
    hideLocalDataRisk,
    showLocalDataRisk,
    getCurrentDateTasks,
    getTodayProgress,
    toggleTask,
    invalidateCloudCache
  } = useSeparatedAppStore()

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      setIsClient(true)
      
      try {
        if (status === "loading") {
          return // 等待认证状态确定
        }

        if (status === "authenticated" && session?.user) {
          // 用户已登录，设置用户信息（会自动触发数据源切换）
          setUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          })
        } else {
          // 用户未登录，加载本地数据
          await loadLocalData()
          
          // 显示本地数据风险提示
          setTimeout(() => {
            showLocalDataRisk()
          }, 2000)
        }
        
        setIsInitialized(true)
      } catch (error) {
        console.error('❌ 初始化失败:', error)
        setIsInitialized(true)
      }
    }

    initializeData()
  }, [status, session, setUser, loadLocalData, showLocalDataRisk])

  // 处理用户登出
  useEffect(() => {
    if (status === "unauthenticated" && isInitialized) {
      clearUser()
    }
  }, [status, isInitialized, clearUser])

  // 页面可见性变化时刷新数据
  useEffect(() => {
    if (!isClient || !isAuthenticated) return

    const handleVisibilityChange = () => {
      if (!document.hidden && dataSource === 'cloud') {
        console.log('📱 页面变为可见，刷新云端数据...')
        // 使缓存失效并重新加载
        invalidateCloudCache()
        switchToCloudMode()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isClient, isAuthenticated, dataSource, invalidateCloudCache, switchToCloudMode])

  // 数据迁移处理
  const handleMigration = useCallback(async () => {
    try {
      const result = await migrateLocalToCloud()
      
      if (result.success) {
        console.log(`✅ 数据迁移成功，迁移了 ${result.migratedCount} 条记录`)
        // 迁移成功后切换到云端模式
        await switchToCloudMode()
      } else {
        console.warn('⚠️ 数据迁移失败或无数据需要迁移')
        // 即使迁移失败也切换到云端模式
        await switchToCloudMode()
      }
      
      hideMigrationDialog()
    } catch (error) {
      console.error('❌ 数据迁移过程中出错:', error)
      // 出错时也切换到云端模式
      await switchToCloudMode()
      hideMigrationDialog()
    }
  }, [migrateLocalToCloud, switchToCloudMode, hideMigrationDialog])

  const handleSkipMigration = useCallback(async () => {
    try {
      // 跳过迁移，直接切换到云端模式
      await switchToCloudMode()
      hideMigrationDialog()
    } catch (error) {
      console.error('❌ 切换到云端模式失败:', error)
      hideMigrationDialog()
    }
  }, [switchToCloudMode, hideMigrationDialog])

  // 获取本地数据条目数量
  const getLocalDataCount = useCallback(() => {
    const { localData } = useSeparatedAppStore.getState()
    return Object.values(localData.checkInHistory).reduce(
      (total, dayCheckIns) => total + Object.keys(dayCheckIns).length,
      0
    )
  }, [])

  // 加载状态
  if (!isClient || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>正在初始化...</span>
        </div>
      </div>
    )
  }

  const tasks = getCurrentDateTasks()
  const progress = getTodayProgress()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部状态栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">每日打卡</h1>
            <DataSourceStatusBar />
            <NetworkStatusIndicator />
          </div>
          
          {(isLoading || isLoadingTasks) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>同步中...</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* 数据源指示器 */}
        <div className="mb-6">
          <DataSourceIndicator showDetails={true} />
        </div>

        {/* 主要内容 */}
        <div className="space-y-6">
          <TimesheetHeader 
            progress={progress}
            onAddTask={() => setShowAddModal(true)}
          />
          
          <TimesheetStats 
            tasks={tasks}
            progress={progress}
          />
          
          <TimesheetGrid 
            taskGroups={tasks}
            onToggleTask={toggleTask}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 模态框 */}
      {showAddModal && (
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* 数据迁移模态框 */}
      <DataMigrationModal
        isOpen={showMigrationModal}
        onClose={hideMigrationDialog}
        onMigrate={handleMigration}
        onSkip={handleSkipMigration}
        localDataCount={getLocalDataCount()}
      />

      {/* 本地数据风险提示 */}
      <LocalDataRiskToast
        isVisible={showRiskToast}
        onClose={hideLocalDataRisk}
      />
    </div>
  )
}
