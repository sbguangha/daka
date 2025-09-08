@echo off
chcp 65001 >nul
echo 🚀 开始设置 Next.js 项目...
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 版本检查通过
node --version

REM 创建项目目录
set PROJECT_DIR=daka-nextjs
if exist "%PROJECT_DIR%" (
    echo ⚠️  目录 %PROJECT_DIR% 已存在，是否覆盖? (y/N)
    set /p response=
    if /i "%response%"=="y" (
        rmdir /s /q "%PROJECT_DIR%"
    ) else (
        echo ❌ 安装取消
        pause
        exit /b 1
    )
)

mkdir "%PROJECT_DIR%"
cd "%PROJECT_DIR%"

echo 📁 创建项目目录结构...

REM 创建目录结构
mkdir src\app
mkdir src\components\ui
mkdir src\components\layout
mkdir src\components\dashboard
mkdir src\components\modals
mkdir src\components\providers
mkdir src\lib
mkdir src\hooks
mkdir src\store
mkdir src\types
mkdir prisma
mkdir public

REM 复制配置文件
echo 📋 复制配置文件...
copy ..\next-package.json .\package.json
copy ..\next.config.js .\
copy ..\tailwind.config.js .\
copy ..\tsconfig.json .\
copy ..\postcss.config.js .\
copy ..\.eslintrc.json .\
copy ..\.env.example .\
copy ..\prisma\schema.prisma .\prisma\
copy ..\prisma\seed.ts .\prisma\

REM 复制源代码文件
echo 📄 复制源代码文件...
xcopy ..\src\* .\src\ /s /e /y

REM 安装依赖
echo 📦 安装依赖包...
npm install

REM 创建环境变量文件
if not exist ".env.local" (
    echo 🔧 创建环境变量文件...
    copy .env.example .env.local
    echo.
    echo ⚠️  请编辑 .env.local 文件，填入你的 Supabase 配置信息:
    echo    - DATABASE_URL
    echo    - DIRECT_URL
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
)

REM 生成 Prisma 客户端
echo 🗄️  生成 Prisma 客户端...
npx prisma generate

echo.
echo 🎉 Next.js 项目设置完成！
echo.
echo 📋 下一步操作:
echo    1. 编辑 .env.local 文件，配置数据库连接
echo    2. 运行 'npm run db:push' 创建数据库表
echo    3. 运行 'npm run db:seed' 初始化数据
echo    4. 运行 'npm run dev' 启动开发服务器
echo.
echo 🔗 有用的命令:
echo    npm run dev          # 启动开发服务器
echo    npm run build        # 构建生产版本
echo    npm run db:studio    # 打开数据库管理界面
echo    npm run type-check   # TypeScript 类型检查
echo.
echo 📚 文档链接:
echo    Next.js: https://nextjs.org/docs
echo    Prisma: https://www.prisma.io/docs
echo    Supabase: https://supabase.com/docs
echo.

REM 询问是否立即启动开发服务器
echo 是否立即启动开发服务器? (y/N)
set /p response=
if /i "%response%"=="y" (
    echo 🚀 启动开发服务器...
    npm run dev
)

pause
