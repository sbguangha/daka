# 主题切换功能设计文档

## 概述

基于现有的 Next.js + Tailwind CSS + next-themes 架构，实现完整的主题切换功能。项目已经具备了基础的主题切换基础设施，需要完善 Header 组件中的主题切换逻辑，并确保所有页面元素都能正确响应主题变化。

## 架构

### 技术栈
- **Next.js 14**: React 框架，支持 SSR 和客户端渲染
- **next-themes**: 主题管理库，已集成在项目中
- **Tailwind CSS**: 样式框架，已配置暗色模式支持
- **TypeScript**: 类型安全
- **Lucide React**: 图标库，用于主题切换按钮图标

### 现有基础设施
- `ThemeProvider` 已在 `layout.tsx` 中配置
- Tailwind CSS 已配置 `darkMode: ['class']`
- CSS 变量系统已建立，支持明亮和暗黑主题
- Header 组件已存在，但主题切换功能未完全实现

## 组件和接口

### 1. 主题切换钩子 (useTheme Hook)
```typescript
// 来自 next-themes
interface UseThemeReturn {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  themes: string[];
  systemTheme: string | undefined;
}
```

### 2. 更新后的 Header 组件
```typescript
interface HeaderProps {
  // 无需额外 props，使用 next-themes 的 useTheme hook
}
```

### 3. 主题切换按钮组件
```typescript
interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

## 数据模型

### 主题状态
- **light**: 明亮主题
- **dark**: 暗黑主题  
- **system**: 跟随系统设置

### 本地存储
- 使用 `next-themes` 内置的 localStorage 管理
- 键名: `theme`
- 值: `'light' | 'dark' | 'system'`

## 错误处理

### 1. 水合错误处理
- 使用 `next-themes` 的 `disableTransitionOnChange` 防止闪烁
- 在组件挂载前避免渲染主题相关内容

### 2. 浏览器兼容性
- 对不支持 CSS 变量的旧浏览器提供降级方案
- 使用 Tailwind 的标准颜色类作为后备

### 3. 系统主题检测失败
- 当无法检测系统主题时，默认使用明亮主题
- 提供手动切换选项

## 测试策略

### 1. 单元测试
- 测试 `useTheme` hook 的状态管理
- 测试主题切换按钮的点击行为
- 测试本地存储的读写

### 2. 集成测试
- 测试主题切换对整个页面的影响
- 测试页面刷新后主题持久化
- 测试系统主题变化的响应

### 3. 视觉回归测试
- 截图对比明亮和暗黑主题下的页面渲染
- 测试过渡动画的流畅性
- 测试不同屏幕尺寸下的主题切换

### 4. 跨浏览器测试
- Chrome、Firefox、Safari、Edge 的兼容性测试
- 移动端浏览器的触摸交互测试

## 实现细节

### 1. CSS 变量系统
项目已经在 `globals.css` 中定义了完整的 CSS 变量系统：
- 明亮主题变量在 `:root` 中定义
- 暗黑主题变量在 `.dark` 类中定义
- 所有组件使用 `hsl(var(--variable-name))` 引用颜色

### 2. Tailwind 配置
- `darkMode: ['class']` 已配置，支持类名切换
- 扩展颜色系统使用 CSS 变量
- 自定义动画和过渡效果已定义

### 3. 主题切换流程
1. 用户点击主题切换按钮
2. `next-themes` 更新 `theme` 状态
3. 自动在 `<html>` 元素上添加/移除 `dark` 类
4. CSS 变量系统响应类名变化
5. 所有使用 Tailwind 暗色类的元素自动更新
6. 主题偏好保存到 localStorage

### 4. 服务端渲染考虑
- 使用 `next-themes` 的 `attribute="class"` 配置
- 在客户端挂载前避免主题相关的条件渲染
- 使用 `suppressHydrationWarning` 处理必要的客户端专用内容

### 5. 性能优化
- 主题切换使用 CSS 变量，避免重新计算样式
- 图标切换使用条件渲染，最小化 DOM 操作
- 利用 Tailwind 的 JIT 编译，只包含使用的样式

### 6. 可访问性
- 主题切换按钮包含适当的 `aria-label`
- 支持键盘导航
- 提供视觉焦点指示器
- 确保在所有主题下都有足够的颜色对比度