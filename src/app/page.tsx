'use client';

import { Header } from '@/components/layout/header';
import { ProgressSection } from '@/components/dashboard/progress-section';
import { TasksGrid } from '@/components/dashboard/tasks-grid';
import { DateNavigation } from '@/components/dashboard/date-navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Section */}
        <ProgressSection />

        {/* Date Navigation */}
        <DateNavigation />

        {/* Tasks Grid */}
        <TasksGrid />
      </main>
    </div>
  );
}
