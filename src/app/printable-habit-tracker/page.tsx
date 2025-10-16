import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Calendar, Star } from 'lucide-react';
import dynamicImport from 'next/dynamic';

const PrintableTemplateSelector = dynamicImport(
  () => import('./template-selector').then(mod => mod.PrintableTemplateSelector),
  { ssr: false },
);

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free Printable Habit Tracker PDF - Download',
  description:
    'Download free printable habit tracker PDF templates. Perfect for students, bullet journals, and wall tracking. Monthly, weekly, and student-focused designs.',
  keywords:
    'printable habit tracker, habit tracker pdf, habit tracker template, bullet journal habit tracker',
  openGraph: {
    title: 'Free Printable Habit Tracker PDF - Download & Print Instantly',
    description:
      'Download free printable habit tracker PDF templates. Perfect for students, bullet journals, and wall tracking. Monthly, weekly, and student-focused designs.',
    url: 'https://www.habittracker.life/printable-habit-tracker/',
  },
  alternates: {
    canonical: 'https://www.habittracker.life/printable-habit-tracker/',
  },
};

export default function PrintableHabitTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Free Printable Habit Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Download, print, and stick on your wall. Sometimes the old-school approach works best for building habits that stick.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
              <span>Multiple Templates</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Star className="w-5 h-5" />
              <span>100% Free</span>
            </div>
          </div>

          <Link
            href="#download"
            className="inline-flex items-center bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Jump to Downloads
          </Link>
        </div>
      </section>

      <PrintableTemplateSelector />

      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Pro Tips for Using Your Printable Tracker
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Put It Where You Can't Ignore It
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your dorm wall, bathroom mirror, or above your desk. The key is making it impossible to miss.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Use a Marker That Feels Good
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Invest in a nice pen or marker. The physical act of marking completion should feel satisfying.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Start Small</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Don't try to track 10 habits at once. Start with 2-3 and add more as they become automatic.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Celebrate the Streaks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Don't break the chain! The visual progress becomes addictive and motivating.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Go Old School?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sometimes the best productivity hack is the simplest one. Print your tracker and start building habits that stick.
          </p>
          <Link
            href="#download"
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
          >
            Download Your Free Template
          </Link>
        </div>
      </section>
    </div>
  );
}
