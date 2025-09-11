import { NextRequest, NextResponse } from "next/server"
import { apiRequireAuth } from "@/lib/auth-utils"
import { executeQuery, executeQuerySingle, executeTransaction } from "@/lib/database"

// GET /api/user - 获取当前用户信息（原生SQL实现）
export async function GET() {
  try {
    const user = await apiRequireAuth()

    // 获取用户基本信息
    const userInfo = await executeQuerySingle(`
      SELECT id, name, email, image, "emailVerified", "createdAt"
      FROM users
      WHERE id = $1
    `, [user.id])

    if (!userInfo) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 获取用户设置
    const settings = await executeQuerySingle(`
      SELECT theme, notifications, timezone, "customTaskGroups"
      FROM user_settings
      WHERE "userId" = $1
    `, [user.id])

    // 获取统计信息
    const checkInCount = await executeQuerySingle(`
      SELECT COUNT(*) as count
      FROM check_ins
      WHERE "userId" = $1
    `, [user.id])

    const streakCount = await executeQuerySingle(`
      SELECT COUNT(*) as count
      FROM streaks
      WHERE "userId" = $1
    `, [user.id])

    return NextResponse.json({
      success: true,
      data: {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.image,
        emailVerified: userInfo.emailVerified,
        createdAt: userInfo.createdAt,
        settings: settings || null,
        stats: {
          totalCheckIns: parseInt(checkInCount?.count || '0'),
          totalStreaks: parseInt(streakCount?.count || '0')
        }
      }
    })

  } catch (error) {
    console.error('获取用户信息失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    )
  }
}

// PUT /api/user - 更新用户信息（原生SQL实现）
export async function PUT(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const body = await request.json()

    const { name, settings } = body

    await executeTransaction(async (client) => {
      // 更新用户基本信息
      if (name !== undefined) {
        await client.query(`
          UPDATE users
          SET name = $1, "updatedAt" = NOW()
          WHERE id = $2
        `, [name, user.id])
      }

      // 更新用户设置
      if (settings) {
        // 检查设置是否存在
        const existingSettings = await client.query(`
          SELECT id FROM user_settings WHERE "userId" = $1
        `, [user.id])

        if (existingSettings.rows.length > 0) {
          // 更新现有设置
          await client.query(`
            UPDATE user_settings
            SET
              theme = COALESCE($1, theme),
              notifications = COALESCE($2, notifications),
              timezone = COALESCE($3, timezone),
              "customTaskGroups" = COALESCE($4, "customTaskGroups"),
              "updatedAt" = NOW()
            WHERE "userId" = $5
          `, [
            settings.theme,
            settings.notifications,
            settings.timezone,
            settings.customTaskGroups ? JSON.stringify(settings.customTaskGroups) : null,
            user.id
          ])
        } else {
          // 创建新设置
          await client.query(`
            INSERT INTO user_settings ("userId", theme, notifications, timezone, "customTaskGroups")
            VALUES ($1, $2, $3, $4, $5)
          `, [
            user.id,
            settings.theme || 'system',
            settings.notifications !== undefined ? settings.notifications : true,
            settings.timezone || 'Asia/Shanghai',
            settings.customTaskGroups ? JSON.stringify(settings.customTaskGroups) : null
          ])
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "用户信息更新成功"
    })

  } catch (error) {
    console.error('更新用户信息失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "更新用户信息失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/user - 删除用户账户（原生SQL实现）
export async function DELETE() {
  try {
    const user = await apiRequireAuth()

    await executeTransaction(async (client) => {
      // 删除用户相关数据（按依赖顺序）
      await client.query('DELETE FROM check_ins WHERE "userId" = $1', [user.id])
      await client.query('DELETE FROM streaks WHERE "userId" = $1', [user.id])
      await client.query('DELETE FROM user_settings WHERE "userId" = $1', [user.id])
      await client.query('DELETE FROM sessions WHERE "userId" = $1', [user.id])
      await client.query('DELETE FROM accounts WHERE "userId" = $1', [user.id])

      // 最后删除用户
      await client.query('DELETE FROM users WHERE id = $1', [user.id])
    })

    return NextResponse.json({
      success: true,
      message: "用户账户删除成功"
    })

  } catch (error) {
    console.error('删除用户账户失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "删除用户账户失败" },
      { status: 500 }
    )
  }
}
