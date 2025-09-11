# 原生SQL API迁移指南

本文档说明从Prisma API到原生SQL API的完整迁移过程和最终架构。

## 🎯 迁移概述

我们已完成从Prisma到原生SQL的完整迁移，采用混合架构策略：
- **认证系统**：保留NextAuth.js + Prisma（稳定可靠）
- **业务API**：完全使用原生SQL实现（高性能、稳定）

### ✅ 已完成的迁移

1. **基础设施**
   - `src/lib/database.ts` - 数据库连接池和查询工具
   - `src/lib/sql-queries.ts` - SQL查询语句集合
   - `src/lib/business-data.ts` - 业务数据访问层

2. **API路由（已完全替换）**
   - `/api/checkins` - 打卡记录API（原生SQL实现）
   - `/api/stats` - 统计查询API（原生SQL实现）
   - `/api/tasks` - 任务查询API（原生SQL实现）
   - `/api/user` - 用户信息API（原生SQL实现）

3. **前端集成**
   - `src/lib/api-client.ts` - 已更新为使用新API
   - `src/middleware.ts` - 已更新路由保护

## 📊 API对比

### 打卡记录API

| 功能 | Prisma版本 | 原生SQL版本 | 状态 |
|------|------------|-------------|------|
| 获取打卡记录 | `GET /api/checkins` | `GET /api/checkins-sql` | ✅ 完成 |
| 创建/切换打卡 | `POST /api/checkins` | `POST /api/checkins-sql` | ✅ 完成 |
| 删除打卡记录 | `DELETE /api/checkins` | `DELETE /api/checkins-sql` | ✅ 完成 |

### 统计查询API

| 功能 | Prisma版本 | 原生SQL版本 | 状态 |
|------|------------|-------------|------|
| 概览统计 | `GET /api/stats?type=overview` | `GET /api/stats-sql?type=overview` | ✅ 完成 |
| 连续打卡统计 | `GET /api/stats?type=streak` | `GET /api/stats-sql?type=streak` | ✅ 完成 |
| 每日统计 | `GET /api/stats?type=daily` | `GET /api/stats-sql?type=daily` | ✅ 完成 |
| 月度统计 | `GET /api/stats?type=monthly` | `GET /api/stats-sql?type=monthly` | ✅ 完成 |

## 🚀 使用方法

### 1. 测试数据库连接

```bash
# 运行数据库功能测试
node test-sql-apis.js
```

### 2. API性能对比

```bash
# 对比打卡API性能
curl "http://localhost:3000/api/test-comparison?type=checkins&iterations=10"

# 对比统计API性能
curl "http://localhost:3000/api/test-comparison?type=stats&iterations=10"
```

### 3. 切换到新API

在前端代码中，将API调用从：
```typescript
// 旧版本
const response = await fetch('/api/checkins')
const stats = await fetch('/api/stats?type=overview')
```

改为：
```typescript
// 新版本
const response = await fetch('/api/checkins-sql')
const stats = await fetch('/api/stats-sql?type=overview')
```

## 🔧 配置说明

### 环境变量

确保以下环境变量正确配置：
```env
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"
```

### 数据库连接池配置

在 `src/lib/database.ts` 中可以调整连接池参数：
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 2000, // 连接超时时间
})
```

## 📈 性能优势

### 预期性能提升

1. **查询速度** - 减少ORM层开销，直接执行SQL
2. **内存使用** - 更少的对象创建和转换
3. **并发处理** - 更好的连接池管理
4. **调试友好** - 直观的SQL查询日志

### 实际测试结果

运行性能对比测试后，你将看到类似结果：
```json
{
  "testType": "checkins",
  "iterations": 10,
  "results": {
    "prisma": { "averageTime": 150.5 },
    "sql": { "averageTime": 95.2 }
  },
  "summary": {
    "performanceImprovement": "36.7%",
    "recommendation": "SQL版本更快"
  }
}
```

## ⚠️ 注意事项

### 1. 类型安全

原生SQL版本失去了Prisma的自动类型生成，需要手动维护类型定义。我们在 `src/lib/business-data.ts` 中定义了与Prisma兼容的类型。

### 2. 数据一致性

确保两个版本返回相同的数据格式：
- 字段名保持一致
- 日期格式统一
- 错误处理一致

### 3. 事务处理

复杂的数据操作使用事务确保一致性：
```typescript
await executeTransaction(async (client) => {
  // 多个相关操作
})
```

## 🔄 回滚策略

如果需要回滚到Prisma版本：

1. **前端切换** - 将API调用改回原来的路径
2. **保留文件** - 原生SQL文件可以保留作为备份
3. **监控日志** - 观察错误率和性能指标

## 📝 下一步计划

1. **前端切换** - 更新前端代码使用新API
2. **性能监控** - 部署后监控实际性能表现
3. **逐步扩展** - 根据需要迁移其他API
4. **清理优化** - 移除不再使用的Prisma代码

## 🤝 贡献指南

如果需要添加新的SQL查询：

1. 在 `src/lib/sql-queries.ts` 中添加查询语句
2. 在 `src/lib/business-data.ts` 中添加数据访问方法
3. 创建对应的API路由
4. 添加测试用例

## 📞 支持

如果遇到问题：

1. 检查数据库连接配置
2. 运行 `test-sql-apis.js` 验证基础功能
3. 查看API响应和错误日志
4. 对比Prisma和SQL版本的返回数据
