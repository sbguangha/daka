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
      {/* 只在用户未登录时显示 Google One Tap */}
      {!isAuthenticated && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <GoogleOneTap
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          onSuccess={(response) => {
            console.log("Google One Tap success:", response)
          }}
          onError={(error) => {
            console.error("Google One Tap error:", error)
          }}
        />
      )}
    </>
  )
}
