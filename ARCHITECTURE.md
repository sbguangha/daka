# 🏗️ 系统架构文档

## 📋 架构概述

本项目采用混合数据访问架构，结合了Prisma和原生SQL的优势：

- **认证层**：NextAuth.js + Prisma（稳定可靠的OAuth实现）
- **业务层**：原生SQL + PostgreSQL（高性能数据操作）
- **前端**：Next.js 14 + TypeScript + Tailwind CSS

## 🎯 设计原则

### 1. 分层架构
```
┌─────────────────────────────────────┐
│           前端层 (Next.js)           │
├─────────────────────────────────────┤
│           API路由层                  │
├─────────────────────────────────────┤
│     认证层        │     业务层       │
│  (NextAuth.js)    │  (原生SQL)      │
│   + Prisma        │                 │
├─────────────────────────────────────┤
│        数据库层 (PostgreSQL)         │
└─────────────────────────────────────┘
```

### 2. 职责分离
- **认证系统**：专注于用户身份验证和会话管理
- **业务系统**：专注于核心功能和数据操作
- **数据访问**：统一的查询接口和事务管理

### 3. 性能优化
- **连接池**：复用数据库连接，减少开销
- **原生SQL**：避免ORM层开销，直接操作数据库
- **事务管理**：确保数据一致性

## 📁 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth.js认证路由
│   │   ├── checkins/       # 打卡记录API（原生SQL）
│   │   ├── stats/          # 统计查询API（原生SQL）
│   │   ├── tasks/          # 任务查询API（原生SQL）
│   │   └── user/           # 用户信息API（原生SQL）
│   └── ...
├── lib/
│   ├── auth-utils.ts       # 认证工具函数
│   ├── database.ts         # 数据库连接池和查询工具
│   ├── sql-queries.ts      # SQL查询语句集合
│   ├── business-data.ts    # 业务数据访问层
│   ├── prisma.ts          # Prisma客户端（仅认证使用）
│   └── api-client.ts      # 前端API客户端
└── ...
```

## 🔧 核心组件

### 1. 数据库连接池 (`src/lib/database.ts`)

```typescript
// 连接池配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // 最大连接数
  idleTimeoutMillis: 30000,   // 空闲超时
  connectionTimeoutMillis: 2000 // 连接超时
})

// 查询工具
export async function executeQuery<T>(query: string, params: any[]): Promise<T[]>
export async function executeQuerySingle<T>(query: string, params: any[]): Promise<T | null>
export async function executeTransaction<T>(callback: Function): Promise<T>
```

### 2. 业务数据访问层 (`src/lib/business-data.ts`)

```typescript
// 统一的数据访问接口
export const checkInData = {
  findByUser: (userId: string, startDate?: Date, endDate?: Date) => Promise<CheckIn[]>,
  toggle: (userId: string, taskId: string, date: Date) => Promise<ToggleResult>,
  deleteByUserTaskDate: (userId: string, taskId: string, date: Date) => Promise<boolean>
}

export const statsData = {
  getOverview: (userId: string, startDate: Date, endDate: Date) => Promise<OverviewStats>,
  getStreak: (userId: string) => Promise<StreakStats>,
  getDaily: (userId: string, startDate: Date, endDate: Date) => Promise<DailyStats[]>
}
```

### 3. 认证系统 (`src/auth.ts`)

```typescript
// NextAuth.js + Prisma配置
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),  // 使用Prisma适配器
  providers: [Google({...})],      // Google OAuth
  session: { strategy: "database" } // 数据库会话
})
```

## 🔄 数据流

### 1. 用户认证流程
```
用户登录 → Google OAuth → NextAuth.js → Prisma → 数据库
                                    ↓
                              创建/更新用户会话
```

### 2. 业务操作流程
```
前端请求 → API路由 → 认证检查 → 业务数据层 → 原生SQL → 数据库
                      ↓
                  返回结果 ← 数据处理 ← 查询结果
```

## 🛡️ 安全机制

### 1. 认证保护
- 所有业务API都需要有效的用户会话
- 使用NextAuth.js的标准会话验证
- 中间件层面的路由保护

### 2. 数据安全
- SQL参数化查询，防止注入攻击
- 用户数据隔离，基于userId过滤
- 事务保证数据一致性

### 3. 错误处理
- 统一的错误响应格式
- 敏感信息不暴露给前端
- 详细的服务器端日志记录

## 📊 性能特性

### 1. 数据库优化
- **连接池**：复用连接，减少建立连接开销
- **原生SQL**：避免ORM查询开销
- **索引优化**：关键字段建立索引

### 2. 查询优化
- **批量操作**：减少数据库往返次数
- **事务管理**：确保数据一致性
- **查询缓存**：复用查询结果

### 3. 监控指标
- API响应时间
- 数据库连接池状态
- 错误率统计

## 🔧 开发工具

### 1. 数据库管理
```bash
# 查看数据库（Prisma Studio）
npx prisma studio

# 测试SQL API
node test-sql-apis.js

# 数据库连接测试
npm run test:db
```

### 2. 开发调试
```bash
# 开发服务器
npm run dev

# 类型检查
npm run type-check

# 构建检查
npm run build
```

## 🚀 部署架构

### 1. 生产环境
```
Vercel (前端) → Supabase (数据库)
     ↓
  环境变量配置
  - DATABASE_URL
  - AUTH_GOOGLE_ID
  - AUTH_GOOGLE_SECRET
```

### 2. 扩展性
- **水平扩展**：多个Vercel实例
- **数据库扩展**：Supabase自动扩展
- **缓存层**：可添加Redis缓存

## 📈 未来规划

### 1. 性能优化
- [ ] 添加查询缓存层
- [ ] 实现读写分离
- [ ] 优化复杂查询

### 2. 功能扩展
- [ ] 添加更多统计维度
- [ ] 实现数据导出功能
- [ ] 支持自定义任务

### 3. 监控完善
- [ ] 添加性能监控
- [ ] 实现错误追踪
- [ ] 用户行为分析

## 🤝 贡献指南

### 1. 添加新API
1. 在`src/lib/sql-queries.ts`中添加SQL查询
2. 在`src/lib/business-data.ts`中添加数据访问方法
3. 创建API路由文件
4. 更新`src/lib/api-client.ts`

### 2. 数据库变更
1. 更新`prisma/schema.prisma`
2. 运行`npx prisma db push`
3. 更新相关SQL查询
4. 测试数据兼容性

### 3. 测试要求
- 所有新API必须有对应测试
- 确保数据库事务正确处理
- 验证错误处理逻辑
