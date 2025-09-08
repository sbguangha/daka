'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  BarChart3,
  User,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { EncouragementCard } from '@/components/ui/hover-card';
import { useAppStore } from '@/store/app-store';

export function Header() {
  const [theme, setTheme] = useState('light');
  const { currentDate, setCurrentDate, streak } = useAppStore();
  const pathname = usePathname();
  const user = null; // 暂时没有用户

  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const today = new Date();

    // 不能选择未来的日期
    if (nextDay <= today) {
      setCurrentDate(nextDay);
    }
  };

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* 左侧：标题、导航和日期导航 */}
          <div className="flex items-center space-x-6">
            {/* 导航链接 */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className={`text-xl font-semibold transition-colors ${
                  pathname === '/'
                    ? 'text-blue-600'
                    : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                每日打卡
              </Link>
              <Link
                href="/timesheet"
                className={`flex items-center space-x-1 text-lg font-medium transition-colors ${
                  pathname === '/timesheet'
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Timesheet</span>
              </Link>
            </div>

            {/* 日期导航 - 只在主页显示 */}
            {pathname === '/' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevDay}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

                <p className="text-sm text-gray-600 min-w-[120px] text-center">
                  {formatDate(currentDate)}
                </p>

                <button
                  onClick={handleNextDay}
                  disabled={isToday()}
                  className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* 中间：Hover Card - 只在主页显示 */}
          {pathname === '/' && (
            <div className="flex-1 flex justify-center">
              <EncouragementCard />
            </div>
          )}

          {/* Timesheet 页面的标题区域 */}
          {pathname === '/timesheet' && (
            <div className="flex-1 flex justify-center">
              <h2 className="text-lg font-medium text-gray-700">习惯追踪</h2>
            </div>
          )}

          {/* 右侧：连续打卡和按钮组 */}
          <div className="flex items-center space-x-4">
            {/* 连续打卡统计 */}
            <div className="text-right">
              <p className="text-sm text-gray-600">连续打卡</p>
              <p className="text-2xl font-semibold text-blue-600">{streak}</p>
            </div>

            {/* 按钮组 */}
            <div className="flex items-center space-x-2">
              {/* 数据同步按钮 */}
              <button
                className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                title="数据同步"
              >
                <Cloud className="h-5 w-5 text-green-600" />
              </button>

              {/* 用户登录按钮 */}
              <button
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                title="用户登录"
              >
                <User className="h-5 w-5 text-blue-600" />
              </button>

              {/* 统计按钮 */}
              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="查看统计"
              >
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </button>

              {/* 主题切换按钮 */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="切换主题"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-600" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
