"use client"

import { Cloud, HardDrive, Wifi, WifiOff } from "lucide-react"
import { useAppStore } from "@/store/app-store"
import { cn } from "@/lib/utils"

interface DataSourceIndicatorProps {
  className?: string
  showDetails?: boolean
}

export function DataSourceIndicator({ 
  className, 
  showDetails = true 
}: DataSourceIndicatorProps) {
  const { isAuthenticated, user, isLoading } = useAppStore()

  const getDataSourceInfo = () => {
    if (isAuthenticated && user) {
      return {
        type: 'cloud' as const,
        icon: Cloud,
        label: '云端数据',
        description: '数据已同步到云端，可在多设备访问',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    } else {
      return {
        type: 'local' as const,
        icon: HardDrive,
        label: '本地数据',
        description: '数据仅保存在当前设备',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      }
    }
  }

  const sourceInfo = getDataSourceInfo()
  const Icon = sourceInfo.icon

  if (!showDetails) {
    // 简化版本 - 只显示图标和标签
    return (
      <div className={cn(
        "flex items-center gap-2 text-sm",
        sourceInfo.color,
        className
      )}>
        <Icon className="w-4 h-4" />
        <span className="font-medium">{sourceInfo.label}</span>
        {isLoading && (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    )
  }

  // 详细版本 - 显示完整信息卡片
  return (
    <div className={cn(
      "rounded-lg border p-3",
      sourceInfo.bgColor,
      sourceInfo.borderColor,
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 p-2 rounded-lg bg-white",
          sourceInfo.borderColor,
          "border"
        )}>
          <Icon className={cn("w-5 h-5", sourceInfo.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-medium", sourceInfo.color)}>
              {sourceInfo.label}
            </h3>
            {isLoading && (
              <div className={cn(
                "w-3 h-3 border border-current border-t-transparent rounded-full animate-spin",
                sourceInfo.color
              )} />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {sourceInfo.description}
          </p>
          
          {sourceInfo.type === 'cloud' && user && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>已登录: {user.email}</span>
            </div>
          )}
          
          {sourceInfo.type === 'local' && (
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span>数据可能丢失，建议登录账号</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 状态栏版本 - 用于顶部状态栏
export function DataSourceStatusBar({ className }: { className?: string }) {
  const { isAuthenticated, isLoading } = useAppStore()

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
      isAuthenticated 
        ? "bg-blue-100 text-blue-700 border border-blue-200" 
        : "bg-gray-100 text-gray-600 border border-gray-200",
      className
    )}>
      {isAuthenticated ? (
        <>
          <Cloud className="w-3 h-3" />
          <span>云端</span>
        </>
      ) : (
        <>
          <HardDrive className="w-3 h-3" />
          <span>本地</span>
        </>
      )}
      
      {isLoading && (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  )
}

// 网络状态指示器
export function NetworkStatusIndicator({ className }: { className?: string }) {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

  if (isOnline) return null

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
      "bg-red-100 text-red-700 border border-red-200",
      className
    )}>
      <WifiOff className="w-3 h-3" />
      <span>离线模式</span>
    </div>
  )
}
