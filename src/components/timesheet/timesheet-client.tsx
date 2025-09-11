'use client';

import { useState, useEffect, useCallback } from 'react';
import { HabitList } from '@/components/timesheet/habit-list';
import { DateHeader } from '@/components/timesheet/date-header';
import { HabitGrid } from '@/components/timesheet/habit-grid';
import { StatsPanel } from '@/components/timesheet/stats-panel';
import { AddHabitModal } from '@/components/timesheet/add-habit-modal';
import { BottomStats } from '@/components/timesheet/bottom-stats';
import { useAppStore } from '@/store/app-store';

export function TimesheetClient() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    loadStoredData,
    isAuthenticated,
    syncWithAPI,
    loadTasksFromAPI
  } = useAppStore();

  // 数据刷新函数 - 添加防抖机制
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      console.log('🔄 开始刷新数据...');
      await Promise.all([
        loadTasksFromAPI(),
        syncWithAPI()
      ]);
      console.log('✅ 数据刷新完成');
    } catch (error) {
      console.error('❌ 自动刷新数据失败:', error);
    }
  }, [isAuthenticated, loadTasksFromAPI, syncWithAPI]);

  // 初始化数据 - 只在组件挂载时执行一次
  useEffect(() => {
    const initializeData = async () => {
      setIsClient(true);
      try {
        console.log('🔄 开始初始化数据加载...');

        if (isAuthenticated) {
          // 已登录用户：优先从API加载最新数据
          console.log('👤 用户已登录，从API加载数据...');
          await Promise.all([
            loadTasksFromAPI(),
            syncWithAPI()
          ]);
          console.log('✅ API数据加载完成');
        } else {
          // 未登录时从本地存储加载
          console.log('📱 用户未登录，从本地存储加载数据...');
          await loadStoredData();
          console.log('✅ 本地数据加载完成');
        }
      } catch (error) {
        console.error('❌ 初始化数据加载失败:', error);
        // 如果API失败，回退到本地存储
        if (isAuthenticated) {
          try {
            console.log('🔄 API失败，回退到本地存储...');
            await loadStoredData();
            console.log('✅ 本地数据加载完成（回退）');
          } catch (localError) {
            console.error('❌ 本地数据加载也失败:', localError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []); // 空依赖数组，只在挂载时执行一次

  // 页面可见性变化时刷新数据
  useEffect(() => {
    if (!isClient || !isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 页面变为可见时刷新数据
        console.log('📱 页面变为可见，刷新数据...');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isClient, isAuthenticated, refreshData]);

  // 设置定时刷新 - 暂时禁用以解决频繁请求问题
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('🔄 认证状态已更新，但定时刷新已禁用');

    // 暂时注释掉定时刷新，避免频繁API调用
    // const refreshInterval = setInterval(() => {
    //   console.log('⏰ 定时刷新数据...');
    //   refreshData();
    // }, 30000);

    // 监听标签页切换事件 - 保留这个功能
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        console.log('👁️ 标签页重新可见，刷新数据...');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数
    return () => {
      console.log('🧹 清理事件监听器');
      // clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, refreshData]); // 添加 refreshData 依赖

  if (!isClient || isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isClient ? 'Initializing...' : 'Loading your habits...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Date Header */}
      <DateHeader />
      
      {/* Main Grid Layout */}
      <div className="flex">
        {/* Left: Habit List */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700">
          <HabitList onAddHabit={() => setShowAddModal(true)} />
        </div>
        
        {/* Center: Habit Grid */}
        <div className="flex-1">
          <HabitGrid />
        </div>
        
        {/* Right: Stats Panel */}
        <div className="w-48 border-l border-gray-200 dark:border-gray-700">
          <StatsPanel />
        </div>
      </div>

      {/* Bottom Stats */}
      <BottomStats />

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
