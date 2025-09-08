import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short') {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      });
    case 'long':
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    case 'relative':
      const now = new Date();
      const diffTime = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '昨天';
      if (diffDays === -1) return '明天';
      if (diffDays > 0) return `${diffDays}天前`;
      return `${Math.abs(diffDays)}天后`;
    default:
      return d.toLocaleDateString('zh-CN');
  }
}

export function formatDateKey(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function getDateFromKey(dateKey: string) {
  return new Date(dateKey + 'T00:00:00.000Z');
}

export function isToday(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return formatDateKey(d) === formatDateKey(today);
}

export function isSameDay(date1: Date | string, date2: Date | string) {
  return formatDateKey(date1) === formatDateKey(date2);
}

export function addDays(date: Date | string, days: number) {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function calculateProgress(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function calculateStreakDays(history: Record<string, any>, endDate: Date = new Date()) {
  let streak = 0;
  const today = new Date(endDate);
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) { // 最多检查365天
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = formatDateKey(checkDate);
    
    const dayData = history[dateKey];
    if (dayData && Object.keys(dayData).length > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function generateShareText(stats: any) {
  const { totalCheckIns, currentStreak, completionRate } = stats;
  return `我在每日打卡应用中已经完成了 ${totalCheckIns} 次打卡，连续打卡 ${currentStreak} 天，完成率 ${completionRate}%！一起来养成好习惯吧！`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}
