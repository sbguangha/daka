"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/store/app-store"
import { api } from "@/lib/api-client"

export function useMigrationPrompt() {
  const { 
    isAuthenticated, 
    checkInHistory, 
    timesheetData,
    user 
  } = useAppStore()

  const [shouldShowMigration, setShouldShowMigration] = useState(false)
  const [migrationChecked, setMigrationChecked] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user && !migrationChecked) {
      checkIfMigrationNeeded()
    }
  }, [isAuthenticated, user, migrationChecked])

  const checkIfMigrationNeeded = async () => {
    try {
      // 检查本地是否有数据
      const hasLocalData = getLocalDataSummary().totalCheckIns > 0

      if (!hasLocalData) {
        setMigrationChecked(true)
        return
      }

      // 检查云端迁移状态
      const response = await api.migrate.status()
      
      if (response.success && response.data) {
        const { needsMigration, checkInCount } = response.data
        
        // 如果需要迁移（云端无数据）或者本地数据比云端多，提示迁移
        if (needsMigration || (hasLocalData && checkInCount === 0)) {
          // 检查用户是否已经忽略过迁移提示
          const migrationDismissed = localStorage.getItem(`migration-dismissed-${user?.id}`)
          
          if (!migrationDismissed) {
            setShouldShowMigration(true)
          }
        }
      }
    } catch (error) {
      console.error('检查迁移状态失败:', error)
    } finally {
      setMigrationChecked(true)
    }
  }

  const getLocalDataSummary = () => {
    const checkInDays = Object.keys(checkInHistory).length
    const totalCheckIns = Object.values(checkInHistory).reduce(
      (total, dayCheckIns) => total + Object.values(dayCheckIns).filter(Boolean).length,
      0
    )
    const habits = timesheetData.habits.length

    return { checkInDays, totalCheckIns, habits }
  }

  const dismissMigrationPrompt = () => {
    setShouldShowMigration(false)
    if (user?.id) {
      localStorage.setItem(`migration-dismissed-${user.id}`, 'true')
    }
  }

  const showMigrationModal = () => {
    setShouldShowMigration(true)
  }

  return {
    shouldShowMigration,
    setShouldShowMigration,
    dismissMigrationPrompt,
    showMigrationModal,
    localDataSummary: getLocalDataSummary(),
    migrationChecked
  }
}
