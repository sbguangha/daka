import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"

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

    // 返回用户信息
    return NextResponse.json({
      success: true,
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
