import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { signIn } from "@/auth"

const client = new OAuth2Client(process.env.AUTH_GOOGLE_ID)

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json(
        { error: "Missing credential" },
        { status: 400 }
      )
    }

    // 验证 Google One Tap 凭证
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.AUTH_GOOGLE_ID,
    })

    const payload = ticket.getPayload()
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      )
    }

    // 使用验证后的用户信息创建会话
    // 注意：这里需要与 NextAuth 的 Google provider 集成
    // 由于 Google One Tap 和 NextAuth 的集成复杂性，
    // 建议简化为直接重定向到 NextAuth 的 Google 登录
    
    return NextResponse.json({
      success: true,
      redirectUrl: "/api/auth/signin/google",
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        image: payload.picture,
        emailVerified: payload.email_verified,
      },
    })
  } catch (error) {
    console.error("Google One Tap verification error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
