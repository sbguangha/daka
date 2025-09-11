"use client"

// 云端数据缓存管理器
export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
  key: string
}

export interface CacheConfig {
  defaultTTL: number // 默认缓存时间（毫秒）
  maxSize: number    // 最大缓存条目数
  storageKey: string // localStorage 存储键
}

export class CloudCacheManager {
  private config: CacheConfig
  private memoryCache = new Map<string, CacheEntry<any>>()

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5分钟
      maxSize: 50,
      storageKey: 'cloud-cache',
      ...config
    }

    // 启动时从 localStorage 恢复缓存
    this.loadFromStorage()
  }

  // 设置缓存
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.config.defaultTTL)
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt,
      key
    }

    // 内存缓存
    this.memoryCache.set(key, entry)

    // 清理过期缓存
    this.cleanup()

    // 持久化到 localStorage
    this.saveToStorage()
  }

  // 获取缓存
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key)
    
    if (!entry) {
      return null
    }

    // 检查是否过期
    if (Date.now() > entry.expiresAt) {
      this.delete(key)
      return null
    }

    return entry.data as T
  }

  // 检查缓存是否存在且有效
  has(key: string): boolean {
    const entry = this.memoryCache.get(key)
    
    if (!entry) {
      return false
    }

    // 检查是否过期
    if (Date.now() > entry.expiresAt) {
      this.delete(key)
      return false
    }

    return true
  }

  // 删除缓存
  delete(key: string): void {
    this.memoryCache.delete(key)
    this.saveToStorage()
  }

  // 清空所有缓存
  clear(): void {
    this.memoryCache.clear()
    this.clearStorage()
  }

  // 使缓存失效
  invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.clear()
      return
    }

    // 支持通配符模式
    const regex = new RegExp(keyPattern.replace(/\*/g, '.*'))
    
    this.memoryCache.forEach((_, key) => {
      if (regex.test(key)) {
        this.delete(key)
      }
    })
  }

  // 获取缓存统计信息
  getStats() {
    const now = Date.now()
    let validCount = 0
    let expiredCount = 0
    let totalSize = 0

    this.memoryCache.forEach((entry, key) => {
      totalSize += JSON.stringify(entry.data).length
      
      if (now > entry.expiresAt) {
        expiredCount++
      } else {
        validCount++
      }
    })

    return {
      totalEntries: this.memoryCache.size,
      validEntries: validCount,
      expiredEntries: expiredCount,
      totalSize,
      maxSize: this.config.maxSize,
      hitRate: this.getHitRate()
    }
  }

  // 预热缓存
  async warmup<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // 先尝试从缓存获取
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // 缓存未命中，获取新数据
    try {
      const data = await fetcher()
      this.set(key, data, ttl)
      return data
    } catch (error) {
      console.error(`缓存预热失败 [${key}]:`, error)
      throw error
    }
  }

  // 批量设置缓存
  setMultiple<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl)
    })
  }

  // 批量获取缓存
  getMultiple<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {}
    
    keys.forEach(key => {
      result[key] = this.get<T>(key)
    })

    return result
  }

  // 清理过期缓存
  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    // 找出过期的条目
    this.memoryCache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        toDelete.push(key)
      }
    })

    // 删除过期条目
    toDelete.forEach(key => {
      this.memoryCache.delete(key)
    })

    // 如果缓存条目过多，删除最旧的
    if (this.memoryCache.size > this.config.maxSize) {
      const entries = Array.from(this.memoryCache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, this.memoryCache.size - this.config.maxSize)
      toRemove.forEach(([key]) => {
        this.memoryCache.delete(key)
      })
    }
  }

  // 保存到 localStorage
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const cacheData = Array.from(this.memoryCache.entries())
      localStorage.setItem(this.config.storageKey, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('保存缓存到 localStorage 失败:', error)
    }
  }

  // 从 localStorage 加载
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.config.storageKey)
      if (stored) {
        const cacheData: Array<[string, CacheEntry<any>]> = JSON.parse(stored)
        
        // 恢复到内存缓存，同时检查过期
        const now = Date.now()
        cacheData.forEach(([key, entry]) => {
          if (now <= entry.expiresAt) {
            this.memoryCache.set(key, entry)
          }
        })
      }
    } catch (error) {
      console.warn('从 localStorage 加载缓存失败:', error)
    }
  }

  // 清空 localStorage
  private clearStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(this.config.storageKey)
    } catch (error) {
      console.warn('清空 localStorage 缓存失败:', error)
    }
  }

  // 计算命中率（简化版）
  private getHitRate(): number {
    // 这里可以实现更复杂的命中率统计
    return 0
  }
}

// 创建默认的云端缓存实例
export const cloudCache = new CloudCacheManager({
  defaultTTL: 5 * 60 * 1000, // 5分钟
  maxSize: 100,
  storageKey: 'daka-cloud-cache'
})

// 缓存键生成器
export const CacheKeys = {
  tasks: (date?: string) => `tasks${date ? `:${date}` : ''}`,
  checkIns: (startDate?: string, endDate?: string) => 
    `checkIns:${startDate || 'all'}:${endDate || 'all'}`,
  userProfile: () => 'user:profile',
  stats: (period: string) => `stats:${period}`,
  taskGroups: () => 'task-groups'
} as const
