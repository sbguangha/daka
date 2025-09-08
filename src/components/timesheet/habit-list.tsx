'use client';

import { Plus } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

interface HabitListProps {
  onAddHabit: () => void;
}

export function HabitList({ onAddHabit }: HabitListProps) {
  const { timesheetData } = useAppStore();

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
