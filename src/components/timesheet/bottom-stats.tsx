'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';

export function BottomStats() {
  const { timesheetData } = useAppStore();

  // 生成最近20天的日期
  const dates = useMemo(() => {
    const today = new Date();
    const dateList = [];
    
    for (let i = 19; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateList.push(date.toISOString().split('T')[0]);
    }
    
    return dateList;
  }, []);

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  // 计算每天的完成数量
  const getDayCompletionCount = (date: string) => {
    return timesheetData.records.filter(
      r => r.date === date && r.completed
    ).length;
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex">
        {/* Left spacer for habit list */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Daily Counts
          </div>
        </div>

        {/* Daily counts */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed">
            <tbody>
              <tr>
                {dates.map((date, index) => (
                  <td
                    key={index}
                    className={`p-2 text-center border-r border-gray-200 dark:border-gray-700 ${
                      isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium ${
                      isToday(date)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {getDayCompletionCount(date)}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right spacer for stats */}
        <div className="w-48 border-l border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-center">
            {/* Slider placeholder */}
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="w-0 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
