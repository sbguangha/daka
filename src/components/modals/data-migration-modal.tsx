"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Upload, X, Clock, Database, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataMigrationModalProps {
  isOpen: boolean
  onClose: () => void
  onMigrate: () => Promise<void>
  onSkip: () => void
  localDataCount?: number
}

export function DataMigrationModal({
  isOpen,
  onClose,
  onMigrate,
  onSkip,
  localDataCount = 0
}: DataMigrationModalProps) {
  const [countdown, setCountdown] = useState(5)
  const [isCountdownActive, setIsCountdownActive] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)

  // 5秒倒计时自动关闭
  useEffect(() => {
    if (!isOpen || !isCountdownActive) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsCountdownActive(false)
          onSkip() // 自动选择跳过
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, isCountdownActive, onSkip])

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setCountdown(5)
      setIsCountdownActive(true)
      setIsMigrating(false)
    }
  }, [isOpen])

  const handleMigrate = async () => {
    setIsCountdownActive(false)
    setIsMigrating(true)
    
    try {
      await onMigrate()
    } catch (error) {
      console.error('数据迁移失败:', error)
    } finally {
      setIsMigrating(false)
    }
  }

  const handleSkip = () => {
    setIsCountdownActive(false)
    onSkip()
  }

  const handleStopCountdown = () => {
    setIsCountdownActive(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleStopCountdown}
      />
      
      {/* 模态框 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">数据迁移</h2>
                <p className="text-blue-100 text-sm">发现本地打卡数据</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 警告信息 */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">
                检测到 {localDataCount} 条本地打卡记录
              </p>
              <p className="text-amber-700">
                登录后将切换到云端模式，本地数据将不再显示。
                您可以选择将本地数据迁移到云端，或者保持分离。
              </p>
            </div>
          </div>

          {/* 数据源对比 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">本地数据</span>
              </div>
              <p className="text-xs text-gray-600">
                {localDataCount} 条打卡记录
              </p>
            </div>
            
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">云端数据</span>
              </div>
              <p className="text-xs text-blue-600">
                多设备同步
              </p>
            </div>
          </div>

          {/* 倒计时提示 */}
          {isCountdownActive && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>
                {countdown} 秒后自动跳过迁移
              </span>
              <button
                onClick={handleStopCountdown}
                className="ml-auto text-blue-600 hover:text-blue-700 underline"
              >
                停止倒计时
              </button>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleMigrate}
              disabled={isMigrating}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isMigrating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>迁移中...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>迁移到云端</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleSkip}
              disabled={isMigrating}
              className={cn(
                "flex-1 px-4 py-3 rounded-lg font-medium transition-colors",
                "border border-gray-300 hover:bg-gray-50 text-gray-700",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              保持分离
            </button>
          </div>

          {/* 说明文字 */}
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>• 迁移到云端：本地数据将上传并合并到您的云端账户</p>
            <p>• 保持分离：本地数据保留在设备上，云端使用独立数据</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 本地数据丢失风险提示
export function LocalDataRiskToast({
  isVisible,
  onClose
}: {
  isVisible: boolean
  onClose: () => void
}) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isVisible, onClose])

  useEffect(() => {
    if (isVisible) {
      setCountdown(5)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-800 mb-1">
              数据风险提示
            </h3>
            <p className="text-sm text-amber-700 mb-2">
              当前使用本地存储，数据可能因清理浏览器缓存而丢失。
              建议登录账号以保障数据安全。
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-600">
                {countdown}秒后自动关闭
              </span>
              <button
                onClick={onClose}
                className="text-xs text-amber-700 hover:text-amber-800 underline"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
