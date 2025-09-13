'use client';

import { useState, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';

interface HabitNameViewerProps {
  name: string;
  color: string;
  maxLength?: number;
}

export function HabitNameViewer({ name, color, maxLength = 15 }: HabitNameViewerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);

  const isLongName = name.length > maxLength;
  const displayName = isLongName ? `${name.slice(0, maxLength - 3)}...` : name;

  // 长按处理
  const handleTouchStart = () => {
    if (!isLongName) return;
    
    touchStartRef.current = Date.now();
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // 添加触觉反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      // 2秒后自动隐藏
      setTimeout(() => setShowTooltip(false), 2000);
    }, 500); // 500ms长按触发
    
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // 如果是短按（小于500ms），不显示tooltip
    const pressDuration = Date.now() - touchStartRef.current;
    if (pressDuration < 500) {
      setShowTooltip(false);
    }
  };

  // 点击图标显示模态框
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <div className="relative flex items-center w-full">
      {/* 颜色指示器 */}
      <div 
        className="w-1 h-6 rounded-full mr-2 flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      
      {/* 习惯名称区域 */}
      <div 
        className="flex-1 min-w-0 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <p className="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight">
          {displayName}
        </p>
        
        {/* 长按提示Toast */}
        {showTooltip && (
          <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
            {name}
            <div className="absolute bottom-full left-2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-900"></div>
          </div>
        )}
      </div>
      
      {/* 更多图标 */}
      {isLongName && (
        <button
          onClick={handleIconClick}
          className="ml-1 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          aria-label="View full habit name"
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>
      )}
      
      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm w-full">
            <div className="flex items-center mb-3">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: color }}
              />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Habit Name
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 break-words">
              {name}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
