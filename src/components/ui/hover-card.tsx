'use client';

import { useState } from 'react';

// 简化的鼓励卡片组件
export const EncouragementCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        className="cursor-pointer text-2xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        @加油！
      </span>

      {isHovered && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex justify-between gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img
                  src="https://github.com/vercel.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium" style={{display: 'none'}}>
                  VC
                </div>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-semibold text-gray-900">坚持打卡，未来有光！</h4>
              <p className="text-sm text-gray-600">
                每天打卡的你，正悄悄把 "想做" 活成 "做到"，超棒的！ by @葛勇攀.
              </p>
              <div className="text-xs text-gray-500">
                Joined 8月 2025年
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
