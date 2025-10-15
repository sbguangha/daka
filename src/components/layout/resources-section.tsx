import Link from 'next/link';
import { BookOpen, FileText, HelpCircle, Target } from 'lucide-react';

const resources = [
  {
    title: 'How to Build Habits',
    description: 'Science-backed guide to building lasting habits',
    href: '/how-to-build-a-habit.html',
    icon: Target,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    title: 'Habit Tracking Tips',
    description: 'Maximize your habit tracking success',
    href: '/habit-tracking-tips.html',
    icon: BookOpen,
    color: 'text-green-600 bg-green-100',
  },
  {
    title: 'Productivity Guide',
    description: 'Boost your daily productivity',
    href: '/productivity-guide.html',
    icon: FileText,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    title: 'Habit Examples',
    description: '50+ habits you can start today',
    href: '/habit-examples.html',
    icon: HelpCircle,
    color: 'text-orange-600 bg-orange-100',
  },
];

export function ResourcesSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Resources & Guides</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn the science behind habit formation and get the most out of your habit tracking journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link
                key={index}
                href={resource.href}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                  Learn More
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            New to habit tracking? Start with our most popular guide:
          </p>
          <Link
            href="/how-to-build-a-habit.html"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <Target className="w-5 h-5 mr-2" />
            How to Build a Habit That Sticks
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
