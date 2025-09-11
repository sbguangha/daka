"use client"

import { useEffect, useCallback } from "react"
import { signIn, useSession } from "next-auth/react"

interface GoogleOneTapProps {
  clientId: string
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
  disabled?: boolean
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          disableAutoSelect: () => void
          cancel: () => void
        }
      }
    }
    googleOneTapInitialized?: boolean
  }
}

export function GoogleOneTap({
  clientId,
  onSuccess,
  onError,
  disabled = false
}: GoogleOneTapProps) {
  const { data: session, status } = useSession()

  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      // 发送凭证到我们的API端点进行验证
      const res = await fetch("/api/auth/google-one-tap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      })

      if (res.ok) {
        // 验证成功后，使用NextAuth signIn
        await signIn("google", {
          callbackUrl: "/",
          redirect: true,
        })

        // 如果到达这里说明登录成功（redirect: true 时不会返回）
        onSuccess?.(response)
      } else {
        throw new Error("One Tap verification failed")
      }
    } catch (error) {
      console.error("Google One Tap sign in error:", error)
      onError?.(error)
    }
  }, [onSuccess, onError])

  useEffect(() => {
    // 如果用户已登录或组件被禁用，不显示 One Tap
    if (status === "authenticated" || disabled) {
      return
    }

    // 防止多个实例同时运行
    if (window.googleOneTapInitialized) {
      return
    }

    // 标记为已初始化
    window.googleOneTapInitialized = true

    // 检查脚本是否已经存在
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')

    if (existingScript) {
      // 脚本已存在，直接初始化
      if (window.google?.accounts?.id) {
        initializeGoogleOneTap()
      } else {
        // 等待脚本加载完成
        existingScript.addEventListener('load', initializeGoogleOneTap)
      }
    } else {
      // 加载新脚本
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initializeGoogleOneTap
      document.head.appendChild(script)
    }

    function initializeGoogleOneTap() {
      if (window.google?.accounts?.id) {
        // 取消之前的提示
        try {
          window.google.accounts.id.cancel()
        } catch (e) {
          // 忽略取消错误
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: "signin",
        })

        // 显示 One Tap 提示
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Google One Tap was not displayed or was skipped")
          }
        })
      }
    }

    return () => {
      // 清理标记
      window.googleOneTapInitialized = false

      // 取消和禁用
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel()
          window.google.accounts.id.disableAutoSelect()
        } catch (e) {
          // 忽略清理错误
        }
      }
    }
  }, [clientId, status, disabled, handleCredentialResponse])

  // 这个组件不渲染任何可见内容，One Tap 是由 Google 脚本自动显示的
  return null
}
