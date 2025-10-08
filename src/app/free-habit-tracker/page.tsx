'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Zap, Star, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FreeHabitTrackerPage() {
  const [demoHabits, setDemoHabits] = useState([
    { id: 1, name: 'Study 2 Hours', color: '#3b82f6', completed: [true, true, false, true, false, false, false] },
    { id: 2, name: 'Sleep by 11pm', color: '#8b5cf6', completed: [true, false, true, true, false, true, false] },
    { id: 3, name: 'Exercise 30min', color: '#10b981', completed: [false, true, true, false, true, false, false] }
  ]);

  const toggleDay = (habitId: number, dayIndex: number) => {
    setDemoHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...habit, completed: newCompleted };
      }
      return habit;
    }));
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // SEO optimization
  useEffect(() => {
    document.title = "Free Habit Tracker - No Signup Required | Start Tracking Instantly";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Track your habits instantly with our free habit tracker. No signup required. Click to mark complete, build streaks, and achieve your goals today.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Free Habit Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            No signup. No email. No credit card. Just click and start tracking your habits instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Zap className="w-5 h-5" />
              <span>Works Instantly</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5" />
              <span>30 Second Setup</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Star className="w-5 h-5" />
              <span>100% Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tracker */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Try It Right Now
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Click any square to mark a habit as complete. Your progress is saved automatically in your browser.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 w-48">Habit</th>
                    {days.map(day => (
                      <th key={day} className="text-center p-2 text-sm text-gray-600 dark:text-gray-400">
                        {day}
                      </th>
                    ))}
                    <th className="text-center p-4">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {demoHabits.map(habit => (
                    <tr key={habit.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {habit.name}
                          </span>
                        </div>
                      </td>
                      {habit.completed.map((completed, dayIndex) => (
                        <td key={dayIndex} className="p-2">
                          <button
                            onClick={() => toggleDay(habit.id, dayIndex)}
                            className={`w-8 h-8 rounded transition-all duration-200 ${
                              completed
                                ? 'shadow-md transform scale-105'
                                : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                            style={{
                              backgroundColor: completed ? habit.color : undefined
                            }}
                          />
                        </td>
                      ))}
                      <td className="p-4 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {habit.completed.filter(Boolean).length}/7
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ✨ This is a demo! Your real tracker will be saved automatically and you can add unlimited habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Students Love Our Free Tracker
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900">
              <div className="flex justify-center mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Instant Setup
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No signup forms, no email verification. Just click and track.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900">
              <div className="flex justify-center mb-4">
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Visual Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Beautiful color grids that make progress satisfying to see.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900">
              <div className="flex justify-center mb-4">
                <Clock className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Auto-Save
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your progress is saved automatically in your browser.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900">
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">∞</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Unlimited
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Track as many habits as you want, forever free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Better Habits?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've already started their habit journey. No excuses - it's completely free!
          </p>
          <Link href="/">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto">
              Start Tracking Now <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}