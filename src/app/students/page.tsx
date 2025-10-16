import type { Metadata } from 'next';
import {
  StudentHeroSection,
  EssentialHabitsSection,
  HabitsWithoutOverwhelm,
  FreeToolsSection,
  SuccessStoriesSection,
  FinalCTASection,
} from './page-content';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Habit Tracker for Students',
  description:
    'Struggling with focus or all-nighters? Track student habits like study blocks, sleep, and morning routines—free, no signup required.',
  keywords:
    'habit tracker for students,  focus tracker, morning routine, student life, academic success',
  openGraph: {
    title: 'Habit Tracker for Students – Free Focus & Study Routine Tool',
    description:
      'Struggling with focus or all-nighters? Track student habits like study blocks, sleep, and morning routines—free, no signup required.',
    url: 'https://www.habittracker.life/students/',
  },
  alternates: {
    canonical: 'https://www.habittracker.life/students/',
  },
};

export default function StudentHabitTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <StudentHeroSection />
      <EssentialHabitsSection />
      <HabitsWithoutOverwhelm />
      <FreeToolsSection />
      <SuccessStoriesSection />
      <FinalCTASection />
    </div>
  );
}
