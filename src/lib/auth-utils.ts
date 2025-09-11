import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * 服务器端获取当前用户会话
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

/**
 * 服务器端要求用户必须登录
 */
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }
  
  return session.user
}

/**
 * 检查用户是否有特定权限（扩展用）
 */
export async function hasPermission(permission: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // 这里可以根据需要实现权限检查逻辑
  // 例如检查用户角色、权限等
  return true
}

/**
 * API路由认证检查
 * 获取当前用户的数据库ID，如果用户不存在则自动创建
 */
export async function apiRequireAuth() {
  const session = await auth()

  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // 从数据库获取用户ID
  const { executeQuerySingle } = await import("@/lib/database")

  try {
    // 首先尝试获取现有用户
    let user = await executeQuerySingle(`
      SELECT id, name, email, image, "emailVerified", "createdAt", "updatedAt"
      FROM users
      WHERE email = $1
    `, [session.user.email])

    // 如果用户不存在，自动创建
    if (!user) {
      console.log(`用户 ${session.user.email} 不存在，自动创建...`)

      user = await executeQuerySingle(`
        INSERT INTO users (id, name, email, "emailVerified", image, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), $3, NOW(), NOW())
        RETURNING id, name, email, image, "emailVerified", "createdAt", "updatedAt"
      `, [session.user.name, session.user.email, session.user.image])

      console.log(`✅ 用户 ${session.user.email} 创建成功，ID: ${user?.id}`)
    }

    if (user) {
      return {
        id: user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      }
    }
  } catch (error) {
    console.error('获取/创建用户数据库ID失败:', error)
  }

  // 如果所有尝试都失败，抛出错误而不是使用fallback
  throw new Error("Failed to get or create user in database")
}
