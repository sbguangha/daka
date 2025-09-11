"use client"

import { create } from "zustand"
import { api } from "@/lib/api-client"
import { cloudCache, CacheKeys } from "@/utils/cloud-cache"

// 类型定义
export interface AuthUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface Task {
  id: string
  name: string
  completed: boolean
}

export interface TaskGroup {
  id: string
  title: string
  theme: string
  tasks: Task[]
}

export interface DailyCheckIns {
  [taskId: string]: boolean
}

export interface CheckInHistory {
  [dateKey: string]: DailyCheckIns
}

// 数据源类型
export type DataSource = 'local' | 'cloud'

// 本地数据结构
export interface LocalData {
  taskGroups: TaskGroup[]
  checkInHistory: CheckInHistory
  streak: number
  lastUpdated: string
}

// 云端数据结构（与本地相同，但来源不同）
export interface CloudData {
  taskGroups: TaskGroup[]
  checkInHistory: CheckInHistory
  streak: number
  lastUpdated: string
  lastSynced: string
}

// Store 接口
export interface SeparatedAppStore {
  // 用户认证状态
  isAuthenticated: boolean
  user: AuthUser | null
  
  // 数据源
  dataSource: DataSource
  
  // 本地数据
  localData: LocalData
  
  // 云端数据（包含缓存）
  cloudData: CloudData
  cloudCache: {
    isValid: boolean
    expiresAt: number
    lastFetch: number
  }
  
  // 当前显示的数据（根据数据源自动切换）
  currentData: LocalData | CloudData
  
  // UI 状态
  currentDate: Date
  isLoading: boolean
  isLoadingTasks: boolean
  showMigrationModal: boolean
  showRiskToast: boolean
  
  // 工具方法
  formatDateKey: (date: Date) => string
  
  // 认证操作
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
  
  // 数据源切换
  switchToLocalMode: () => void
  switchToCloudMode: () => Promise<void>
  
  // 本地数据操作
  loadLocalData: () => Promise<void>
  saveLocalData: () => Promise<void>
  toggleTaskLocal: (taskId: string) => void
  
  // 云端数据操作
  loadCloudData: (forceRefresh?: boolean) => Promise<void>
  toggleTaskCloud: (taskId: string) => Promise<void>
  invalidateCloudCache: () => void
  
  // 统一操作接口（根据当前数据源自动选择）
  toggleTask: (groupId: string, taskId: string) => Promise<void>
  getCurrentDateTasks: () => TaskGroup[]
  getTodayProgress: () => { completed: number; total: number; percentage: number }
  
  // 数据迁移
  migrateLocalToCloud: () => Promise<{ success: boolean; migratedCount: number }>
  showMigrationDialog: () => void
  hideMigrationDialog: () => void
  
  // 风险提示
  showLocalDataRisk: () => void
  hideLocalDataRisk: () => void
  
  // 日期操作
  setCurrentDate: (date: Date) => void
}

// 默认任务组（本地和云端共用）
const getDefaultTaskGroups = (): TaskGroup[] => [
  {
    id: '1',
    title: 'Health & Fitness',
    theme: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    tasks: [
      { id: '1', name: 'Dumbbell Exercise', completed: false },
      { id: '2', name: 'Calf Raises', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Learning & Growth',
    theme: 'bg-gradient-to-r from-green-500 to-teal-600 text-white',
    tasks: [
      { id: '3', name: 'English Learning', completed: false },
      { id: '4', name: 'Programming Practice', completed: false },
      { id: '5', name: 'Reading Books', completed: false },
      { id: '6', name: 'Writing Journal', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Mind & Spirit',
    theme: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    tasks: [
      { id: '7', name: 'Meditation', completed: false },
    ],
  },
]

// 本地存储管理
const LOCAL_STORAGE_KEY = 'separated-app-data'

const loadFromLocalStorage = (): LocalData => {
  if (typeof window === 'undefined') {
    return {
      taskGroups: getDefaultTaskGroups(),
      checkInHistory: {},
      streak: 0,
      lastUpdated: new Date().toISOString()
    }
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        taskGroups: parsed.taskGroups || getDefaultTaskGroups(),
        checkInHistory: parsed.checkInHistory || {},
        streak: parsed.streak || 0,
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
  }

  return {
    taskGroups: getDefaultTaskGroups(),
    checkInHistory: {},
    streak: 0,
    lastUpdated: new Date().toISOString()
  }
}

const saveToLocalStorage = (data: LocalData) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...data,
      lastUpdated: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// 云端缓存管理
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

const createEmptyCloudData = (): CloudData => ({
  taskGroups: [],
  checkInHistory: {},
  streak: 0,
  lastUpdated: new Date().toISOString(),
  lastSynced: new Date().toISOString()
})

// 创建Store
export const useSeparatedAppStore = create<SeparatedAppStore>((set, get) => ({
  // 初始状态
  isAuthenticated: false,
  user: null,
  dataSource: 'local',
  
  localData: loadFromLocalStorage(),
  cloudData: createEmptyCloudData(),
  cloudCache: {
    isValid: false,
    expiresAt: 0,
    lastFetch: 0
  },
  
  currentData: loadFromLocalStorage(),
  
  currentDate: new Date(),
  isLoading: false,
  isLoadingTasks: false,
  showMigrationModal: false,
  showRiskToast: false,

  // 工具方法
  formatDateKey: (date: Date) => {
    return date.toISOString().split('T')[0]
  },

  // 认证操作
  setUser: (user: AuthUser | null) => {
    const { localData } = get()
    const hasLocalData = Object.keys(localData.checkInHistory).length > 0

    if (user) {
      set({
        user,
        isAuthenticated: true,
        dataSource: 'cloud'
      })

      // 如果有本地数据，显示迁移对话框
      if (hasLocalData) {
        get().showMigrationDialog()
      } else {
        // 直接切换到云端模式
        get().switchToCloudMode()
      }
    } else {
      get().clearUser()
    }
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      dataSource: 'local',
      currentData: get().localData,
      cloudData: createEmptyCloudData(),
      cloudCache: {
        isValid: false,
        expiresAt: 0,
        lastFetch: 0
      }
    })
  },

  // 数据源切换
  switchToLocalMode: () => {
    const { localData } = get()
    set({
      dataSource: 'local',
      currentData: localData
    })
  },

  switchToCloudMode: async () => {
    set({
      dataSource: 'cloud',
      isLoading: true
    })

    try {
      await get().loadCloudData()
      const { cloudData } = get()
      set({
        currentData: cloudData,
        isLoading: false
      })
    } catch (error) {
      console.error('切换到云端模式失败:', error)
      // 回退到本地模式
      get().switchToLocalMode()
      set({ isLoading: false })
    }
  },

  // 本地数据操作
  loadLocalData: async () => {
    const localData = loadFromLocalStorage()
    set({
      localData,
      currentData: get().dataSource === 'local' ? localData : get().currentData
    })
  },

  saveLocalData: async () => {
    const { localData } = get()
    saveToLocalStorage(localData)
  },

  toggleTaskLocal: (taskId: string) => {
    const { localData, formatDateKey, currentDate } = get()
    const dateKey = formatDateKey(currentDate)
    
    const currentDayCheckIns = localData.checkInHistory[dateKey] || {}
    const newCheckIns = {
      ...currentDayCheckIns,
      [taskId]: !currentDayCheckIns[taskId]
    }

    const updatedLocalData = {
      ...localData,
      checkInHistory: {
        ...localData.checkInHistory,
        [dateKey]: newCheckIns
      },
      lastUpdated: new Date().toISOString()
    }

    set({
      localData: updatedLocalData,
      currentData: get().dataSource === 'local' ? updatedLocalData : get().currentData
    })

    // 保存到本地存储
    saveToLocalStorage(updatedLocalData)
  },

  // 云端数据操作
  loadCloudData: async (forceRefresh = false) => {
    const { isAuthenticated, formatDateKey, currentDate } = get()

    if (!isAuthenticated) {
      throw new Error('用户未登录')
    }

    const dateKey = formatDateKey(currentDate)
    const tasksCacheKey = CacheKeys.tasks(dateKey)
    const checkInsCacheKey = CacheKeys.checkIns()

    // 检查缓存是否有效
    if (!forceRefresh) {
      const cachedTasks = cloudCache.get(tasksCacheKey) as TaskGroup[]
      const cachedCheckIns = cloudCache.get(checkInsCacheKey) as CheckInHistory

      if (cachedTasks && cachedCheckIns) {
        console.log('✅ 使用云端数据缓存')

        const cloudData: CloudData = {
          taskGroups: cachedTasks,
          checkInHistory: cachedCheckIns,
          streak: 0,
          lastUpdated: new Date().toISOString(),
          lastSynced: new Date().toISOString()
        }

        set({ cloudData })
        return
      }
    }

    set({ isLoadingTasks: true })

    try {
      // 并行加载任务和打卡记录
      const [tasksResponse, checkInsResponse] = await Promise.all([
        api.tasks.get({ includeCheckIns: true, date: get().formatDateKey(get().currentDate) }),
        api.checkIns.get()
      ])

      if (tasksResponse.success && checkInsResponse.success) {
        // 转换API数据为本地格式
        const taskGroups = tasksResponse.data?.map(group => ({
          ...group,
          tasks: group.tasks.map(task => ({
            ...task,
            completed: task.completed || false
          }))
        })) || getDefaultTaskGroups()

        // 转换打卡记录
        const checkInHistory: CheckInHistory = {}
        checkInsResponse.data?.forEach((checkIn: any) => {
          const dateKey = checkIn.date.split('T')[0]
          if (!checkInHistory[dateKey]) {
            checkInHistory[dateKey] = {}
          }
          checkInHistory[dateKey][checkIn.taskId] = true
        })

        const cloudData: CloudData = {
          taskGroups,
          checkInHistory,
          streak: 0, // TODO: 从API获取
          lastUpdated: new Date().toISOString(),
          lastSynced: new Date().toISOString()
        }

        // 更新缓存
        cloudCache.set(tasksCacheKey, taskGroups, CACHE_DURATION)
        cloudCache.set(checkInsCacheKey, checkInHistory, CACHE_DURATION)

        set({ cloudData })

        console.log('✅ 云端数据加载完成')
      }
    } catch (error) {
      console.error('❌ 云端数据加载失败:', error)
      throw error
    } finally {
      set({ isLoadingTasks: false })
    }
  },

  toggleTaskCloud: async (taskId: string) => {
    const { formatDateKey, currentDate, isAuthenticated } = get()

    if (!isAuthenticated) {
      throw new Error('用户未登录')
    }

    const dateKey = formatDateKey(currentDate)

    try {
      set({ isLoading: true })

      // 调用API切换打卡状态
      const response = await api.checkIns.toggle(taskId, dateKey)

      if (response.success) {
        // 立即更新本地缓存
        const { cloudData } = get()
        const currentDayCheckIns = cloudData.checkInHistory[dateKey] || {}
        const newCheckIns = {
          ...currentDayCheckIns,
          [taskId]: response.data?.action === 'checked'
        }

        const updatedCloudData = {
          ...cloudData,
          checkInHistory: {
            ...cloudData.checkInHistory,
            [dateKey]: newCheckIns
          },
          lastUpdated: new Date().toISOString()
        }

        set({
          cloudData: updatedCloudData,
          currentData: updatedCloudData
        })

        // 延迟刷新完整数据
        setTimeout(() => {
          get().loadCloudData(true)
        }, 300)

        console.log('✅ 云端打卡成功')
      }
    } catch (error) {
      console.error('❌ 云端打卡失败:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  invalidateCloudCache: () => {
    // 清除所有云端相关缓存
    cloudCache.invalidate('tasks*')
    cloudCache.invalidate('checkIns*')
    cloudCache.invalidate('stats*')

    console.log('🗑️ 云端缓存已清除')
  },

  // 统一操作接口
  toggleTask: async (groupId: string, taskId: string) => {
    const { dataSource } = get()
    
    if (dataSource === 'cloud') {
      await get().toggleTaskCloud(taskId)
    } else {
      get().toggleTaskLocal(taskId)
    }
  },

  getCurrentDateTasks: () => {
    const { currentData, formatDateKey, currentDate } = get()
    const dateKey = formatDateKey(currentDate)
    const currentDayCheckIns = currentData.checkInHistory[dateKey] || {}

    return currentData.taskGroups.map(group => ({
      ...group,
      tasks: group.tasks.map(task => ({
        ...task,
        completed: currentDayCheckIns[task.id] || false
      }))
    }))
  },

  getTodayProgress: () => {
    const tasks = get().getCurrentDateTasks()
    const allTasks = tasks.flatMap(group => group.tasks)
    const completed = allTasks.filter(task => task.completed).length
    const total = allTasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  },

  // 数据迁移
  migrateLocalToCloud: async () => {
    const { localData, isAuthenticated } = get()

    if (!isAuthenticated) {
      return { success: false, migratedCount: 0 }
    }

    const checkInHistory = localData.checkInHistory
    if (Object.keys(checkInHistory).length === 0) {
      return { success: false, migratedCount: 0 }
    }

    let migratedCount = 0

    try {
      console.log('🔄 开始迁移本地数据到云端...')

      // 逐一上传本地打卡记录
      for (const [dateKey, dayCheckIns] of Object.entries(checkInHistory)) {
        for (const [taskId, completed] of Object.entries(dayCheckIns)) {
          if (completed) {
            try {
              await api.checkIns.toggle(taskId, dateKey)
              migratedCount++
              console.log(`✅ 迁移成功: ${dateKey} - 任务${taskId}`)
            } catch (error) {
              console.error(`❌ 迁移失败: ${dateKey} - 任务${taskId}`, error)
            }
          }
        }
      }

      // 迁移完成后重新加载云端数据
      await get().loadCloudData(true)

      console.log(`🎉 数据迁移完成，共迁移 ${migratedCount} 条记录`)

      return { success: true, migratedCount }
    } catch (error) {
      console.error('❌ 数据迁移失败:', error)
      return { success: false, migratedCount }
    }
  },

  showMigrationDialog: () => {
    set({ showMigrationModal: true })
  },

  hideMigrationDialog: () => {
    set({ showMigrationModal: false })
  },

  // 风险提示
  showLocalDataRisk: () => {
    set({ showRiskToast: true })
  },

  hideLocalDataRisk: () => {
    set({ showRiskToast: false })
  },

  // 日期操作
  setCurrentDate: (date: Date) => {
    set({ currentDate: date })
  }
}))
