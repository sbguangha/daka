@echo off
chcp 65001 >nul
echo 🚀 开始更新项目文档...
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查更新脚本是否存在
if not exist "scripts\update-docs.js" (
    echo ❌ 错误: 未找到文档更新脚本
    echo 请确保 scripts\update-docs.js 文件存在
    pause
    exit /b 1
)

REM 运行文档更新脚本
echo 📝 运行文档更新脚本...
node scripts\update-docs.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ 文档更新完成！
    echo.
    echo 📋 更新内容:
    echo    - README.md 版本信息和更新时间
    echo    - CHANGELOG.md 变更记录
    echo    - package.json 文件列表
    echo    - docs/stats.json 项目统计
    echo.
    echo 💡 提示: 如果你使用 Git，记得提交这些更改
    echo    git add .
    echo    git commit -m "docs: 更新项目文档"
) else (
    echo.
    echo ❌ 文档更新失败，请检查错误信息
)

echo.
pause
