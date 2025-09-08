# 🚀 Next.js 迁移指南

本指南将帮助你将现有的静态 HTML + Tailwind + JS 打卡网站迁移到 Next.js 13+ 全栈架构。

## 📋 迁移概览

### 🔄 架构变化
- **从**: 静态 HTML + CDN Tailwind + 原生 JS
- **到**: Next.js 13+ App Router + TypeScript + Prisma + Supabase

### 🎯 技术栈升级
| 组件 | 原技术栈 | 新技术栈 |
|------|----------|----------|
| 前端框架 | 原生 HTML/JS | Next.js 13+ App Router |
| 样式 | Tailwind CDN | Tailwind CSS (NPM) |
| 图标 | Lucide CDN | lucide-react (NPM) |
| 状态管理 | 全局变量 | Zustand |
| 数据存储 | localStorage | localStorage + Prisma + Supabase |
| 类型安全 | 无 | TypeScript |
| 组件库 | 无 | Radix UI |
| 部署 | 静态托管 | Vercel |

## 🛠️ 迁移步骤

### 1. 环境准备

```bash
# 1. 备份现有项目
cp -r daka daka-backup

# 2. 创建新的 Next.js 项目目录
mkdir daka-nextjs
cd daka-nextjs

# 3. 复制新的配置文件
cp ../next-package.json ./package.json
cp ../next.config.js ./
cp ../tailwind.config.js ./
cp ../tsconfig.json ./
cp ../.env.example ./

# 4. 安装依赖
npm install
```

### 2. 数据库设置 (Supabase)

```bash
# 1. 创建 Supabase 项目
# 访问 https://supabase.com 创建新项目

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase 连接信息

# 3. 初始化数据库
npx prisma db push
npx prisma db seed
```

### 3. 项目结构迁移

```
daka-nextjs/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # 根布局 (替代 index.html)
│   │   ├── page.tsx           # 主页面 (替代 index.html body)
│   │   ├── globals.css        # 全局样式
│   │   └── api/               # API 路由
│   │       ├── tasks/         # 任务 API
│   │       ├── checkins/      # 打卡 API
│   │       └── stats/         # 统计 API
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── layout/           # 布局组件
│   │   ├── dashboard/        # 仪表板组件
│   │   └── modals/           # 模态框组件
│   ├── lib/                  # 工具函数
│   ├── hooks/                # 自定义 Hooks
│   ├── store/                # 状态管理
│   └── types/                # TypeScript 类型
├── prisma/                   # 数据库配置
│   ├── schema.prisma        # 数据库模式
│   └── seed.ts              # 种子数据
├── public/                   # 静态资源
└── 配置文件...
```

### 4. 代码迁移映射

#### 4.1 HTML 结构 → React 组件

**原 HTML 结构**:
```html
<header class="glass-effect">
  <h1>每日打卡</h1>
  <!-- 按钮组 -->
</header>
```

**新 React 组件**:
```tsx
// src/components/layout/header.tsx
export function Header() {
  return (
    <header className="glass-effect">
      <h1>每日打卡</h1>
      {/* 按钮组 */}
    </header>
  );
}
```

#### 4.2 JavaScript 逻辑 → React Hooks + Zustand

**原 JS 状态管理**:
```javascript
let appState = {
  completedTasks: {},
  streak: 0,
  history: {}
};
```

**新状态管理**:
```typescript
// src/store/app-store.ts
export const useAppStore = create<AppState>()((set, get) => ({
  checkIns: {},
  streak: 0,
  // ... actions
}));
```

#### 4.3 API 调用 → Next.js API Routes

**原本地存储**:
```javascript
localStorage.setItem('daka-data', JSON.stringify(data));
```

**新 API + 数据库**:
```typescript
// src/app/api/checkins/route.ts
export async function POST(request: NextRequest) {
  const checkIn = await prisma.checkIn.create({
    data: { userId, taskId, date }
  });
  return NextResponse.json(checkIn);
}
```

### 5. 功能迁移清单

#### ✅ 已迁移功能
- [x] 项目结构搭建
- [x] 数据库设计 (Prisma + Supabase)
- [x] 基础 API 路由
- [x] 状态管理 (Zustand)
- [x] 类型定义 (TypeScript)
- [x] 样式系统 (Tailwind + CSS Variables)

#### 🚧 需要完成的组件
- [ ] Header 组件 (包含 Hover Card)
- [ ] ProgressSection 组件
- [ ] TasksGrid 组件
- [ ] DateNavigation 组件
- [ ] StatsModal 组件
- [ ] SyncModal 组件
- [ ] 主题切换功能
- [ ] 响应式设计适配

#### 🔄 数据迁移
- [ ] localStorage 数据导入功能
- [ ] 历史打卡记录迁移
- [ ] 用户设置迁移

### 6. 开发命令

```bash
# 开发环境
npm run dev

# 类型检查
npm run type-check

# 数据库操作
npm run db:generate    # 生成 Prisma 客户端
npm run db:push       # 推送数据库变更
npm run db:migrate    # 运行数据库迁移
npm run db:studio     # 打开数据库管理界面
npm run db:seed       # 运行种子数据

# 构建和部署
npm run build
npm run start
```

### 7. 部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel

# 4. 配置环境变量
# 在 Vercel 仪表板中设置生产环境变量
```

### 8. 环境变量配置

创建 `.env.local` 文件：

```env
# 数据库 (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# 应用配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="每日打卡"
```

## 🎯 迁移优势

### 📈 性能提升
- **SSR/SSG**: 服务端渲染，更快的首屏加载
- **代码分割**: 自动代码分割，按需加载
- **图片优化**: Next.js Image 组件自动优化
- **缓存策略**: 智能缓存和预取

### 🛡️ 开发体验
- **TypeScript**: 类型安全，减少运行时错误
- **热重载**: 开发时实时更新
- **ESLint**: 代码质量检查
- **自动部署**: Vercel 集成，推送即部署

### 🔒 数据安全
- **数据库**: 结构化数据存储，支持关系查询
- **备份**: 自动数据备份和恢复
- **同步**: 多设备数据同步
- **权限**: 用户权限和数据隔离

### 🚀 扩展性
- **API**: RESTful API，支持移动端
- **组件化**: 可复用组件，易于维护
- **状态管理**: 集中式状态管理
- **国际化**: 支持多语言扩展

## 🐛 常见问题

### Q: 如何迁移现有的 localStorage 数据？
A: 创建数据导入功能，在首次访问时检测并迁移本地数据到数据库。

### Q: 样式是否需要重写？
A: 大部分 Tailwind 类名保持不变，只需要调整组件结构。

### Q: 如何处理 SEO？
A: Next.js 提供内置的 SEO 优化，通过 metadata API 配置。

### Q: 部署成本如何？
A: Vercel 提供免费额度，Supabase 也有免费层级，适合个人项目。

## 📞 技术支持

如果在迁移过程中遇到问题，可以：
1. 查看 Next.js 官方文档
2. 参考 Prisma 和 Supabase 文档
3. 在项目 Issues 中提问

---

🎉 迁移完成后，你将拥有一个现代化、可扩展、类型安全的全栈打卡应用！
