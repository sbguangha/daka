'use client';

import { useAppStore } from '@/store/app-store';

export function DateNavigation() {
  const { currentDate } = useAppStore();

  const getDateStatus = () => {
    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();

    if (isToday) {
      return '今天';
    }

    const diffTime = today.getTime() - currentDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '昨天';
    if (diffDays === -1) return '明天';
    if (diffDays > 0) return `${diffDays}天前`;
    return `${Math.abs(diffDays)}天后`;
  };

  return (
    <div className="mb-4 text-center">
      <p className="text-sm text-gray-600">
        {getDateStatus()}的打卡情况
      </p>
    </div>
  );
}
