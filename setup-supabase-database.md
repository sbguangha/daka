# 🚀 Supabase 数据库设置指南

## 📋 快速设置步骤

### 方法一：使用 Supabase Dashboard (推荐)

1. **打开 Supabase SQL Editor**
   - 访问：https://supabase.com/dashboard/project/lrojvydeqzcywgnwpjfl/sql
   - 或在你的项目中点击左侧菜单的 "SQL Editor"

2. **执行表格创建脚本**
   - 复制 `supabase-tables.sql` 文件的全部内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 按钮执行

3. **执行初始数据脚本**
   - 复制 `supabase-seed-data.sql` 文件的全部内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 按钮执行

### 方法二：使用 Prisma (如果你想要数据库密码)

1. **获取数据库密码**
   - 在 Supabase Dashboard -> Settings -> Database
   - 复制 Connection string 中的密码

2. **更新 .env.local**
   ```env
   DATABASE_URL="postgresql://postgres:你的密码@db.lrojvydeqzcywgnwpjfl.supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:你的密码@db.lrojvydeqzcywgnwpjfl.supabase.co:5432/postgres"
   ```

3. **运行 Prisma 命令**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## ✅ 验证设置

执行完成后，你应该能在 Supabase Dashboard 的 Table Editor 中看到以下表格：

### 🔐 认证相关表格
- `users` - 用户信息
- `accounts` - Google OAuth 数据
- `sessions` - 用户会话
- `verificationtokens` - 验证令牌

### 📱 应用业务表格
- `user_settings` - 用户设置
- `task_groups` - 任务分组 (已包含4个默认分组)
- `tasks` - 任务列表 (已包含16个默认任务)
- `check_ins` - 打卡记录
- `streaks` - 连续打卡统计
- `daily_stats` - 每日统计

## 🎯 默认数据

系统已自动创建以下默认任务分组和任务：

### 健康生活 🏃‍♂️
- 运动锻炼
- 喝水
- 早睡
- 冥想

### 学习成长 📚
- 阅读
- 编程练习
- 语言学习
- 技能提升

### 工作效率 💼
- 制定计划
- 专注工作
- 工作总结
- 整理环境

### 生活品质 🌟
- 陪伴家人
- 兴趣爱好
- 亲近自然
- 感恩记录

## 🚀 下一步

1. **启动应用**
   ```bash
   npm run dev
   ```

2. **测试 Google 登录**
   - 访问 http://localhost:3000
   - 点击登录按钮
   - 使用 Google 账户登录

3. **验证数据存储**
   - 登录成功后，检查 Supabase 的 `users` 和 `accounts` 表
   - 应该能看到你的用户数据

## 🐛 故障排除

### 如果表格创建失败
- 检查 SQL 语法是否正确
- 确保有足够的数据库权限
- 查看 Supabase 的错误日志

### 如果应用连接失败
- 检查 `.env.local` 中的配置
- 确保 Supabase URL 和 Keys 正确
- 检查网络连接

## 📊 数据库架构说明

这个架构遵循以下最佳实践：
- ✅ NextAuth.js 标准认证表格
- ✅ OAuth 2.0 安全标准
- ✅ 关系型数据库设计
- ✅ 自动时间戳更新
- ✅ 外键约束保证数据完整性
- ✅ 索引优化查询性能
