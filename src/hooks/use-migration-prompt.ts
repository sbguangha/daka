"use client"

import { useState, useEffect, useCallback } from "react"
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

  const getLocalDataSummary = useCallback(() => {
    const checkInDays = Object.keys(checkInHistory).length
    const totalCheckIns = Object.values(checkInHistory).reduce(
      (total, dayCheckIns) => total + Object.values(dayCheckIns).filter(Boolean).length,
      0
    )
    const habits = timesheetData.habits.length

    return { checkInDays, totalCheckIns, habits }
  }, [checkInHistory, timesheetData.habits])

  const checkIfMigrationNeeded = useCallback(async () => {
    try {
      // 检查本地是否有数据
      const hasLocalData = getLocalDataSummary().totalCheckIns > 0

      if (!hasLocalData) {
        setMigrationChecked(true)
        return
      }

      // Migration API has been removed, check if user has local data and hasn't dismissed
      if (hasLocalData) {
        const migrationDismissed = localStorage.getItem(`migration-dismissed-${user?.id}`)
        
        if (!migrationDismissed) {
          setShouldShowMigration(true)
        }
      }
    } catch (error) {
      console.error('检查迁移状态失败:', error)
    } finally {
      setMigrationChecked(true)
    }
  }, [getLocalDataSummary, user?.id])

  useEffect(() => {
    if (isAuthenticated && user && !migrationChecked) {
      checkIfMigrationNeeded()
    }
  }, [isAuthenticated, user, migrationChecked, checkIfMigrationNeeded])

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
