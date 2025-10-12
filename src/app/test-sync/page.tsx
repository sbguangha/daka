"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/app-store"

export default function TestSyncPage() {
  const { data: session, status } = useSession()
  const { 
    taskGroups, 
    checkInHistory, 
    isAuthenticated, 
    loadTasksFromAPI, 
    syncWithAPI,
    formatDateKey,
    currentDate
  } = useAppStore()
  
  const [lastSyncTime, setLastSyncTime] = useState<string>("")
  const [syncStatus, setSyncStatus] = useState<string>("未同步")

  const dateKey = formatDateKey(currentDate)
  const todayCheckIns = checkInHistory[dateKey] || {}

  const handleManualSync = async () => {
    setSyncStatus("同步中...")
    try {
      await Promise.all([
        loadTasksFromAPI(),
        syncWithAPI()
      ])
      setLastSyncTime(new Date().toLocaleTimeString())
      setSyncStatus("同步成功")
    } catch (error) {
      console.error("手动同步失败:", error)
      setSyncStatus("同步失败")
    }
  }

  useEffect(() => {
    // Add noindex meta tag for test pages
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    } else {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }

    if (isAuthenticated) {
      setLastSyncTime(new Date().toLocaleTimeString())
      setSyncStatus("自动同步完成")
    }
  }, [taskGroups, checkInHistory, isAuthenticated])

  if (status === "loading") {
    return <div className="p-8">加载中...</div>
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">数据同步测试页面</h1>
        <p>请先登录以测试数据同步功能</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">数据同步测试页面</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">用户信息</h2>
        <p><strong>邮箱:</strong> {session.user?.email}</p>
        <p><strong>姓名:</strong> {session.user?.name}</p>
        <p><strong>认证状态:</strong> {isAuthenticated ? "已认证" : "未认证"}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">同步状态</h2>
        <p><strong>状态:</strong> {syncStatus}</p>
        <p><strong>最后同步时间:</strong> {lastSyncTime || "未同步"}</p>
        <button 
          onClick={handleManualSync}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          手动同步
        </button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">今日打卡状态 ({dateKey})</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(todayCheckIns).map(([taskId, completed]) => (
            <div key={taskId} className="flex justify-between">
              <span>任务 {taskId}:</span>
              <span className={completed ? "text-green-600" : "text-gray-400"}>
                {completed ? "✅ 已完成" : "⭕ 未完成"}
              </span>
            </div>
          ))}
        </div>
        {Object.keys(todayCheckIns).length === 0 && (
          <p className="text-gray-500">今日暂无打卡记录</p>
        )}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">任务组信息</h2>
        <p><strong>任务组数量:</strong> {taskGroups.length}</p>
        {taskGroups.map((group) => (
          <div key={group.id} className="mt-2 p-2 bg-white rounded">
            <h3 className="font-medium">{group.title}</h3>
            <p>任务数量: {group.tasks.length}</p>
            <div className="text-sm text-gray-600">
              {group.tasks.map((task) => (
                <span key={task.id} className="mr-2">
                  {task.name} {todayCheckIns[task.id] ? "✅" : "⭕"}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">测试说明</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>在一个浏览器中登录并进行打卡操作</li>
          <li>在另一个浏览器中登录同一账号</li>
          <li>刷新页面或点击"手动同步"按钮</li>
          <li>检查两个浏览器中的数据是否一致</li>
          <li>切换浏览器标签页后再回来，数据应该自动刷新</li>
        </ol>
      </div>
    </div>
  )
}
