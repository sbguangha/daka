'use client';

import { useAppStore } from '@/store/app-store';

export function ProgressSection() {
  const { getTodayProgress } = useAppStore();
  const { completed, total, percentage } = getTodayProgress();

  // 计算进度环的 stroke-dashoffset
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">今日进度</h2>
          <span className="text-sm text-gray-600">
            <span>{completed}</span>/<span>{total}</span>
          </span>
        </div>

        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-blue-600 transition-all duration-500 ease-out"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-900">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
