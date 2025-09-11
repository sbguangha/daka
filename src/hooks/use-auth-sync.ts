"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/app-store"

/**
 * 同步NextAuth会话状态到Zustand store
 */
export function useAuthSync() {
  const { data: session, status } = useSession()
  const { setUser, clearUser } = useAppStore()

  useEffect(() => {
    if (status === "loading") {
      return // 等待会话加载完成
    }

    if (session?.user) {
      // 用户已登录，更新store
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      })
    } else {
      // 用户未登录，清除store
      clearUser()
    }
  }, [session, status, setUser, clearUser])

  return {
    user: session?.user || null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
  }
}
