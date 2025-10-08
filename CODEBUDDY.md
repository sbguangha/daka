<system-reminder>
This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message.

</system-reminder>

# 每日打卡应用 - CodeBuddy 指南（精简版）

本指南面向 Terminal Assistant Agent，聚焦常用命令与「大架构」要点，帮助快速在本仓库开展开发与排障。

## 常用命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 生产构建与运行
npm run build
npm run start

# 代码质量
npm run lint
npm run type-check

# 数据库（Prisma）
npx prisma generate
npx prisma db push
npx prisma studio

# 数据库连接与原生 SQL API 试跑（存在该脚本时）
node test-sql-apis.js
```

说明：当前项目未配置通用的单元测试脚本；如需验证数据库与业务 API，请优先使用原生 SQL API 脚本和接口联调。

## 大架构速览

- 认证层：NextAuth.js + Google OAuth 2.0，采用 JWT 会话策略，用户信息直接存于 token，避免频繁数据库查询
  - 关键文件：`src/auth.ts`、`src/app/api/auth/*`
- 业务数据层：原生 SQL + pg 连接池，统一封装高性能数据读写
  - 关键文件：`src/lib/database.ts`（连接池与通用执行接口）、`src/lib/business-data.ts`（check-ins、tasks、stats 等业务操作）、`src/lib/sql-queries.ts`
- 前端层：Next.js 14 App Router + TypeScript + Tailwind + Radix UI；状态用 Zustand
  - 关键目录：`src/app/*`（页面与 API 路由）、`src/components/*`（UI 组合）、`src/store/*`（状态）

核心设计：
- 所有业务 API 必须进行会话校验，并基于 `userId` 做数据隔离
- SQL 一律参数化，事务通过 `executeTransaction` 管理，连接池自动释放与错误处理
- 统计数据（连续打卡、完成率等）由 `statsData` 汇总，避免在前端做复杂聚合

## 环境与运行

必备环境变量（本地 `.env.local` 与线上环境一致）：
- NEXTAUTH_URL, NEXTAUTH_SECRET
- AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
- DATABASE_URL, DIRECT_URL

本地开发流程：
1. 配置 `.env.local`
2. 生成 Prisma 客户端并推送模型：`npx prisma generate && npx prisma db push`
3. 启动开发：`npm run dev`

## 数据模型与约束

- 表：`users`、`task_groups`、`tasks`、`check_ins`、`streaks`
- 重要约束：同一用户同一天同一任务仅可打卡一次；任务按 `order` 排序；支持软删除 `isActive`

## 开发约定（本项目特有）

- 认证保护：所有 API 路由需有效 JWT，会话在中间件层与路由层双重校验
- 数据安全：仅返回必要字段；服务端记录详细错误日志
- 优先使用 `business-data.ts` 封装方法；复杂查询集中在 `sql-queries.ts`

## 关键文件定位

- 数据库连接与执行：`src/lib/database.ts`
- 业务数据封装：`src/lib/business-data.ts`
- SQL 语句集合：`src/lib/sql-queries.ts`
- 认证工具：`src/lib/auth-utils.ts`
- 前端 API 客户端：`src/lib/api-client.ts`
- App Router 与 API：`src/app/*`
- UI 组件与布局：`src/components/*`
- 状态管理：`src/store/*`
