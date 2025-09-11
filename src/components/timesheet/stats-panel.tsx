'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export function StatsPanel() {
  const { timesheetData, getHabitStats } = useAppStore();
  const [isHabitStatsCollapsed, setIsHabitStatsCollapsed] = useState(false);

  // Calculate overall statistics
  const getTotalStats = () => {
    if (timesheetData.habits.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalCount: 0 };
    }

    const allStats = timesheetData.habits.map(habit => getHabitStats(habit.id));
    
    return {
      currentStreak: Math.max(...allStats.map(s => s.currentStreak), 0),
      longestStreak: Math.max(...allStats.map(s => s.longestStreak), 0),
      totalCount: allStats.reduce((sum, s) => sum + s.totalCount, 0)
    };
  };

  const totalStats = getTotalStats();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Statistics
        </h3>
      </div>

      {/* Overall Stats */}
      <div className="p-4 space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalStats.currentStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Current Streak
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalStats.longestStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Longest Streak
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalStats.totalCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Count
          </div>
        </div>
      </div>

      {/* Individual Habit Stats - Compact Grid */}
      {timesheetData.habits.length > 0 && (
        <>
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                By Habit ({timesheetData.habits.length})
              </h4>
              <button
                onClick={() => setIsHabitStatsCollapsed(!isHabitStatsCollapsed)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isHabitStatsCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {!isHabitStatsCollapsed && (
            <div className="px-4 pb-4">
              {/* 固定高度容器，最多显示4个卡片（2行 x 2列），超出则滚动 */}
              <div 
                className="overflow-y-auto custom-scrollbar"
                style={{ 
                  maxHeight: timesheetData.habits.length > 4 ? '280px' : 'auto' 
                }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {timesheetData.habits.map((habit) => {
                    const stats = getHabitStats(habit.id);
                    const completionRate = Math.round((stats.totalCount / 20) * 100);

                    return (
                      <div
                        key={habit.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer group"
                        title={`${habit.name}: ${stats.totalCount}/20 completed, ${stats.currentStreak} day streak`}
                      >
                        {/* Header with color indicator and streak */}
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: habit.color }}
                          />
                          {stats.currentStreak > 0 && (
                            <div className="flex items-center">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span className="text-xs font-medium text-orange-600 dark:text-orange-400 ml-0.5">
                                {stats.currentStreak}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Habit name */}
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate mb-2">
                          {habit.name}
                        </div>

                        {/* Progress info */}
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {stats.totalCount}/20
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                          <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: habit.color,
                              width: `${completionRate}%`,
                              opacity: 0.8
                            }}
                          />
                        </div>

                        {/* Stats row */}
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {completionRate}%
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            L: {stats.longestStreak}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 滚动提示 - 当习惯数量超过4个时显示 */}
              {timesheetData.habits.length > 4 && (
                <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2 opacity-75">
                  Scroll to view more habits ({timesheetData.habits.length} total)
                </div>
              )}
            </div>
          )}

          {isHabitStatsCollapsed && (
            <div className="px-4 pb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                Click to expand habit statistics
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
