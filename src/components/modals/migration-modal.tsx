"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/store/app-store"
import { api } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Upload, Database } from "lucide-react"

interface MigrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MigrationModal({ open, onOpenChange }: MigrationModalProps) {
  const { 
    isAuthenticated, 
    checkInHistory, 
    timesheetData,
    migrateLocalDataToAPI,
    isLoading 
  } = useAppStore()

  const [migrationStatus, setMigrationStatus] = useState<{
    hasCheckIns: boolean
    checkInCount: number
    needsMigration: boolean
  } | null>(null)

  const [migrationResult, setMigrationResult] = useState<{
    success: boolean
    migratedCount?: number
    errors?: string[]
  } | null>(null)

  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false)

  // 检查迁移状态
  useEffect(() => {
    if (open && isAuthenticated) {
      checkMigrationStatus()
    }
  }, [open, isAuthenticated])

  const checkMigrationStatus = async () => {
    try {
      const response = await api.migrate.status()
      if (response.success && response.data) {
        setMigrationStatus(response.data)
      }
    } catch (error) {
      console.error('检查迁移状态失败:', error)
    }
  }

  const handleMigration = async (overwrite = false) => {
    try {
      const success = await migrateLocalDataToAPI(overwrite)
      
      if (success) {
        setMigrationResult({
          success: true,
          migratedCount: Object.keys(checkInHistory).length
        })
        // 重新检查状态
        await checkMigrationStatus()
      } else {
        setMigrationResult({
          success: false,
          errors: ['迁移失败，请稍后重试']
        })
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        errors: [error instanceof Error ? error.message : '未知错误']
      })
    }
    
    setShowOverwriteConfirm(false)
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

  if (!isAuthenticated) {
    return null
  }

  const localSummary = getLocalDataSummary()
  const hasLocalData = localSummary.totalCheckIns > 0 || localSummary.habits > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            数据迁移
          </DialogTitle>
          <DialogDescription>
            将您的本地打卡数据同步到云端，实现跨设备访问
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 本地数据概览 */}
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">本地数据概览</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {localSummary.checkInDays}
                </div>
                <div className="text-gray-600">打卡天数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {localSummary.totalCheckIns}
                </div>
                <div className="text-gray-600">总打卡次数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {localSummary.habits}
                </div>
                <div className="text-gray-600">自定义习惯</div>
              </div>
            </div>
          </div>

          {/* 云端数据状态 */}
          {migrationStatus && (
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">云端数据状态</h4>
              <div className="flex items-center gap-2 text-sm">
                {migrationStatus.hasCheckIns ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>已有 {migrationStatus.checkInCount} 条打卡记录</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span>暂无云端数据</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 迁移进度 */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4 animate-pulse" />
                <span>正在迁移数据...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {/* 迁移结果 */}
          {migrationResult && (
            <Alert className={migrationResult.success ? "border-green-200" : "border-red-200"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {migrationResult.success ? (
                  <span className="text-green-700">
                    迁移成功！已同步 {migrationResult.migratedCount} 条记录到云端
                  </span>
                ) : (
                  <div className="text-red-700">
                    <div>迁移失败：</div>
                    {migrationResult.errors?.map((error, index) => (
                      <div key={index} className="text-sm mt-1">• {error}</div>
                    ))}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* 覆盖确认 */}
          {showOverwriteConfirm && (
            <Alert className="border-orange-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-orange-700">
                  <div className="font-medium">检测到云端已有数据</div>
                  <div className="text-sm mt-1">
                    继续迁移将覆盖云端现有的 {migrationStatus?.checkInCount} 条记录。
                    此操作不可撤销，请确认是否继续？
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-4">
            {!hasLocalData ? (
              <Alert>
                <AlertDescription>
                  暂无本地数据需要迁移
                </AlertDescription>
              </Alert>
            ) : showOverwriteConfirm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowOverwriteConfirm(false)}
                  disabled={isLoading}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleMigration(true)}
                  disabled={isLoading}
                >
                  确认覆盖
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  稍后处理
                </Button>
                <Button
                  onClick={() => {
                    if (migrationStatus?.hasCheckIns) {
                      setShowOverwriteConfirm(true)
                    } else {
                      handleMigration(false)
                    }
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  开始迁移
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
