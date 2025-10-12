'use client';

import { useEffect, useState } from 'react';
import { Download, Printer, Star, Calendar, CheckCircle } from 'lucide-react';

type Template = {
  name: string;
  description: string;
  habits: string[];
  preview: string;
};

type TemplateKey = 'student' | 'minimal' | 'monthly';

type TemplateMap = Record<TemplateKey, Template>;

export default function PrintableHabitTrackerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('student');
  const [previewHabits, setPreviewHabits] = useState([
    'Study 2 Hours',
    'Sleep by 11pm',
    'Exercise 30min',
    'Read 20 Pages'
  ]);

  // SEO optimization
  useEffect(() => {
    document.title = "Free Printable Habit Tracker PDF - Download & Print Instantly";

    // Add canonical URL
    const canonicalUrl = document.querySelector('link[rel="canonical"]');
    if (!canonicalUrl) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://www.habittracker.life/printable-habit-tracker/';
      document.head.appendChild(link);
    } else {
      canonicalUrl.setAttribute('href', 'https://www.habittracker.life/printable-habit-tracker/');
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Download free printable habit tracker PDF templates. Perfect for students, bullet journals, and wall tracking. Monthly, weekly, and student-focused designs.'
      );
    }
  }, []);

  const templates: TemplateMap = {
    student: {
      name: "Student Edition",
      description: "Perfect for tracking study habits, sleep schedule, and academic goals",
      habits: ['Study 2 Hours', 'Sleep by 11pm', 'Exercise 30min', 'Read 20 Pages'],
      preview: "/api/placeholder/400/600"
    },
    minimal: {
      name: "Minimalist",
      description: "Clean, simple design that works for any habit tracking need",
      habits: ['Morning Routine', 'Exercise', 'Reading', 'Meditation'],
      preview: "/api/placeholder/400/600"
    },
    monthly: {
      name: "Monthly Overview",
      description: "30-day view perfect for building long-term habits",
      habits: ['Daily Habit 1', 'Daily Habit 2', 'Daily Habit 3', 'Daily Habit 4'],
      preview: "/api/placeholder/400/600"
    }
  };

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF URL
    link.download = `habit-tracker-${selectedTemplate}.pdf`;
    // link.click(); // Commented out for demo
    alert('PDF download would start here - template ready for printing!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
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
        </div>
      </section>

      {/* Template Selection */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Template
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Pick the design that fits your style and tracking needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {(Object.entries(templates) as [TemplateKey, Template][]).map(([key, template]) => (
              <div
                key={key}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(key)}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                <div className="space-y-1">
                  {template.habits.map((habit: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      {habit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Preview Your Template
          </h2>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg mb-8">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                {templates[selectedTemplate].name}
              </h3>

              <div className="grid grid-cols-8 gap-2 mb-6">
                <div></div> {/* Empty corner */}
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {templates[selectedTemplate].habits.map((habit: string, habitIndex: number) => (
                <div key={habitIndex} className="grid grid-cols-8 gap-2 mb-4"
                >
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    {habit}
                  </div>
                  {Array.from({ length: 31 }, (_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8">
            This is what your printed tracker will look like. Perfect for sticking on your dorm wall, bullet journal, or workspace.
          </p>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Download Your Template
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Get your free PDF instantly. Print as many copies as you need!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>

            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Now
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Files are PDF format, ready for standard 8.5x11" paper
          </p>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Pro Tips for Using Your Printable Tracker
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 mt-1"
                >
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
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 mt-1"
                >
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
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4 mt-1"
                >
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Start Small
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Don't try to track 10 habits at once. Start with 2-3 and add more as they become automatic.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4 mt-1"
                >
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

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Go Old School?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sometimes the best productivity hack is the simplest one. Print your tracker and start building habits that stick.
          </p>
          <button
            onClick={handleDownload}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto"
          >
            <Download className="mr-2 w-5 h-5" />
            Download Your Free Template
          </button>
        </div>
      </section>
    </div>
  );
}