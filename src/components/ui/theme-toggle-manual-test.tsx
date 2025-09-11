'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './theme-toggle';

/**
 * 手动测试组件 - 用于在浏览器中测试主题切换功能
 */
export function ThemeToggleManualTest() {
  const [mounted, setMounted] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTests = () => {
    setTestResults([]);
    
    // 测试1: 主题切换功能
    addTestResult('开始测试主题切换功能...');
    
    setTimeout(() => {
      const originalTheme = resolvedTheme;
      setTheme('light');
      addTestResult(`设置为明亮主题，当前主题: ${resolvedTheme}`);
      
      setTimeout(() => {
        setTheme('dark');
        addTestResult(`设置为暗黑主题，当前主题: ${resolvedTheme}`);
        
        setTimeout(() => {
          setTheme('system');
          addTestResult(`设置为系统主题，当前主题: ${resolvedTheme}，系统主题: ${systemTheme}`);
          
          setTimeout(() => {
            setTheme(originalTheme || 'light');
            addTestResult(`恢复原始主题: ${originalTheme}`);
            addTestResult('✅ 主题切换测试完成');
          }, 1000);
        }, 1000);
      }, 1000);
    }, 100);
  };

  const testLocalStorage = () => {
    addTestResult('测试 localStorage 持久化...');
    
    // 检查 localStorage 中的主题设置
    const storedTheme = localStorage.getItem('theme');
    addTestResult(`localStorage 中的主题: ${storedTheme}`);
    
    // 测试设置新主题
    const testTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(testTheme);
    
    setTimeout(() => {
      const newStoredTheme = localStorage.getItem('theme');
      if (newStoredTheme === testTheme) {
        addTestResult('✅ localStorage 持久化测试通过');
      } else {
        addTestResult('❌ localStorage 持久化测试失败');
      }
    }, 500);
  };

  const testSystemTheme = () => {
    addTestResult('测试系统主题检测...');
    
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      addTestResult(`系统暗色模式: ${darkModeQuery.matches ? '是' : '否'}`);
      addTestResult(`检测到的系统主题: ${systemTheme}`);
      addTestResult('✅ 系统主题检测测试完成');
    } else {
      addTestResult('❌ 浏览器不支持 matchMedia API');
    }
  };

  if (!mounted) {
    return <div>Loading manual test...</div>;
  }

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        主题切换功能手动测试
      </h2>
      
      {/* 当前状态显示 */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <strong>当前主题:</strong> {theme}
        </div>
        <div>
          <strong>解析主题:</strong> {resolvedTheme}
        </div>
        <div>
          <strong>系统主题:</strong> {systemTheme}
        </div>
        <div>
          <strong>HTML 类:</strong> {document.documentElement.className}
        </div>
      </div>

      {/* 主题切换按钮测试 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          主题切换按钮
        </h3>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            点击按钮测试主题切换
          </span>
        </div>
      </div>

      {/* 手动测试按钮 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          自动化测试
        </h3>
        <div className="flex gap-2">
          <button
            onClick={runTests}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            运行主题切换测试
          </button>
          <button
            onClick={testLocalStorage}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            测试持久化存储
          </button>
          <button
            onClick={testSystemTheme}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
          >
            测试系统主题检测
          </button>
        </div>
      </div>

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            测试结果
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {result}
              </div>
            ))}
          </div>
          <button
            onClick={() => setTestResults([])}
            className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            清除结果
          </button>
        </div>
      )}

      {/* 样式测试区域 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          样式测试区域
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">
            主要颜色测试
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
            次要颜色测试
          </div>
          <div className="p-4 bg-muted text-muted-foreground rounded-lg">
            静音颜色测试
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded-lg">
            强调颜色测试
          </div>
        </div>
      </div>
    </div>
  );
}