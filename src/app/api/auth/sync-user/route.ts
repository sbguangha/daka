import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { executeQuery, executeQuerySingle, executeTransaction } from "@/lib/database"

// POST /api/auth/sync-user - 同步用户信息到数据库
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    const { email, name, image } = session.user

    if (!email) {
      return NextResponse.json(
        { error: "用户邮箱不能为空" },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await executeQuerySingle(`
      SELECT id, name, email, image, "emailVerified", "createdAt", "updatedAt"
      FROM users 
      WHERE email = $1
    `, [email])

    let userId: string

    if (existingUser) {
      // 更新现有用户信息
      const updatedUser = await executeQuerySingle(`
        UPDATE users 
        SET name = $1, image = $2, "updatedAt" = NOW()
        WHERE email = $3
        RETURNING id, name, email, image, "emailVerified", "createdAt", "updatedAt"
      `, [name, image, email])
      
      userId = updatedUser!.id
    } else {
      // 创建新用户
      const newUser = await executeQuerySingle(`
        INSERT INTO users (id, name, email, "emailVerified", image, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), $3, NOW(), NOW())
        RETURNING id, name, email, image, "emailVerified", "createdAt", "updatedAt"
      `, [name, email, image])
      
      userId = newUser!.id
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        message: existingUser ? "用户信息已更新" : "用户已创建"
      }
    })

  } catch (error) {
    console.error('同步用户信息失败:', error)
    
    return NextResponse.json(
      { error: "同步用户信息失败" },
      { status: 500 }
    )
  }
}

// GET /api/auth/sync-user - 获取当前用户的数据库信息
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    // 从数据库获取用户信息
    const user = await executeQuerySingle(`
      SELECT id, name, email, image, "emailVerified", "createdAt", "updatedAt"
      FROM users 
      WHERE email = $1
    `, [session.user.email])

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在，请先同步用户信息" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('获取用户信息失败:', error)
    
    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    )
  }
}
