'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/app-store';

interface DateHeaderProps {
  mobile?: boolean;
}

export function DateHeader({ mobile = false }: DateHeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { clearTimesheetData } = useAppStore();
  const settingsRef = useRef<HTMLDivElement>(null);

  // Click outside to close settings menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // Generate dates for the last 20 days
  const dates = useMemo(() => {
    const today = new Date();
    const dateList = [];
    
    for (let i = 19; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateList.push(date);
    }
    
    return dateList;
  }, []);

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  if (mobile) {
    // Mobile layout - 只显示日期数字，简化设计
    return (
      <div className="border-b border-gray-200 dark:border-gray-700">
        <table className="w-full table-fixed">
          <tbody>
            <tr>
              {dates.map((date, index) => (
                <td
                  key={index}
                  className={`p-2 text-center border-r border-gray-200 dark:border-gray-700 ${
                    isWeekend(date) ? 'bg-gray-50 dark:bg-gray-800' : ''
                  } ${
                    isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  style={{ minWidth: '32px' }}
                >
                  <div className={`text-sm font-medium ${
                    isToday(date)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {isToday(date) ? (
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-sm">
                        {formatDate(date)}
                      </div>
                    ) : (
                      formatDate(date)
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Desktop layout - 保持原有布局
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex">
        {/* Left spacer for habit list */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all habits and records? This action cannot be undone.')) {
                        clearTimesheetData();
                        setShowSettings(false);
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Clear All Data
                  </button>
                </div>
              )}
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              All Habits
            </div>
          </div>
        </div>

        {/* Date columns */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed">
            <tbody>
              <tr>
                {dates.map((date, index) => (
                  <td
                    key={index}
                    className={`p-2 text-center border-r border-gray-200 dark:border-gray-700 ${
                      isWeekend(date) ? 'bg-gray-50 dark:bg-gray-800' : ''
                    } ${
                      isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {formatMonth(date)}
                    </div>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday(date)
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {isToday(date) ? (
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto">
                          {formatDate(date)}
                        </div>
                      ) : (
                        formatDate(date)
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDay(date)}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right spacer for stats */}
        <div className="w-48 border-l border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>current streak</span>
            <span>longest streak</span>
            <span>total count</span>
          </div>
        </div>
      </div>
    </div>
  );
}
