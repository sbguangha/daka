import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TimesheetClient } from '@/components/timesheet/timesheet-client';
import { ResourcesSection } from '@/components/layout/resources-section';
import { LandingPageContent } from '@/components/timesheet/landing-page-content';
import { LandingPageInteractiveDemo } from '@/components/timesheet/landing-page-interactive-demo';
import { HomePageClientShell } from './_components/home-page-client-shell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ultimate Habit Tracker - Build Better Habits That Stick',
  description:
    'Transform your life with our visual habit tracker. Track daily habits, build streaks, and achieve your goals with the most intuitive habit tracking tool.',
  keywords:
    'habit tracker, daily planner, habit building, daily routine, goal tracking, habit formation, personal development',
  openGraph: {
    title: 'Ultimate Habit Tracker - Build Better Habits That Stick',
    description:
      'Visual habit tracking made simple. Join thousands building better habits with our intuitive tracker.',
    url: 'https://www.habittracker.life/',
  },
  alternates: {
    canonical: 'https://www.habittracker.life/',
  },
};

const AnalyticsTest = dynamicImport(
  () => import('@/components/analytics/analytics-test').then(mod => mod.AnalyticsTest),
  {
    ssr: false,
  }
);

export default function HomePage() {
  return (
    <HomePageClientShell>
      <div className="space-y-16">
        <Suspense fallback={null}>
          <TimesheetClient />
        </Suspense>
        <LandingPageContent />
        <LandingPageInteractiveDemo />
        <ResourcesSection />
      </div>
    </HomePageClientShell>
  );
}
