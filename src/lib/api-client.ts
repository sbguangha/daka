// API客户端工具函数
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T = ApiResponse>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API请求失败 ${endpoint}:`, error)
      throw error
    }
  }

  // 打卡记录相关API
  async getCheckIns(params?: {
    startDate?: string
    endDate?: string
    taskId?: string
  }): Promise<ApiResponse<CheckInRecord[]>> {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.taskId) searchParams.set('taskId', params.taskId)

    const query = searchParams.toString()
    return this.request(`/checkins${query ? `?${query}` : ''}`)
  }

  async toggleCheckIn(taskId: string, date: string, note?: string): Promise<ApiResponse<{ action: 'checked' | 'unchecked'; data?: CheckInRecord }>> {
    return this.request('/checkins', {
      method: 'POST',
      body: JSON.stringify({ taskId, date, note })
    })
  }

  async deleteCheckIn(params: { id?: string; taskId?: string; date?: string }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams()
    if (params.id) searchParams.set('id', params.id)
    if (params.taskId) searchParams.set('taskId', params.taskId)
    if (params.date) searchParams.set('date', params.date)

    return this.request(`/checkins?${searchParams.toString()}`, {
      method: 'DELETE'
    })
  }

  // 任务相关API
  async getTasks(params?: {
    includeCheckIns?: boolean
    date?: string
  }): Promise<ApiResponse<TaskGroup[]>> {
    const searchParams = new URLSearchParams()
    if (params?.includeCheckIns) searchParams.set('includeCheckIns', 'true')
    if (params?.date) searchParams.set('date', params.date)

    const query = searchParams.toString()
    return this.request(`/tasks${query ? `?${query}` : ''}`)
  }

  // 统计相关API
  async getStats(params?: {
    type?: 'overview' | 'streak' | 'daily' | 'monthly'
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<UserStats>> {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set('type', params.type)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)

    const query = searchParams.toString()
    return this.request(`/stats${query ? `?${query}` : ''}`)
  }

  // 用户相关API
  async getUser(): Promise<ApiResponse<any>> {
    return this.request('/user')
  }

  async updateUser(data: {
    name?: string
    settings?: {
      theme?: string
      notifications?: boolean
      timezone?: string
      customTaskGroups?: any
    }
  }): Promise<ApiResponse> {
    return this.request('/user', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteUser(): Promise<ApiResponse> {
    return this.request('/user', {
      method: 'DELETE'
    })
  }

  // 数据迁移相关API已移除（改用原生SQL实现）
}

// 创建默认实例
export const apiClient = new ApiClient()

// 便捷的API函数
export const api = {
  // 打卡相关
  checkIns: {
    get: (params?: Parameters<ApiClient['getCheckIns']>[0]) => 
      apiClient.getCheckIns(params),
    toggle: (taskId: string, date: string, note?: string) => 
      apiClient.toggleCheckIn(taskId, date, note),
    delete: (params: Parameters<ApiClient['deleteCheckIn']>[0]) => 
      apiClient.deleteCheckIn(params)
  },

  // 任务相关
  tasks: {
    get: (params?: Parameters<ApiClient['getTasks']>[0]) => 
      apiClient.getTasks(params)
  },

  // 统计相关
  stats: {
    get: (params?: Parameters<ApiClient['getStats']>[0]) => 
      apiClient.getStats(params)
  },

  // 用户相关
  user: {
    get: () => apiClient.getUser(),
    update: (data: Parameters<ApiClient['updateUser']>[0]) => 
      apiClient.updateUser(data),
    delete: () => apiClient.deleteUser()
  },

  // 迁移相关API已移除
}

// 类型定义
export interface CheckInRecord {
  id: string
  date: string
  userId: string
  taskId: string
  checkedAt: string
  note?: string
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
  description?: string
  theme: string
  order: number
  isDefault: boolean
  isActive: boolean
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  description?: string
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

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
