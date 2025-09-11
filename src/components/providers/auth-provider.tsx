"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { UserSync } from "@/components/auth/user-sync"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <UserSync />
      {children}
    </SessionProvider>
  )
}
