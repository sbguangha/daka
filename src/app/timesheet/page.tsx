'use client';

import { Header } from '@/components/layout/header';
import { HabitList } from '@/components/timesheet/habit-list';
import { DateHeader } from '@/components/timesheet/date-header';
import { HabitGrid } from '@/components/timesheet/habit-grid';
import { StatsPanel } from '@/components/timesheet/stats-panel';
import { AddHabitModal } from '@/components/timesheet/add-habit-modal';
import { BottomStats } from '@/components/timesheet/bottom-stats';
import { useState } from 'react';

export default function TimesheetPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full px-0 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Date Header */}
          <DateHeader />
          
          {/* Main Grid Layout */}
          <div className="flex">
            {/* Left: Habit List */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700">
              <HabitList onAddHabit={() => setShowAddModal(true)} />
            </div>
            
            {/* Center: Habit Grid */}
            <div className="flex-1">
              <HabitGrid />
            </div>
            
            {/* Right: Stats Panel */}
            <div className="w-48 border-l border-gray-200 dark:border-gray-700">
              <StatsPanel />
            </div>
          </div>

          {/* Bottom Stats */}
          <BottomStats />
        </div>
      </main>

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
