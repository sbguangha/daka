'use client';

import { useState } from 'react';
import { Download, Printer } from 'lucide-react';

type Template = {
  name: string;
  description: string;
  habits: string[];
};

type TemplateKey = 'student' | 'minimal' | 'monthly';

const templates: Record<TemplateKey, Template> = {
  student: {
    name: 'Student Edition',
    description: 'Perfect for tracking study habits, sleep schedule, and academic goals',
    habits: ['Study 2 Hours', 'Sleep by 11pm', 'Exercise 30min', 'Read 20 Pages'],
  },
  minimal: {
    name: 'Minimalist',
    description: 'Clean, simple design that works for any habit tracking need',
    habits: ['Morning Routine', 'Exercise', 'Reading', 'Meditation'],
  },
  monthly: {
    name: 'Monthly Overview',
    description: '30-day view perfect for building long-term habits',
    habits: ['Daily Habit 1', 'Daily Habit 2', 'Daily Habit 3', 'Daily Habit 4'],
  },
};

const previewDays = Array.from({ length: 31 }, (_, i) => i + 1);

export function PrintableTemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('student');

  const handleDownload = () => {
    alert('PDF download would start here - template ready for printing!');
  };

  const handlePrint = () => {
    window.print();
  };

  const template = templates[selectedTemplate];

  return (
    <>
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
            {Object.entries(templates).map(([key, tpl]) => (
              <button
                key={key}
                type="button"
                className={`text-left p-6 rounded-lg border-2 transition-all ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(key as TemplateKey)}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tpl.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tpl.description}</p>
                <div className="space-y-1">
                  {tpl.habits.map((habit, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      {habit}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Preview Your Template</h2>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg mb-8">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">{template.name}</h3>

              <div className="grid grid-cols-8 gap-2 mb-6">
                <div />
                {previewDays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {template.habits.map((habit, index) => (
                <div key={index} className="grid grid-cols-8 gap-2 mb-4">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    {habit}
                  </div>
                  {previewDays.map(day => (
                    <div
                      key={day}
                      className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
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

      <section id="download" className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Download Your Template</h2>
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
    </>
  );
}
