# 主题切换功能使用指南

## 概述

本项目实现了完整的明亮/暗黑主题切换功能，支持用户偏好记忆、系统主题检测和平滑过渡动画。

## 功能特性

- ✅ 明亮/暗黑主题切换
- ✅ 用户偏好持久化存储
- ✅ 系统主题自动检测
- ✅ 平滑过渡动画
- ✅ 完整的可访问性支持
- ✅ 跨浏览器兼容性
- ✅ 移动端优化

## 使用方法

### 基本使用

在页面中使用主题切换按钮：

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function MyComponent() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

### 自定义样式

ThemeToggle 组件支持多种自定义选项：

```tsx
// 不同尺寸
<ThemeToggle size="sm" />
<ThemeToggle size="md" />
<ThemeToggle size="lg" />

// 不同变体
<ThemeToggle variant="default" />
<ThemeToggle variant="ghost" />
<ThemeToggle variant="outline" />

// 自定义类名
<ThemeToggle className="my-custom-class" />
```

### 编程式主题控制

使用 `useTheme` hook 进行编程式控制：

```tsx
import { useTheme } from 'next-themes';

export function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>当前主题: {resolvedTheme}</p>
      <button onClick={() => setTheme('light')}>明亮主题</button>
      <button onClick={() => setTheme('dark')}>暗黑主题</button>
      <button onClick={() => setTheme('system')}>跟随系统</button>
    </div>
  );
}
```

## 主题配置

### CSS 变量

项目使用 CSS 变量系统定义主题颜色，在 `src/app/globals.css` 中配置：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* 更多变量... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* 更多变量... */
}
```

### Tailwind CSS 配置

在 `tailwind.config.js` 中配置暗色模式：

```js
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // 更多颜色...
      },
    },
  },
};
```

## 组件样式指南

### 使用主题感知的样式

在组件中使用 Tailwind 的暗色模式类：

```tsx
export function MyComponent() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-blue-600 dark:text-blue-400">标题</h1>
      <p className="text-gray-600 dark:text-gray-300">内容</p>
    </div>
  );
}
```

### 使用 CSS 变量

直接使用定义的 CSS 变量：

```tsx
export function MyComponent() {
  return (
    <div className="bg-background text-foreground">
      <div className="bg-card text-card-foreground">
        卡片内容
      </div>
    </div>
  );
}
```

## 最佳实践

### 1. 避免水合错误

在使用主题相关的条件渲染时，使用 `mounted` 状态：

```tsx
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeAwareComponent() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      当前主题: {resolvedTheme}
    </div>
  );
}
```

### 2. 性能优化

使用 CSS 变量而不是条件类名来提高性能：

```css
/* 推荐 */
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* 不推荐 */
.my-component {
  @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
}
```

### 3. 可访问性

确保在所有主题下都有足够的颜色对比度：

```css
/* 确保对比度 ≥ 4.5:1 */
:root {
  --text-primary: 0 0% 9%;     /* #171717 */
  --text-secondary: 0 0% 45%;  /* #737373 */
}

.dark {
  --text-primary: 0 0% 98%;    /* #fafafa */
  --text-secondary: 0 0% 65%;  /* #a3a3a3 */
}
```

## 故障排除

### 主题不切换

1. 检查 `ThemeProvider` 是否正确配置
2. 确认 `darkMode: ['class']` 在 Tailwind 配置中
3. 验证 CSS 变量是否正确定义

### 页面刷新后主题丢失

1. 检查 localStorage 是否可用
2. 确认浏览器没有阻止存储
3. 查看控制台是否有错误信息

### 动画不流畅

1. 检查 `prefers-reduced-motion` 设置
2. 确认 CSS 过渡属性正确
3. 验证浏览器支持情况

### 移动端问题

1. 确认触摸区域足够大（≥ 44px）
2. 检查视口设置
3. 测试不同设备和浏览器

## 测试

### 手动测试

使用内置的手动测试组件：

```tsx
import { ThemeToggleManualTest } from '@/components/ui/theme-toggle-manual-test';

export function TestPage() {
  return <ThemeToggleManualTest />;
}
```

### 兼容性检查

使用兼容性检测工具：

```tsx
import { getCompatibilityReport, logCompatibilityInfo } from '@/utils/browser-compatibility';

// 在开发环境下记录兼容性信息
if (process.env.NODE_ENV === 'development') {
  logCompatibilityInfo();
}
```

## 更新日志

- **v1.0.0**: 初始实现
  - 基本主题切换功能
  - 持久化存储
  - 系统主题检测
  - 可访问性支持
  - 跨浏览器兼容性