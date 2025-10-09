# 统一面包屑导航系统使用说明

## 概述

本系统提供了一个统一风格的面包屑导航组件，适用于网站的所有页面。样式简洁专业，支持中文标签，具有完整的路径解析和动态更新功能。

## 样式预览

```
首页 > SEO > 关键词魔法工具
```

## 快速开始

### 1. 基础使用

在页面组件中引入并使用：

```tsx
import { UnifiedBreadcrumbs } from '@/components/layout/unified-breadcrumbs';

export default function YourPage() {
  return (
    <div>
      <UnifiedBreadcrumbs />
      {/* 页面内容 */}
    </div>
  );
}
```

### 2. 推荐布局结构

```tsx
export default function YourPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航容器 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <UnifiedBreadcrumbs
            customSeparator=">"
            showCurrentPage={true}
            className="mb-2"
          />
          <div className="text-sm text-gray-600">
            当前位置: 首页 > 工具 > 当前页面
          </div>
        </div>
      </div>

      {/* 页面主要内容 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 页面内容 */}
      </main>
    </div>
  );
}
```

## 配置选项

### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | `""` | 自定义CSS类名 |
| `customSeparator` | `string` | `" > "` | 自定义分隔符 |
| `showHomeIcon` | `boolean` | `true` | 是否显示首页图标 |
| `showCurrentPage` | `boolean` | `true` | 是否显示当前页面 |
| `maxItems` | `number` | `6` | 最大显示项目数 |

### 使用示例

```tsx
{/* 基础使用 */}
<UnifiedBreadcrumbs />

{/* 自定义分隔符 */}
<UnifiedBreadcrumbs customSeparator="→" />

{/* 隐藏当前页面 */}
<UnifiedBreadcrumbs showCurrentPage={false} />

{/* 完整配置 */}
<UnifiedBreadcrumbs
  className="my-custom-class"
  customSeparator=">"
  showHomeIcon={true}
  showCurrentPage={true}
  maxItems={5}
/>
```

## 页面标签配置

### 自定义页面标签

在 `PAGE_LABELS` 中配置页面路径对应的中文标签：

```tsx
const PAGE_LABELS: Record<string, string> = {
  "/": "首页",
  "/simple-habit-tracker": "极简习惯追踪器",
  "/free-habit-tracker": "免费习惯追踪器",
  "/printable-habit-tracker": "可打印习惯追踪器",
  "/how-to-build-a-habit": "习惯养成指南",
  "/students": "学生习惯追踪器",
  "/auth": "登录",
  "/auth/signin": "用户登录",
  "/auth/error": "登录错误",
};
```

### 页面分组配置

在 `PAGE_GROUPS` 中配置页面的分组信息：

```tsx
const PAGE_GROUPS: Record<string, string> = {
  "/simple-habit-tracker": "工具",
  "/free-habit-tracker": "工具",
  "/printable-habit-tracker": "工具",
  "/how-to-build-a-habit": "指南",
  "/students": "学生专区",
};
```

## 动态路径解析

### 自动翻译功能

组件会自动将英文URL路径转换为中文标签：

- `/simple-habit-tracker` → "极简习惯追踪器"
- `/free-habit-tracker` → "免费习惯追踪器"
- `/how-to-build-a-habit` → "习惯养成指南"

### 翻译映射表

```tsx
const translations: Record<string, string> = {
  "habit": "习惯",
  "tracker": "追踪器",
  "simple": "极简",
  "free": "免费",
  "printable": "可打印",
  "guide": "指南",
  "student": "学生",
  "auth": "认证",
  "signin": "登录",
  "error": "错误",
};
```

## 样式定制

### 基础CSS类

组件使用以下CSS类，可通过全局样式进行定制：

```css
.unified-breadcrumbs        /* 主容器 */
.breadcrumb-list           /* 列表容器 */
.breadcrumb-item           /* 单个项目 */
.breadcrumb-link           /* 可点击链接 */
.breadcrumb-group          /* 分组标签 */
.breadcrumb-current-page   /* 当前页面 */
.breadcrumb-separator      /* 分隔符 */
.breadcrumb-current-info   /* 当前页面信息 */
```

### 暗色模式支持

组件自动适配暗色模式，通过 `prefers-color-scheme` 媒体查询实现。

## 不同页面使用示例

### 1. 首页

```tsx
// 输出：首页
<UnifiedBreadcrumbs />
```

### 2. 二级页面

```tsx
// 输出：首页 > 工具
<UnifiedBreadcrumbs />
```

### 3. 三级页面

```tsx
// 输出：首页 > 工具 > 具体工具
<UnifiedBreadcrumbs />
```

### 4. 深层页面

```tsx
// 输出：首页 > 工具 > ... > 具体页面
<UnifiedBreadcrumbs maxItems={5} />
```

## 响应式设计

### 移动端适配

- 字体大小自动调整
- 支持横向滚动
- 触摸友好的点击区域

### 桌面端显示

- 完整的面包屑路径
- 悬停效果
- 键盘导航支持

## 性能优化

### 客户端组件

组件标记为 `'use client'`，确保在客户端渲染：

```tsx
'use client';
```

### 路径缓存

使用 `usePathname` Hook 获取当前路径，避免重复计算：

```tsx
const pathname = usePathname() || "/";
```

### 虚拟化支持

对于长路径，支持最大项目数限制和省略号显示：

```tsx
const displayItems = breadcrumbs.length > maxItems
  ? [...breadcrumbs.slice(0, 2), { href: "#", label: "...", isCurrent: false, isEllipsis: true }, ...breadcrumbs.slice(-2)]
  : breadcrumbs;
```

## 最佳实践

### 1. 统一布局

在所有页面使用相同的面包屑容器样式：

```tsx
<div className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="max-w-6xl mx-auto">
    <UnifiedBreadcrumbs customSeparator=">" />
  </div>
</div>
```

### 2. 当前位置提示

添加当前位置文字说明：

```tsx
<div className="text-sm text-gray-600">
  当前位置: 首页 > 工具 > 当前页面
</div>
```

### 3. 响应式容器

使用响应式容器确保在不同屏幕尺寸下的良好显示：

```tsx
<div className="max-w-6xl mx-auto px-6 py-8">
  {/* 页面内容 */}
</div>
```

## 故障排除

### 常见问题

1. **面包屑不显示**
   - 检查是否正确导入组件
   - 确认页面路径配置正确

2. **中文标签不生效**
   - 检查 `PAGE_LABELS` 配置
   - 确认路径匹配正确

3. **样式异常**
   - 检查 CSS 文件是否正确导入
   - 确认 Tailwind CSS 配置正常

### 调试建议

1. 使用浏览器开发者工具检查元素
2. 查看控制台错误信息
3. 检查网络请求是否成功

## 更新日志

### v1.0.0
- ✨ 基础面包屑导航功能
- 🎨 统一的中文标签系统
- 📱 响应式设计支持
- 🌙 暗色模式适配
- ⚙️ 可配置参数支持

---

如需更多帮助，请查看组件源代码或联系开发团队。面包屑导航系统已为你的网站提供了完整的导航解决方案！🚀