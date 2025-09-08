@echo off
chcp 65001 >nul
echo 🚀 启动本地开发环境...
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 版本: 
node --version
echo.

REM 检查是否已经有 node_modules
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo.
    
    REM 使用简化的 package.json
    copy next-package.json package.json
    
    echo 正在安装 npm 包，请稍候...
    npm install
    
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    
    echo ✅ 依赖安装完成！
    echo.
) else (
    echo ✅ 依赖已安装
    echo.
)

REM 检查 package.json 是否是最新的
if not exist "package.json" (
    copy next-package.json package.json
)

echo 🌐 启动开发服务器...
echo.
echo 📋 开发服务器信息:
echo    - 本地地址: http://localhost:3000
echo    - 网络地址: http://你的IP:3000
echo    - 按 Ctrl+C 停止服务器
echo.

REM 启动开发服务器
npm run dev

echo.
echo 👋 开发服务器已停止
pause
