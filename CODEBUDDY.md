# 每日打卡应用 - CodeBuddy 开发指南

这是一个基于 Next.js 14 + Supabase 的现代化每日打卡应用，支持 Google OAuth 认证和跨设备数据同步。

## 🚀 快速开始

### 开发环境启动
```bash
# Windows 用户
start-local-dev.bat

# Linux/Mac 用户
chmod +x start-local-dev.sh && ./start-local-dev.sh

# 手动启动
npm install
npm run dev
```

### 核心开发命令
```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 数据库管理
npx prisma studio
npx prisma generate
npx prisma db push

# 测试 SQL API
node test-sql-apis.js
```

## 🏗️ 架构概述

### 混合数据访问架构
项目采用分层架构，结合 Prisma 和原生 SQL 的优势：

- **认证层**: NextAuth.js + JWT (避免数据库查询)
- **业务层**: 原生 SQL + PostgreSQL 连接池 (高性能)
- **前端**: Next.js 14 App Router + TypeScript + Tailwind CSS

### 核心组件

#### 数据库层 (`src/lib/database.ts`)
- PostgreSQL 连接池管理 (最大20个连接)
- 统一的查询接口: `executeQuery`, `executeQuerySingle`, `executeTransaction`
- 自动连接释放和错误处理

#### 业务数据层 (`src/lib/business-data.ts`)
- `checkInData`: 打卡记录的 CRUD 操作
- `taskData`: 任务和任务组管理
- `statsData`: 统计数据计算 (连续打卡、完成率等)
- 所有操作都使用原生 SQL，确保高性能

#### 认证系统 (`src/auth.ts`)
- Google OAuth 2.0 集成
- JWT 会话策略 (30天有效期)
- 用户信息存储在 token 中，避免频繁数据库查询

## 📁 关键目录结构

```
src/
├── app/
│   ├── api/                    # API 路由
│   │   ├── auth/              # NextAuth.js 认证
│   │   ├── checkins/          # 打卡记录 API
│   │   ├── stats/             # 统计数据 API
│   │   └── tasks/             # 任务管理 API
│   ├── layout.tsx             # 根布局 (AuthProvider + ThemeProvider)
│   └── page.tsx               # 主页面
├── components/
│   ├── ui/                    # 基础 UI 组件 (Radix UI)
│   ├── layout/                # 布局组件
│   ├── timesheet/             # 打卡相关组件
│   └── modals/                # 模态框组件
├── lib/
│   ├── database.ts            # 数据库连接池
│   ├── business-data.ts       # 业务数据访问层
│   ├── sql-queries.ts         # SQL 查询语句集合
│   ├── auth-utils.ts          # 认证工具函数
│   └── api-client.ts          # 前端 API 客户端
└── store/                     # Zustand 状态管理
```

## 🔧 开发规范

### API 开发
1. 认证检查: 所有业务 API 都需要验证用户会话
2. 数据隔离: 基于 `userId` 过滤所有查询
3. 错误处理: 使用统一的错误响应格式
4. 参数化查询: 防止 SQL 注入攻击

### 数据库操作
- 优先使用 `business-data.ts` 中的封装方法
- 复杂查询写在 `sql-queries.ts` 中
- 事务操作使用 `executeTransaction`
- 连接自动管理，无需手动释放

### 前端开发
- 使用 TypeScript 确保类型安全
- 组件使用 Tailwind CSS + Radix UI
- 状态管理使用 Zustand
- 支持深色模式和响应式设计

## 🛡️ 安全机制

### 认证保护
- 所有 API 路由都需要有效的 JWT token
- 用户数据完全隔离，基于 userId 过滤
- 中间件层面的路由保护

### 数据安全
- SQL 参数化查询防注入
- 敏感信息不暴露给前端
- 详细的服务器端日志记录

## 📊 数据模型

### 核心表结构
- `users`: 用户信息 (NextAuth.js 管理)
- `task_groups`: 任务分组 (身体锻炼、学习成长等)
- `tasks`: 具体任务 (跑步、阅读等)
- `check_ins`: 打卡记录 (用户+任务+日期唯一)
- `streaks`: 连续打卡统计

### 重要约束
- 同一用户同一天同一任务只能打卡一次
- 任务按 order 字段排序
- 支持软删除 (isActive 字段)

## 🚀 部署配置

### 环境变量
```bash
# NextAuth.js
NEXTAUTH_URL=your-app-url
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Supabase
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
```

### 生产部署
- 前端: Vercel 自动部署
- 数据库: Supabase PostgreSQL
- 认证: Google OAuth 2.0

## 🔍 调试工具

### 数据库调试
```bash
# 查看数据库内容
npx prisma studio

# 测试 SQL API 连接
node test-sql-apis.js

# 检查数据库连接
npm run test:db
```

### 开发调试
- 开发模式下启用 NextAuth.js debug
- 浏览器控制台查看前端错误
- 服务器日志查看 API 错误

## 📈 性能优化

### 数据库优化
- 连接池复用 (最大20个连接)
- 原生 SQL 避免 ORM 开销
- 关键字段建立索引
- 批量操作减少往返次数

### 前端优化
- Next.js 14 App Router
- 组件懒加载
- 图片优化
- 静态资源缓存

## 🧪 测试策略

### API 测试
- 使用 `test-sql-apis.js` 测试数据库连接
- 确保所有 API 都有认证保护
- 验证数据隔离和权限控制

### 前端测试
- 组件单元测试
- 用户交互测试
- 跨浏览器兼容性测试

## 📝 常见任务

### 添加新任务类型
1. 在 Supabase 中添加任务组和任务
2. 更新 `sql-queries.ts` 如需要
3. 前端组件会自动显示新任务

### 修改统计逻辑
1. 更新 `statsData` 中的相关方法
2. 修改对应的 SQL 查询
3. 更新前端统计组件

### 扩展认证方式
1. 在 `src/auth.ts` 中添加新的 provider
2. 配置相应的环境变量
3. 更新认证页面 UI

## 🤝 贡献指南

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 组件使用 PascalCase
- 文件使用 kebab-case

### 提交规范
- 功能: `feat: 添加新功能`
- 修复: `fix: 修复bug`
- 文档: `docs: 更新文档`
- 样式: `style: 样式调整`