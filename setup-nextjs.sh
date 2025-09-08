#!/bin/bash

# Next.js 项目快速设置脚本
echo "🚀 开始设置 Next.js 项目..."

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 错误: Node.js 版本过低，需要 18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"

# 创建项目目录
PROJECT_DIR="daka-nextjs"
if [ -d "$PROJECT_DIR" ]; then
    echo "⚠️  目录 $PROJECT_DIR 已存在，是否覆盖? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
    else
        echo "❌ 安装取消"
        exit 1
    fi
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "📁 创建项目目录结构..."

# 创建目录结构
mkdir -p src/{app,components/{ui,layout,dashboard,modals,providers},lib,hooks,store,types}
mkdir -p prisma
mkdir -p public

# 复制配置文件
echo "📋 复制配置文件..."
cp ../next-package.json ./package.json
cp ../next.config.js ./
cp ../tailwind.config.js ./
cp ../tsconfig.json ./
cp ../postcss.config.js ./
cp ../.eslintrc.json ./
cp ../.env.example ./
cp ../prisma/schema.prisma ./prisma/
cp ../prisma/seed.ts ./prisma/

# 复制源代码文件
echo "📄 复制源代码文件..."
cp -r ../src/* ./src/

# 安装依赖
echo "📦 安装依赖包..."
npm install

# 创建环境变量文件
if [ ! -f ".env.local" ]; then
    echo "🔧 创建环境变量文件..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  请编辑 .env.local 文件，填入你的 Supabase 配置信息:"
    echo "   - DATABASE_URL"
    echo "   - DIRECT_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
fi

# 生成 Prisma 客户端
echo "🗄️  生成 Prisma 客户端..."
npx prisma generate

echo ""
echo "🎉 Next.js 项目设置完成！"
echo ""
echo "📋 下一步操作:"
echo "   1. 编辑 .env.local 文件，配置数据库连接"
echo "   2. 运行 'npm run db:push' 创建数据库表"
echo "   3. 运行 'npm run db:seed' 初始化数据"
echo "   4. 运行 'npm run dev' 启动开发服务器"
echo ""
echo "🔗 有用的命令:"
echo "   npm run dev          # 启动开发服务器"
echo "   npm run build        # 构建生产版本"
echo "   npm run db:studio    # 打开数据库管理界面"
echo "   npm run type-check   # TypeScript 类型检查"
echo ""
echo "📚 文档链接:"
echo "   Next.js: https://nextjs.org/docs"
echo "   Prisma: https://www.prisma.io/docs"
echo "   Supabase: https://supabase.com/docs"
echo ""

# 询问是否立即启动开发服务器
echo "是否立即启动开发服务器? (y/N)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🚀 启动开发服务器..."
    npm run dev
fi
