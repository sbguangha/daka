import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 需要认证的API路径
const protectedApiPaths = [
  "/api/checkins",
  "/api/stats",
  "/api/tasks",
  "/api/user",
]

// 认证相关的路径
const authPaths = [
  "/auth/signin",
  "/auth/error",
]

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 对于受保护的API路径，我们在API路由内部进行认证检查
  // 这里只做基本的路由处理

  // 如果是受保护的API路径，添加一个标记头
  const isProtectedApi = protectedApiPaths.some(path =>
    pathname.startsWith(path)
  )

  if (isProtectedApi) {
    // 在请求头中添加标记，API路由会检查认证
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-requires-auth', 'true')

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
