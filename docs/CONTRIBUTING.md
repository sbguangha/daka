# 贡献指南

感谢你对每日打卡项目的关注！我们欢迎所有形式的贡献。

## 🤝 如何贡献

### 报告问题
如果你发现了 bug 或有功能建议：

1. 检查 [Issues](https://github.com/sbguangha/daka/issues) 确保问题未被报告
2. 创建新的 Issue，包含：
   - 清晰的标题和描述
   - 重现步骤（如果是 bug）
   - 期望的行为
   - 截图（如果适用）
   - 浏览器和版本信息

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/sbguangha/daka.git
   cd daka
   ```

2. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **进行更改**
   - 遵循现有的代码风格
   - 添加必要的注释
   - 确保代码可以正常运行

4. **测试更改**
   - 在多个浏览器中测试
   - 确保响应式设计正常
   - 验证深色模式兼容性

5. **提交更改**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

6. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **创建 Pull Request**

## 📝 代码规范

### JavaScript
- 使用 ES6+ 语法
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名类
- 添加有意义的注释
- 保持函数简洁，单一职责

```javascript
// 好的例子
function calculateStreak(history) {
    // 计算连续打卡天数
    let streak = 0;
    // ... 实现逻辑
    return streak;
}

// 避免
function calc(h) {
    // 没有注释，变量名不清晰
}
```

### HTML
- 使用语义化标签
- 保持适当的缩进
- 添加必要的 aria 属性
- 确保可访问性

### CSS
- 优先使用 Tailwind CSS 类
- 自定义样式放在 `<style>` 标签中
- 使用有意义的类名
- 支持深色模式

## 🎯 开发指南

### 本地开发环境
```bash
# 启动本地服务器
npm start
# 或
python -m http.server 8000
```

### 项目结构
```
daka/
├── index.html          # 主页面
├── app.js             # 核心逻辑
├── cloud-storage.js   # 云存储功能
├── data-sync.js       # 数据同步
└── docs/              # 文档
```

### 添加新功能

1. **新的打卡项目**
   - 在 `app.js` 的 `taskGroups` 数组中添加
   - 选择合适的图标和主题色

2. **新的页面功能**
   - 在 `index.html` 中添加 HTML 结构
   - 在 `app.js` 中添加相应的 JavaScript 逻辑
   - 确保响应式设计

3. **新的数据功能**
   - 考虑数据结构的向后兼容性
   - 更新数据迁移逻辑
   - 测试导入导出功能

## 🐛 调试指南

### 常见问题
1. **数据不同步**
   - 检查 localStorage 权限
   - 验证网络连接
   - 查看浏览器控制台错误

2. **样式问题**
   - 确保 Tailwind CSS 正确加载
   - 检查深色模式类名
   - 验证响应式断点

3. **图标不显示**
   - 确认 Lucide Icons 库加载
   - 检查图标名称是否正确
   - 调用 `lucide.createIcons()`

### 调试工具
- 浏览器开发者工具
- Console 日志输出
- Network 面板检查资源加载
- Application 面板查看 localStorage

## 📋 Pull Request 检查清单

提交 PR 前请确保：

- [ ] 代码遵循项目规范
- [ ] 功能在主流浏览器中正常工作
- [ ] 响应式设计正确
- [ ] 深色模式兼容
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 测试了数据同步功能
- [ ] 没有破坏现有功能

## 🏷️ 提交信息规范

使用清晰的提交信息：

```
类型(范围): 简短描述

详细描述（可选）

相关 Issue: #123
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(sync): 添加云端数据同步功能

- 实现用户登录系统
- 添加数据上传下载功能
- 支持离线模式

Closes #15
```

## 🎉 感谢

感谢所有贡献者的努力！你的贡献让这个项目变得更好。

## 📞 联系我们

如果你有任何问题，可以通过以下方式联系：

- GitHub Issues
- 邮箱：2577388908@qq.com

再次感谢你的贡献！🙏
