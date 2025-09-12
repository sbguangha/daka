"use client"

import { GoogleOneTap } from "./google-one-tap"
import { useAuthSync } from "@/hooks/use-auth-sync"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = useAuthSync()

  return (
    <>
      {children}
      {/* Google One Tap 暂时禁用，避免与 NextAuth 冲突 */}
      {/* TODO: 重新实现 Google One Tap 与 NextAuth 的集成 */}
    </>
  )
}
