// 业务数据访问层 - 使用原生SQL
// 专门处理打卡、统计等高频业务操作

import { executeQuery, executeQuerySingle, executeTransaction } from './database'
import { checkInQueries, taskQueries, statsQueries, streakQueries } from './sql-queries'
import type { PoolClient } from 'pg'

// 类型定义 - 与Prisma生成的类型保持一致
export interface CheckInRecord {
  id: string
  date: Date
  userId: string
  taskId: string
  checkedAt: Date
  note?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CheckInWithTask {
  id: string
  date: Date
  userId: string
  taskId: string
  checkedAt: Date
  note?: string | null
  task: {
    id: string
    name: string
    icon: string
    taskGroup: {
      id: string
      title: string
      theme: string
    }
  }
}

export interface TaskGroup {
  id: string
  title: string
  description?: string | null
  theme: string
  order: number
  isDefault: boolean
  isActive: boolean
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  description?: string | null
  icon: string
  order: number
  isActive: boolean
  taskGroupId: string
  completed?: boolean // 仅在包含打卡状态时存在
}

export interface UserStats {
  totalCheckIns: number
  checkInDays: number
  currentStreak: number
  taskStats: Array<{
    taskId: string
    count: number
    task: {
      id: string
      name: string
      icon: string
      taskGroup: {
        title: string
        theme: string
      }
    }
  }>
  period: {
    startDate: string
    endDate: string
  }
}

// 打卡记录相关操作
export const checkInData = {
  // 获取用户打卡记录
  async findByUser(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    taskId?: string
  ): Promise<CheckInWithTask[]> {
    let query = checkInQueries.findByUserAndDateRange
    const params: any[] = [userId]

    if (startDate && endDate) {
      params.push(startDate, endDate)
    } else {
      // 默认查询最近30天
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      params.push(thirtyDaysAgo, now)
    }

    // 如果指定了taskId，修改查询条件
    if (taskId) {
      query = query + ` AND ci."taskId" = $${params.length + 1}`
      params.push(taskId)
    }

    const rows = await executeQuery(query, params)
    
    // 转换数据格式
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      userId: row.userId,
      taskId: row.taskId,
      checkedAt: row.checkedAt,
      note: row.note,
      task: {
        id: row.task_id,
        name: row.task_name,
        icon: row.task_icon,
        taskGroup: {
          id: row.taskgroup_id,
          title: row.taskgroup_title,
          theme: row.taskgroup_theme
        }
      }
    }))
  },

  // 检查特定打卡记录是否存在
  async findByUserTaskDate(
    userId: string, 
    taskId: string, 
    date: Date
  ): Promise<CheckInRecord | null> {
    const row = await executeQuerySingle(
      checkInQueries.findByUserTaskDate, 
      [userId, taskId, date]
    )
    return row || null
  },

  // 创建打卡记录
  async create(
    userId: string, 
    taskId: string, 
    date: Date, 
    note?: string
  ): Promise<CheckInRecord> {
    const row = await executeQuerySingle(
      checkInQueries.create, 
      [userId, taskId, date, note || null]
    )
    if (!row) {
      throw new Error('创建打卡记录失败')
    }
    return row
  },

  // 删除打卡记录
  async deleteByUserTaskDate(
    userId: string, 
    taskId: string, 
    date: Date
  ): Promise<boolean> {
    const result = await executeQuery(
      checkInQueries.deleteByUserTaskDate, 
      [userId, taskId, date]
    )
    return true // 删除操作总是返回成功
  },

  // 切换打卡状态（创建或删除）
  async toggle(
    userId: string, 
    taskId: string, 
    date: Date, 
    note?: string
  ): Promise<{ action: 'checked' | 'unchecked', data?: CheckInRecord }> {
    return await executeTransaction(async (client: PoolClient) => {
      // 检查是否已存在
      const existing = await client.query(
        checkInQueries.findByUserTaskDate, 
        [userId, taskId, date]
      )

      if (existing.rows.length > 0) {
        // 存在则删除
        await client.query(
          checkInQueries.deleteByUserTaskDate, 
          [userId, taskId, date]
        )
        return { action: 'unchecked' as const }
      } else {
        // 不存在则创建
        const result = await client.query(
          checkInQueries.create, 
          [userId, taskId, date, note || null]
        )
        return { 
          action: 'checked' as const, 
          data: result.rows[0] 
        }
      }
    })
  },

  // 统计用户打卡记录数量
  async countByUser(userId: string): Promise<number> {
    const row = await executeQuerySingle(
      checkInQueries.countByUser, 
      [userId]
    )
    return parseInt(row?.count || '0')
  }
}

// 任务相关操作
export const taskData = {
  // 获取所有活跃的任务组和任务
  async findAllActiveWithTasks(includeCheckIns = false, userId?: string, date?: Date): Promise<TaskGroup[]> {
    const rows = await executeQuery(taskQueries.findAllActiveWithTasks)
    
    // 转换为嵌套结构
    const groupMap = new Map<string, TaskGroup>()
    
    for (const row of rows) {
      if (!groupMap.has(row.group_id)) {
        groupMap.set(row.group_id, {
          id: row.group_id,
          title: row.group_title,
          description: row.group_description,
          theme: row.group_theme,
          order: row.group_order,
          isDefault: row.group_isDefault,
          isActive: row.group_isActive,
          tasks: []
        })
      }
      
      if (row.task_id) {
        const group = groupMap.get(row.group_id)!
        group.tasks.push({
          id: row.task_id,
          name: row.task_name,
          description: row.task_description,
          icon: row.task_icon,
          order: row.task_order,
          isActive: row.task_isActive,
          taskGroupId: row.task_taskGroupId
        })
      }
    }

    const result = Array.from(groupMap.values()).sort((a, b) => a.order - b.order)
    
    // 如果需要包含打卡状态
    if (includeCheckIns && userId && date) {
      const checkIns = await executeQuery(
        checkInQueries.findByUserAndDate,
        [userId, date]
      )
      const checkedTaskIds = new Set(checkIns.map(c => c.taskId))
      
      result.forEach(group => {
        group.tasks.forEach(task => {
          task.completed = checkedTaskIds.has(task.id)
        })
      })
    }
    
    return result
  },

  // 验证任务是否存在
  async findById(taskId: string): Promise<Task | null> {
    const row = await executeQuerySingle(taskQueries.findById, [taskId])
    return row || null
  }
}

// 统计相关操作
export const statsData = {
  // 获取概览统计
  async getOverviewStats(userId: string, startDate: Date, endDate: Date): Promise<UserStats> {
    // 并行执行多个查询
    const [
      totalCheckInsResult,
      checkInDaysResult,
      taskStatsResult
    ] = await Promise.all([
      executeQuerySingle(statsQueries.getTotalCheckIns, [userId, startDate, endDate]),
      executeQuerySingle(statsQueries.getCheckInDays, [userId, startDate, endDate]),
      executeQuery(statsQueries.getTaskStats, [userId, startDate, endDate])
    ])

    const totalCheckIns = parseInt(totalCheckInsResult?.count || '0')
    const checkInDays = parseInt(checkInDaysResult?.count || '0')
    const currentStreak = await this.getCurrentStreak(userId)

    const taskStats = taskStatsResult.map(row => ({
      taskId: row.taskId,
      count: parseInt(row.count),
      task: {
        id: row.taskId,
        name: row.task_name,
        icon: row.task_icon,
        taskGroup: {
          title: row.taskgroup_title,
          theme: row.taskgroup_theme
        }
      }
    }))

    return {
      totalCheckIns,
      checkInDays,
      currentStreak,
      taskStats,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    }
  },

  // 获取每日统计
  async getDailyStats(userId: string, startDate: Date, endDate: Date) {
    const rows = await executeQuery(statsQueries.getDailyStats, [userId, startDate, endDate])
    return rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      count: parseInt(row.count)
    }))
  },

  // 获取月度统计
  async getMonthlyStats(userId: string, startDate: Date, endDate: Date) {
    const rows = await executeQuery(statsQueries.getMonthlyStats, [userId, startDate, endDate])
    return rows.map(row => ({
      month: row.month,
      count: parseInt(row.count)
    }))
  },

  // 计算当前连续打卡天数
  async getCurrentStreak(userId: string): Promise<number> {
    const rows = await executeQuery(statsQueries.getCheckInsByDateDesc, [userId])

    if (rows.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = 0
    let currentDate = new Date(today)

    // 从今天开始往前查找连续打卡记录
    for (const row of rows) {
      const checkInDate = new Date(row.date)
      checkInDate.setHours(0, 0, 0, 0)

      if (checkInDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (checkInDate.getTime() < currentDate.getTime()) {
        // 如果有间隔，连续记录中断
        break
      }
    }

    return streak
  }
}

// 连续打卡记录相关操作
export const streakData = {
  // 获取用户的连续打卡记录
  async findByUser(userId: string, limit = 10) {
    const rows = await executeQuery(
      `${streakQueries.findByUser} LIMIT ${limit}`,
      [userId]
    )
    return rows
  },

  // 获取最长连续记录
  async findLongestByUser(userId: string) {
    const row = await executeQuerySingle(streakQueries.findLongestByUser, [userId])
    return row
  },

  // 获取当前连续记录
  async findCurrentByUser(userId: string) {
    const row = await executeQuerySingle(streakQueries.findCurrentByUser, [userId])
    return row
  }
}
