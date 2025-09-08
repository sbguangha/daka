'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: 'color1', value: '#22c55e' }, // green-500
  { name: 'color2', value: '#3b82f6' }, // blue-500
  { name: 'color3', value: '#f59e0b' }, // amber-500
  { name: 'color4', value: '#ef4444' }, // red-500
  { name: 'color5', value: '#8b5cf6' }, // violet-500
  { name: 'color6', value: '#06b6d4' }, // cyan-500
  { name: 'color7', value: '#f97316' }, // orange-500
  { name: 'color8', value: '#ec4899' }, // pink-500
  { name: 'color9', value: '#84cc16' }, // lime-500
  { name: 'color10', value: '#6366f1' }, // indigo-500
];

export function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const { addHabit } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (habitName.trim()) {
      addHabit(habitName.trim(), selectedColor.value);
      setHabitName('');
      setSelectedColor(PRESET_COLORS[0]);
      onClose();
    }
  };

  const handleClose = () => {
    setHabitName('');
    setSelectedColor(PRESET_COLORS[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add New Habit
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Habit Name */}
            <div>
              <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                id="habitName"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="Enter habit name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                autoFocus
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((colorObj) => (
                  <div key={colorObj.name} className="text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedColor(colorObj)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor.name === colorObj.name
                          ? 'border-gray-400 scale-110'
                          : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorObj.value }}
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {colorObj.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</div>
              <div className="flex items-center">
                <div
                  className="w-1 h-6 rounded-full mr-3"
                  style={{ backgroundColor: selectedColor.value }}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {habitName || 'Habit Name'} ({selectedColor.name})
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!habitName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
