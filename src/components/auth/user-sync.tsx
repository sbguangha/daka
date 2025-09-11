"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/app-store"

/**
 * 用户同步组件
 * 在用户登录后自动将用户信息同步到数据库，并迁移本地数据
 */
export function UserSync() {
  const { data: session, status } = useSession()
  const { setUser } = useAppStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    async function syncUserAndData() {
      if (status === "authenticated" && session?.user?.email && !hasInitialized.current) {
        hasInitialized.current = true

        try {
          // 1. 同步用户信息到数据库
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const result = await response.json()
            console.log('✅ 用户信息同步成功:', result.data?.message)

            // 2. 更新应用状态（这会自动触发数据同步）
            setUser(session.user)

            console.log('🎉 用户登录和数据同步完成！')
          } else {
            console.error('❌ 用户信息同步失败:', response.statusText)
          }
        } catch (error) {
          console.error('❌ 用户信息同步错误:', error)
        }
      } else if (status === "unauthenticated") {
        // 用户登出时重置状态
        hasInitialized.current = false
        setUser(null)
      }
    }

    syncUserAndData()
  }, [session, status, setUser])

  // 这个组件不渲染任何UI
  return null
}
