import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // 在API路由中处理用户创建/更新，而不是在Edge Runtime中
      return true
    },
    async jwt({ token, user, account }) {
      // 在JWT中存储用户信息，避免数据库查询
      if (user) {
        token.uid = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      // 从JWT token中获取用户信息
      if (token) {
        session.user.id = token.uid as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt", // 使用JWT策略，避免数据库查询
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  debug: process.env.NODE_ENV === "development",
})
