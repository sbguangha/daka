'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectBrowserSupport, applyCompatibilityFixes } from '@/utils/browser-compatibility';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const variantClasses = {
  default: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  outline: 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800',
};

export function ThemeToggle({ 
  className, 
  size = 'md', 
  variant = 'default' 
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // 避免水合错误和兼容性检查
  useEffect(() => {
    setMounted(true);
    
    // 在开发环境下检查兼容性
    if (process.env.NODE_ENV === 'development') {
      const support = detectBrowserSupport();
      if (!support.cssVariables || !support.classList) {
        console.warn('Theme toggle may not work correctly in this browser');
      }
    }
    
    // 应用兼容性修复
    applyCompatibilityFixes();
  }, []);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleThemeToggle}
      className={cn(
        'rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      suppressHydrationWarning
    >
      <div className={cn('relative', iconSizeClasses[size])}>
        {!mounted ? (
          // 防止水合错误的占位符
          <div className={iconSizeClasses[size]} />
        ) : (
          <>
            <Sun 
              className={cn(
                iconSizeClasses[size],
                'absolute inset-0 text-gray-600 dark:text-gray-300 transition-all duration-300',
                resolvedTheme === 'dark' 
                  ? 'rotate-0 scale-100 opacity-100' 
                  : 'rotate-90 scale-0 opacity-0'
              )} 
            />
            <Moon 
              className={cn(
                iconSizeClasses[size],
                'absolute inset-0 text-gray-600 dark:text-gray-300 transition-all duration-300',
                resolvedTheme === 'dark' 
                  ? '-rotate-90 scale-0 opacity-0' 
                  : 'rotate-0 scale-100 opacity-100'
              )} 
            />
          </>
        )}
      </div>
    </button>
  );
}