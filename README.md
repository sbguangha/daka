# 🎯 每日打卡应用

> 最后更新：2025/1/10

一个现代化的每日打卡应用，基于 Next.js 13+ 和 Supabase 构建，支持 Google 登录和跨设备数据同步，帮助你养成良好的习惯，追踪个人成长进度。

![项目状态](https://img.shields.io/badge/状态-生产就绪-brightgreen)
![技术栈](https://img.shields.io/badge/技术栈-Next.js%2BSupabase%2BPrisma-blue)
![版本](https://img.shields.io/badge/版本-v2.0.0-orange)
![部署](https://img.shields.io/badge/部署-Vercel-black)

## ✨ 功能特点

### 🎯 核心功能
- **多项目打卡**：支持身体锻炼、学习成长、精神修养等多个分类
- **智能打卡**：一键打卡，支持撤销操作
- **进度可视化**：实时显示当日完成度和连续打卡天数
- **历史记录**：完整的打卡历史记录和统计分析
- **任务管理**：灵活的任务分组和自定义配置

### 🔐 用户认证
- **Google 登录**：安全便捷的 OAuth 2.0 认证
- **会话管理**：基于数据库的会话存储
- **用户权限**：完善的权限控制和数据隔离
- **安全保护**：中间件保护敏感路由

### 🌐 数据同步
- **云端存储**：基于 Supabase PostgreSQL 的可靠存储
- **实时同步**：打卡数据实时同步到云端
- **跨设备访问**：任何设备登录 Google 账号即可访问数据
- **数据迁移**：智能检测并迁移本地数据到云端
- **离线支持**：网络异常时自动回退到本地存储

### 🎨 用户体验
- **现代化设计**：基于 Tailwind CSS 的精美界面
- **响应式布局**：完美适配桌面端和移动端
- **深色模式**：支持系统主题自动切换
- **流畅动画**：丰富的交互动画和过渡效果
- **类型安全**：完整的 TypeScript 类型支持

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm 或 yarn
- Supabase 账户
- Google OAuth 应用

### 本地开发
```bash
# 克隆项目
git clone https://github.com/sbguangha/daka.git

# 进入项目目录
cd daka

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的配置

# 生成 Prisma 客户端
npx prisma generate

# 同步数据库结构
npx prisma db push

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 开始使用。

### 环境变量配置
```bash
# .env.local
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
```

## 📁 项目结构

```
daka/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 主页面
│   │   ├── globals.css        # 全局样式
│   │   ├── auth/              # 认证页面
│   │   └── api/               # API 路由
│   │       ├── checkins/      # 打卡 API
│   │       ├── tasks/         # 任务 API
│   │       ├── stats/         # 统计 API
│   │       ├── user/          # 用户 API
│   │       ├── migrate/       # 数据迁移 API
│   │       └── auth/          # 认证 API
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── layout/           # 布局组件
│   │   ├── timesheet/        # 打卡相关组件
│   │   ├── modals/           # 模态框组件
│   │   └── auth/             # 认证组件
│   ├── lib/                  # 工具函数
│   │   ├── prisma.ts         # Prisma 客户端
│   │   ├── api-client.ts     # API 客户端
│   │   ├── auth-utils.ts     # 认证工具
│   │   └── utils.ts          # 通用工具
│   ├── hooks/                # 自定义 Hooks
│   ├── store/                # 状态管理 (Zustand)
│   ├── types/                # TypeScript 类型
│   └── utils/                # 存储管理
├── prisma/                   # 数据库相关
│   ├── schema.prisma         # 数据库模型
│   └── migrations/           # 数据库迁移
├── public/                   # 静态资源
├── docs/                     # 文档目录
├── .env.local               # 环境变量
├── next.config.js           # Next.js 配置
├── tailwind.config.js       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目配置
```

## 🛠️ 技术栈

### 前端框架
- **Next.js 14**：React 全栈框架，App Router
- **React 18**：用户界面库
- **TypeScript**：类型安全的 JavaScript

### 样式和UI
- **Tailwind CSS**：原子化 CSS 框架
- **Radix UI**：无障碍的 UI 组件库
- **Lucide React**：精美的图标库
- **CSS Variables**：动态主题支持

### 状态管理
- **Zustand**：轻量级状态管理
- **React Hooks**：组件状态管理

### 数据库和后端
- **Supabase**：开源的 Firebase 替代品
- **PostgreSQL**：关系型数据库
- **混合数据访问**：
  - **Prisma**：认证系统（NextAuth.js）
  - **原生SQL**：业务API（高性能）
- **连接池**：pg库连接池管理

### 认证和安全
- **Google OAuth 2.0**：安全的第三方登录
- **JWT**：JSON Web Tokens
- **Middleware**：路由保护

### 开发工具
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Husky**：Git hooks
- **TypeScript**：静态类型检查

### 部署和托管
- **Vercel**：前端部署平台
- **Supabase**：数据库托管
- **GitHub Actions**：CI/CD 自动化

## 📱 支持的浏览器

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 使用指南

### 首次使用
1. **访问应用**：打开网站首页
2. **Google 登录**：点击登录按钮，使用 Google 账号登录
3. **数据迁移**：如果有本地数据，系统会提示迁移到云端
4. **开始打卡**：选择任务点击打卡按钮

### 基本操作
1. **打卡操作**：点击任务卡片进行打卡/取消打卡
2. **查看进度**：实时查看当日完成进度
3. **历史记录**：浏览不同日期的打卡记录
4. **统计分析**：查看连续打卡天数和完成率

### 跨设备同步
1. **登录账号**：在任何设备上使用 Google 账号登录
2. **自动同步**：打卡数据自动同步到云端
3. **实时更新**：所有设备上的数据保持同步
4. **离线支持**：网络异常时数据保存在本地

### 数据管理
1. **云端存储**：所有数据安全存储在 Supabase
2. **数据迁移**：本地数据可一键迁移到云端
3. **数据导出**：支持导出备份数据
4. **隐私保护**：用户数据完全隔离，安全可靠

## 🔧 开发指南

### 数据库管理
```bash
# 查看数据库状态
npx prisma studio

# 重置数据库
npx prisma db push --force-reset

# 生成客户端
npx prisma generate

# 运行迁移
npx prisma migrate dev
```

### API 路由
- `GET /api/tasks` - 获取任务列表
- `POST /api/checkins` - 创建/切换打卡记录
- `GET /api/checkins` - 获取打卡记录
- `GET /api/stats` - 获取统计数据
- `POST /api/migrate` - 数据迁移

### 自定义任务
在 Supabase 数据库中直接添加任务组和任务：

```sql
-- 添加任务组
INSERT INTO task_groups (title, description, theme, "order", is_default, is_active)
VALUES ('新分类', '描述', 'bg-gradient-to-r from-pink-500 to-rose-600 text-white', 4, true, true);

-- 添加任务
INSERT INTO tasks (name, description, icon, "order", is_active, task_group_id)
VALUES ('新任务', '任务描述', 'star', 1, true, 'task_group_id');
```

### 环境配置
- 开发环境：`npm run dev`
- 生产构建：`npm run build`
- 类型检查：`npm run type-check`
- 代码检查：`npm run lint`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🚀 部署

### Vercel 部署
1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成

### 环境变量设置
在 Vercel 项目设置中添加以下环境变量：
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Supabase](https://supabase.com/) - 开源的 Firebase 替代品
- [Prisma](https://prisma.io/) - 现代化的数据库工具
- [NextAuth.js](https://next-auth.js.org/) - 认证解决方案
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Radix UI](https://radix-ui.com/) - 无障碍 UI 组件
- [Lucide](https://lucide.dev/) - 精美的图标库
- [Zustand](https://zustand-demo.pmnd.rs/) - 轻量级状态管理
- 所有贡献者和用户的支持

## 📞 联系方式

- 作者：葛勇攀
- 邮箱：2577388908@qq.com
- GitHub：[@sbguangha](https://github.com/sbguangha)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
