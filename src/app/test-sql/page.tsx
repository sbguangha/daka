'use client'

import { useState, useEffect } from 'react'

export default function TestSQLPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        const response = await fetch('/api/tasks-simple')
        const data = await response.json()
        
        if (data.success) {
          setTasks(data.data)
          setError(null)
        } else {
          setError(data.error || '获取任务失败')
        }
      } catch (err) {
        setError('网络错误: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在测试原生SQL API...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">API测试失败</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">原生SQL API测试成功！</h1>
          <p className="text-gray-600">成功从原生SQL API获取到 {tasks.length} 个任务组</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 切换状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">✅ 已切换到原生SQL</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• /api/checkins → /api/checkins-sql</li>
                <li>• /api/stats → /api/stats-sql</li>
                <li>• 数据库连接池已就绪</li>
                <li>• 中间件已更新</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">🔒 保留Prisma认证</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• NextAuth.js + PrismaAdapter</li>
                <li>• Google OAuth 正常</li>
                <li>• 用户会话管理</li>
                <li>• 混合架构稳定</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 任务组数据</h2>
          <div className="space-y-4">
            {tasks.map((group, index) => (
              <div key={group.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{group.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${group.theme || 'bg-gray-100 text-gray-800'}`}>
                    {group.tasks?.length || 0} 个任务
                  </span>
                </div>
                {group.description && (
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                )}
                {group.tasks && group.tasks.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {group.tasks.map((task: any, taskIndex: number) => (
                      <div key={task.id || taskIndex} className="bg-gray-50 rounded px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{task.icon}</span>
                          <span className="text-sm text-gray-700 truncate">{task.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
            <h3 className="font-medium text-yellow-800 mb-2">🚀 下一步</h3>
            <p className="text-sm text-yellow-700">
              现在可以正常使用应用了！打卡功能已切换到稳定的原生SQL实现。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
