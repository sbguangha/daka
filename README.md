# 🎯 每日打卡网站

> 最后更新：2025/9/5

一个简洁优雅的每日打卡应用，帮助你养成良好的习惯，追踪个人成长进度。

![项目状态](https://img.shields.io/badge/状态-开发中-green)
![技术栈](https://img.shields.io/badge/技术栈-HTML5%2BCSS3%2BJS-blue)
![版本](https://img.shields.io/badge/版本-v1.0.0-orange)

## ✨ 功能特点

### 🎯 核心功能
- **多项目打卡**：支持身体锻炼、学习成长、阅读等多个分类
- **进度可视化**：圆形进度条实时显示当日完成度
- **连续打卡统计**：智能计算连续打卡天数
- **历史记录查看**：支持查看任意日期的打卡情况
- **数据统计分析**：提供详细的打卡统计和热力图

### 🔄 数据同步
- **本地存储**：基于 localStorage 的离线数据存储
- **云端同步**：支持账户登录和云端数据同步
- **数据导入导出**：支持 JSON 格式的数据备份和恢复
- **跨设备同步**：在不同浏览器和设备间同步数据

### 🎨 用户体验
- **响应式设计**：完美适配桌面端和移动端
- **深色模式**：支持明暗主题切换
- **毛玻璃效果**：现代化的视觉设计
- **流畅动画**：丰富的交互动画效果
- **Hover Card**：悬浮卡片展示鼓励信息

## 🚀 快速开始

### 在线体验
直接打开 `index.html` 文件即可开始使用。

### 本地部署
```bash
# 克隆项目
git clone https://github.com/sbguangha/daka.git

# 进入项目目录
cd daka

# 使用任意 HTTP 服务器运行
# 方式1：使用 Python
python -m http.server 8000

# 方式2：使用 Node.js
npx serve .

# 方式3：使用 Live Server (VS Code 插件)
# 右键 index.html -> Open with Live Server
```

访问 `http://localhost:8000` 开始使用。

## 📁 项目结构

```
daka/
├── index.html              # 主页面
├── app.js                  # 核心应用逻辑
├── cloud-storage.js        # 云存储功能
├── data-sync.js           # 数据同步功能
├── demo.html              # 功能演示页面
├── test.html              # 测试页面
├── sync-solution.html     # 同步方案说明
├── README.md              # 项目说明
├── package.json           # 项目配置
├── .gitignore            # Git 忽略文件
├── LICENSE               # 开源协议
└── docs/                 # 文档目录
    ├── CHANGELOG.md      # 更新日志
    ├── CONTRIBUTING.md   # 贡献指南
    └── API.md           # API 文档
```

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **样式**：Tailwind CSS
- **图标**：Lucide Icons
- **存储**：localStorage + 云存储
- **部署**：静态文件部署

## 📱 支持的浏览器

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 使用指南

### 基本操作
1. **开始打卡**：点击任务卡片上的"打卡"按钮
2. **查看进度**：观察页面顶部的圆形进度条
3. **查看历史**：使用左右箭头按钮浏览历史记录
4. **查看统计**：点击统计按钮查看详细数据

### 数据同步
1. **注册账户**：点击用户按钮注册账户
2. **云端同步**：登录后数据自动同步到云端
3. **文件备份**：点击同步按钮导出/导入数据文件

## 🔧 自定义配置

### 添加新的打卡项目
编辑 `app.js` 文件中的 `taskGroups` 数组：

```javascript
const taskGroups = [
    {
        title: '你的分类名称',
        theme: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        tasks: [
            { id: 'unique-id', name: '任务名称', icon: 'lucide-icon-name' }
        ]
    }
];
```

### 修改主题色彩
在 `index.html` 的 CSS 部分修改颜色变量。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Lucide Icons](https://lucide.dev/) - 精美的图标库
- 所有贡献者和用户的支持

## 📞 联系方式

- 作者：葛勇攀
- 邮箱：2577388908@qq.com
- GitHub：[@sbguangha](https://github.com/sbguangha)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
