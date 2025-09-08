#!/bin/bash

echo "🚀 启动本地开发环境..."
echo

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo

# 检查是否已经有 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    echo
    
    # 使用简化的 package.json
    cp next-package.json package.json
    
    echo "正在安装 npm 包，请稍候..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查网络连接"
        exit 1
    fi
    
    echo "✅ 依赖安装完成！"
    echo
else
    echo "✅ 依赖已安装"
    echo
fi

# 检查 package.json 是否是最新的
if [ ! -f "package.json" ]; then
    cp next-package.json package.json
fi

echo "🌐 启动开发服务器..."
echo
echo "📋 开发服务器信息:"
echo "   - 本地地址: http://localhost:3000"
echo "   - 网络地址: http://你的IP:3000"
echo "   - 按 Ctrl+C 停止服务器"
echo

# 启动开发服务器
npm run dev

echo
echo "👋 开发服务器已停止"
