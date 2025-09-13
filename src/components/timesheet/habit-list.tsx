'use client';

import { Plus } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { HabitNameViewer } from '@/components/ui/habit-name-viewer';

interface HabitListProps {
  onAddHabit: () => void;
  mobile?: boolean;
}

export function HabitList({ onAddHabit, mobile = false }: HabitListProps) {
  const { timesheetData } = useAppStore();

  if (mobile) {
    // Mobile layout - 紧凑的习惯名称列表，与网格行对齐
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Habit Names Header */}
        <div className="px-2 py-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
            Habits
          </div>
        </div>

        {/* Mobile Habit Names */}
        <div className="flex-1">
          {timesheetData.habits.map((habit) => (
            <div
              key={habit.id}
              className="px-2 py-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              style={{ height: '32px' }} // 与网格行高度对齐
            >
              <div className="flex items-center h-full">
                <HabitNameViewer
                  name={habit.name}
                  color={habit.color}
                  maxLength={12}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Add Button */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onAddHabit}
            className="w-full flex items-center justify-center px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <Plus className="h-3 w-3 mr-1" />
            <span>New</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout - 保持原有布局
  return (
    <div className="h-full flex flex-col">
      {/* Habit List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="py-0">
          {timesheetData.habits.map((habit) => (
            <li key={habit.id} className="px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
              <div className="flex items-center">
                <div
                  className="w-1 h-8 rounded-full mr-3"
                  style={{ backgroundColor: habit.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {habit.name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Habit Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onAddHabit}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Habit</span>
        </button>
      </div>
    </div>
  );
}
