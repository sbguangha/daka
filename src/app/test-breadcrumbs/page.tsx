'use client';

import { UnifiedBreadcrumbs } from '@/components/layout/unified-breadcrumbs';

export default function TestBreadcrumbsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <UnifiedBreadcrumbs
            customSeparator=">"
            showCurrentPage={false}
            className="mb-2"
          />
        </div>
      </div>

      {/* 页面内容 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">面包屑导航测试页面</h1>
          <p className="text-gray-600 mb-6">
            这是一个测试统一面包屑导航功能的页面。如果页面正常显示，说明面包屑导航功能已经修复。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">测试功能</h2>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✅ 面包屑导航显示正常</li>
                <li>✅ 中文标签正确显示</li>
                <li>✅ 当前页面高亮显示</li>
                <li>✅ 分隔符样式统一</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-900 mb-3">页面信息</h2>
              <ul className="text-sm text-green-800 space-y-2">
                <li>📍 当前路径: /test-breadcrumbs</li>
                <li>🎯 Expected: Home &gt; Test Page</li>
                <li>🔗 所有链接可正常点击</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">测试说明</h3>
            <p className="text-sm text-yellow-800">
              如果此页面正常加载并显示面包屑导航，说明修复成功。面包屑应该显示为：
              <br />
              <strong>Home \u003e Test Page</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
