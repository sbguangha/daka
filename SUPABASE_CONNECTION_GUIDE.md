# 🔗 Supabase 数据库连接指南

## 📋 当前状态
- ✅ Google OAuth 已配置完成
- ✅ Prisma Schema 已更新为 PostgreSQL
- ⏳ 需要配置 Supabase 数据库连接字符串

## 🔑 获取 Supabase 数据库密码

### 步骤 1: 登录 Supabase Dashboard
1. 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 选择你的项目: `lrojvydeqzcywgnwpjfl`

### 步骤 2: 获取数据库密码
1. 点击左侧菜单 **Settings** (设置)
2. 点击 **Database** 
3. 在 **Connection string** 部分找到:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.lrojvydeqzcywgnwpjfl.supabase.co:5432/postgres
   ```
4. 复制完整的连接字符串

### 步骤 3: 更新环境变量
在 `.env.local` 文件中，将 `[YOUR-PASSWORD]` 替换为实际密码:

```env
# 将这行中的 [YOUR-PASSWORD] 替换为实际密码
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.lrojvydeqzcywgnwpjfl.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.lrojvydeqzcywgnwpjfl.supabase.co:5432/postgres"
```

## 🚀 部署数据库 Schema

配置好连接字符串后，运行以下命令:

```bash
# 1. 生成 Prisma 客户端
npx prisma generate

# 2. 推送数据库 schema 到 Supabase
npx prisma db push

# 3. (可选) 查看数据库
npx prisma studio
```

## 🔍 验证连接

运行以下命令验证连接是否成功:

```bash
# 启动开发服务器
npm run dev
```

如果一切正常，你应该能看到:
- ✅ 应用正常启动
- ✅ Google 登录功能正常
- ✅ 用户数据保存到 Supabase

## 🐛 常见问题

### 1. 连接被拒绝
- 检查密码是否正确
- 确保网络连接正常

### 2. SSL 错误
如果遇到 SSL 相关错误，可以在连接字符串末尾添加:
```
?sslmode=require
```

### 3. 权限错误
确保使用的是 `postgres` 用户的密码，不是 service role key

## 📊 数据库表格说明

你看到的表格都是必要的:

### 🔐 认证表格 (NextAuth.js 标准)
- **users** - 用户基本信息
- **accounts** - OAuth 账户关联 (Google 登录信息)
- **sessions** - 用户会话管理
- **verificationtokens** - 验证令牌

### 📱 应用业务表格
- **user_settings** - 用户个性化设置
- **task_groups** - 任务分组
- **tasks** - 具体任务
- **check_ins** - 打卡记录
- **streaks** - 连续打卡统计
- **daily_stats** - 每日统计

这是业界标准的设计模式，确保了:
- 🔒 安全性 (OAuth 标准)
- 🔄 扩展性 (支持多种登录方式)
- 📊 数据完整性 (关系型设计)

## 🎯 下一步

1. 获取 Supabase 数据库密码
2. 更新 `.env.local` 文件
3. 运行 `npx prisma db push`
4. 测试 Google 登录功能
