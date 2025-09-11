# Google OAuth 设置指南

本指南将帮助你为每日打卡应用配置Google OAuth登录功能。

## 🚀 功能特性

✅ **标准Google登录** - 传统的Google OAuth登录流程  
✅ **Google One-Tap登录** - 更便捷的一键登录体验  
✅ **NextAuth.js集成** - 安全可靠的认证管理  
✅ **数据库集成** - 用户信息自动存储到PostgreSQL  
✅ **状态管理** - 认证状态与Zustand store同步  

## 📋 前置要求

1. **Google Cloud Console账户**
2. **PostgreSQL数据库** (推荐使用Supabase)
3. **域名或localhost** (用于回调URL)

## 🔧 设置步骤

### 1. 创建Google OAuth应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API** 和 **Google Identity Services**
4. 转到 **APIs & Services > Credentials**
5. 点击 **Create Credentials > OAuth 2.0 Client IDs**
6. 选择 **Web application**
7. 配置授权重定向URI：
   ```
   http://localhost:3000/api/auth/callback/google  (开发环境)
   https://yourdomain.com/api/auth/callback/google  (生产环境)
   ```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local` 并填入以下信息：

```env
# 数据库配置
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-postgresql-direct-connection-string"

# NextAuth.js 配置
AUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
```

### 3. 数据库迁移

运行以下命令创建必要的数据库表：

```bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库schema
npx prisma db push

# (可选) 查看数据库
npx prisma studio
```

### 4. 启动应用

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 🎯 使用方式

### 标准登录
- 点击Header中的"登录"按钮
- 或访问 `/auth/signin` 页面
- 点击"使用Google登录"按钮

### Google One-Tap登录
- 在首页自动显示Google One-Tap提示
- 仅在用户未登录时显示
- 提供更快速的登录体验

## 🔒 安全特性

- **CSRF保护** - 内置PKCE和state验证
- **会话管理** - 安全的数据库会话存储
- **中间件保护** - 自动保护需要认证的路由
- **类型安全** - 完整的TypeScript类型定义

## 📁 文件结构

```
src/
├── auth.ts                          # NextAuth.js配置
├── middleware.ts                    # 认证中间件
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts   # NextAuth API路由
│   │   └── google-one-tap/route.ts  # One-Tap验证端点
│   └── auth/
│       ├── signin/page.tsx          # 登录页面
│       └── error/page.tsx           # 错误页面
├── components/auth/
│   ├── google-signin-button.tsx     # Google登录按钮
│   ├── google-one-tap.tsx           # One-Tap组件
│   ├── user-menu.tsx                # 用户菜单
│   └── auth-wrapper.tsx             # 认证包装器
├── hooks/
│   └── use-auth-sync.ts             # 认证状态同步Hook
└── types/
    └── auth.ts                      # 认证类型定义
```

## 🐛 故障排除

### 常见问题

1. **"Invalid client" 错误**
   - 检查 `AUTH_GOOGLE_ID` 是否正确
   - 确认回调URL配置正确

2. **One-Tap不显示**
   - 检查 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 是否设置
   - 确认用户未登录状态

3. **数据库连接错误**
   - 验证 `DATABASE_URL` 格式
   - 确认数据库服务正在运行

### 调试模式

在 `.env.local` 中添加：
```env
NODE_ENV="development"
```

这将启用详细的认证日志。

## 🚀 部署到生产环境

1. 更新Google OAuth应用的授权重定向URI
2. 设置生产环境的环境变量
3. 确保 `NEXTAUTH_URL` 指向正确的域名
4. 运行数据库迁移

## 📚 相关文档

- [NextAuth.js文档](https://authjs.dev/)
- [Google Identity文档](https://developers.google.com/identity)
- [Prisma文档](https://www.prisma.io/docs)
