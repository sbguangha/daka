#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 开始更新项目文档...${NC}"
echo

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 Node.js，请先安装 Node.js${NC}"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查更新脚本是否存在
if [ ! -f "scripts/update-docs.js" ]; then
    echo -e "${RED}❌ 错误: 未找到文档更新脚本${NC}"
    echo "请确保 scripts/update-docs.js 文件存在"
    exit 1
fi

# 运行文档更新脚本
echo -e "${YELLOW}📝 运行文档更新脚本...${NC}"
node scripts/update-docs.js

if [ $? -eq 0 ]; then
    echo
    echo -e "${GREEN}✅ 文档更新完成！${NC}"
    echo
    echo -e "${BLUE}📋 更新内容:${NC}"
    echo "   - README.md 版本信息和更新时间"
    echo "   - CHANGELOG.md 变更记录"
    echo "   - package.json 文件列表"
    echo "   - docs/stats.json 项目统计"
    echo
    echo -e "${YELLOW}💡 提示: 如果你使用 Git，记得提交这些更改${NC}"
    echo "   git add ."
    echo "   git commit -m \"docs: 更新项目文档\""
else
    echo
    echo -e "${RED}❌ 文档更新失败，请检查错误信息${NC}"
    exit 1
fi

echo
