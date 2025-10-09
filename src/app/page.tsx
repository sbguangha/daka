'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { TimesheetClient } from '@/components/timesheet/timesheet-client';
import { LandingPageContent } from '@/components/timesheet/landing-page-content';
import { DataManager } from '@/components/timesheet/data-manager';
import { AnalyticsTest } from '@/components/analytics/analytics-test';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { MigrationModal } from '@/components/modals/migration-modal';
import { useMigrationPrompt } from '@/hooks/use-migration-prompt';
import { ResourcesSection } from '@/components/layout/resources-section';
import { EnhancedBreadcrumbs } from '@/components/layout/breadcrumbs-enhanced';

export default function HomePage() {
  const {
    shouldShowMigration,
    setShouldShowMigration
  } = useMigrationPrompt();

  // SEO optimization
  useEffect(() => {
    document.title = "Ultimate Habit Tracker - Build Better Habits That Stick | LoopHabits";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Transform your life with our visual habit tracker. Track daily habits, build streaks, and achieve your goals with the most intuitive habit tracking tool. Start free today!'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Transform your life with our visual habit tracker. Track daily habits, build streaks, and achieve your goals with the most intuitive habit tracking tool. Start free today!';
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content',
        'habit tracker, daily planner, productivity app, habit building, time management, daily routine, goal tracking, habit formation, streak tracking, personal development'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'habit tracker, daily planner, productivity app, habit building, time management, daily routine, goal tracking, habit formation, streak tracking, personal development';
      document.head.appendChild(meta);
    }

    // Add Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = 'Ultimate Habit Tracker - Build Better Habits That Stick';
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = 'Visual habit tracking made simple. Join thousands building better habits with our intuitive tracker.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Content */}
        <main className="w-full px-0 py-8">

          {/* Timesheet Client Component */}
          <TimesheetClient />

          {/* Landing Page Content */}
          <LandingPageContent />

          {/* Resources Section */}
          <ResourcesSection />
        </main>

        {/* Data Management */}
        <DataManager />

        {/* Analytics Test (Development Only) */}
        {process.env.NODE_ENV === 'development' && <AnalyticsTest />}

        {/* Migration Modal */}
        <MigrationModal
          open={shouldShowMigration}
          onOpenChange={setShouldShowMigration}
        />
      </div>
    </AuthWrapper>
  );
}
