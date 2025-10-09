'use client';

import Link from 'next/link';
import { UnifiedBreadcrumbs } from '@/components/layout/unified-breadcrumbs';

export default function ExampleBreadcrumbsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 - 示例1: 基础样式 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <UnifiedBreadcrumbs
            className="mb-2"
            customSeparator=">"
            showCurrentPage={false}
          />
        </div>
      </div>

      {/* 页面内容 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">关键词魔法工具</h1>
          <p className="text-gray-600 mb-6">
            这是一个展示统一面包屑导航的示例页面。面包屑导航显示了完整的页面层级结构。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">面包屑导航特点</h2>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✅ 统一的中文标签系统</li>
                <li>✅ 智能路径解析和分组</li>
                <li>✅ 当前页面高亮显示</li>
                <li>✅ 移动端友好的响应式设计</li>
                <li>✅ 支持自定义分隔符</li>
                <li>✅ 暗色模式支持</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-900 mb-3">使用说明</h2>
              <ul className="text-sm text-green-800 space-y-2">
                <li>📍 自动显示当前页面位置</li>
                <li>🔗 可点击的层级导航</li>
                <li>🏠 首页始终可访问</li>
                <li>📱 适配各种屏幕尺寸</li>
                <li>🎨 可自定义样式和分隔符</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 示例2: 不同分隔符样式 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">不同分隔符样式示例</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">箭头分隔符</h3>
              <UnifiedBreadcrumbs
                customSeparator="→"
                showCurrentPage={false}
                className="mb-4"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">斜杠分隔符</h3>
              <UnifiedBreadcrumbs
                customSeparator="/"
                showCurrentPage={false}
                className="mb-4"
              />
          </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">点分隔符</h3>
              <UnifiedBreadcrumbs
                customSeparator="•"
                showCurrentPage={false}
                className="mb-4"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">竖线分隔符</h3>
              <UnifiedBreadcrumbs
                customSeparator="|"
                showCurrentPage={false}
                className="mb-4"
              />
            </div>
          </div>
        </div>

        {/* 示例3: 不同页面层级 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">不同页面层级示例</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">首页</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <UnifiedBreadcrumbs
                  customSeparator=">"
                  showCurrentPage={true}
                  className="mb-2"
                />
                <p className="text-sm text-gray-600">当前在首页位置</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">二级页面（如：工具页面）</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <Link href="/free-habit-tracker" className="text-blue-600 hover:underline">
                    点击进入免费习惯追踪器页面 →
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mb-2">Breadcrumbs: Home \u003e Tools</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">三级页面（如：具体工具）</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Breadcrumbs: Home \u003e Tools \u003e Tool</p>
                <p className="text-xs text-gray-500">当前页面会以高亮样式显示</p>
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">如何在不同页面使用</h2>

          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <h3 className="font-semibold mb-2">1. 基础使用</h3>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">{`<UnifiedBreadcrumbs />
// Output: Home \u003e Current Page`}</pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. 自定义分隔符</h3>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">{`<UnifiedBreadcrumbs customSeparator="→" />
// Output: Home → Current Page`}</pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 隐藏当前页面</h3>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">{`<UnifiedBreadcrumbs showCurrentPage={false} />
// Output: Home \u003e Current Page (current hidden)`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
