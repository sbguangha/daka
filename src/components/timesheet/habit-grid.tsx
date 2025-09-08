'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';

export function HabitGrid() {
  const { timesheetData, toggleHabitRecord } = useAppStore();

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

  const isWeekend = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getRecordForDate = (habitId: string, date: string) => {
    return timesheetData.records.find(r => r.habitId === habitId && r.date === date);
  };

  const getCellColor = (habitId: string, date: string) => {
    const record = getRecordForDate(habitId, date);
    const habit = timesheetData.habits.find(h => h.id === habitId);

    if (!record || !record.completed) {
      return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600';
    }

    // 如果没有找到习惯，使用默认绿色
    if (!habit) {
      return 'bg-green-500 hover:bg-green-600 border border-green-600';
    }

    // 使用习惯的颜色，根据完成度调整透明度
    const level = record.completionLevel || 100;
    const baseColor = habit.color;

    if (level >= 100) return `border border-gray-300 dark:border-gray-600`;
    if (level >= 75) return `border border-gray-300 dark:border-gray-600`;
    if (level >= 50) return `border border-gray-300 dark:border-gray-600`;
    if (level >= 25) return `border border-gray-300 dark:border-gray-600`;
    return `border border-gray-300 dark:border-gray-600`;
  };

  const getCellStyle = (habitId: string, date: string) => {
    const record = getRecordForDate(habitId, date);
    const habit = timesheetData.habits.find(h => h.id === habitId);

    if (!record || !record.completed || !habit) {
      return {};
    }

    // 使用习惯的颜色，根据完成度调整透明度
    const level = record.completionLevel || 100;
    const baseColor = habit.color;

    if (level >= 100) return { backgroundColor: baseColor };
    if (level >= 75) return { backgroundColor: baseColor, opacity: 0.8 };
    if (level >= 50) return { backgroundColor: baseColor, opacity: 0.6 };
    if (level >= 25) return { backgroundColor: baseColor, opacity: 0.4 };
    return { backgroundColor: baseColor, opacity: 0.2 };
  };

  const handleCellClick = (habitId: string, date: string) => {
    toggleHabitRecord(habitId, date);
  };

  if (timesheetData.habits.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            还没有习惯，点击左侧 "New Habit" 开始添加
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <tbody>
          {timesheetData.habits.map((habit) => (
            <tr key={habit.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              {dates.map((date) => (
                <td
                  key={`${habit.id}-${date}`}
                  className={`h-12 p-1 cursor-pointer transition-colors ${
                    isWeekend(date) ? 'bg-gray-50 dark:bg-gray-800' : ''
                  } ${
                    isToday(date) ? 'ring-2 ring-blue-400 ring-inset' : ''
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-sm ${getCellColor(habit.id, date)} transition-colors`}
                    style={getCellStyle(habit.id, date)}
                    onClick={() => handleCellClick(habit.id, date)}
                    title={`${habit.name} - ${date}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
