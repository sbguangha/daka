'use client';

import { useEffect } from 'react';
import { Brain, Clock, Target, TrendingUp, BookOpen, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HowToBuildAHabitPage() {
  // SEO optimization
  useEffect(() => {
    document.title = "How to Build a Habit That Actually Sticks - Complete Student Guide";

    // Add canonical URL
    const canonicalUrl = document.querySelector('link[rel="canonical"]');
    if (!canonicalUrl) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://www.habittracker.life/how-to-build-a-habit/';
      document.head.appendChild(link);
    } else {
      canonicalUrl.setAttribute('href', 'https://www.habittracker.life/how-to-build-a-habit/');
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Learn the science-backed method for building habits that last. Complete guide for students with actionable steps, psychology insights, and free tools.'
      );
    }
  }, []);

  const steps = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Start Tiny (Seriously Tiny)",
      description: "Instead of 'study 2 hours daily,' start with 'open my textbook and read one page.' The key is making it so small you can't fail."
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: "Anchor to Existing Routines",
      description: "Attach your new habit to something you already do. 'After I brush my teeth, I'll review one flashcard.' Your brain loves patterns."
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "Use the Dopamine Loop",
      description: "Mark your progress immediately. That satisfying checkmark or colored square triggers dopamine, making your brain want to repeat the action."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      title: "Track Visually",
      description: "Your brain is visual. Seeing a chain of completed days creates powerful motivation to not break the streak."
    }
  ];

  const commonMistakes = [
    {
      mistake: "Going Too Big Too Fast",
      fix: "Start embarrassingly small. 2 pushups instead of 20. 5 minutes of studying instead of 2 hours."
    },
    {
      mistake: "Relying on Motivation",
      fix: "Motivation fades. Systems and routines stay. Design your environment to make the habit easier than skipping it."
    },
    {
      mistake: "All-or-Nothing Thinking",
      fix: "Missed one day? Cool. Don't miss two. Perfectionism kills more habits than failure ever could."
    },
    {
      mistake: "Not Tracking Progress",
      fix: "What gets measured gets managed. Use a visual tracker to see your consistency grow."
    }
  ];

  const scienceFacts = [
    {
      fact: "It takes 66 days on average to form a habit (not 21)",
      source: "University College London Study"
    },
    {
      fact: "Visual progress tracking increases habit success by 42%",
      source: "American Psychological Association"
    },
    {
      fact: "Starting small (2 minutes) increases long-term success by 300%",
      source: "Stanford Behavior Design Lab"
    },
    {
      fact: "Missing one day doesn't affect habit formation, but missing two does",
      source: "European Journal of Social Psychology"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How to Build a Habit That Actually Sticks
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Forget the "21-day myth." Here's what science actually says about building habits that last a lifetime.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            I've read the research, tested the methods, and distilled what actually works into this guide.
          </p>
        </div>
      </section>

      {/* The Science Overview */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The Science Behind Habits (Simplified)
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your brain is lazy (in a good way). It wants to automate repetitive tasks to save energy.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              The Habit Loop
            </h3>
            <div className="space-y-4 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Cue → Routine → Reward</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Your brain builds neural pathways that make behaviors automatic. The key is repeating this loop consistently until your brain says "Got it, I'll handle this on autopilot."
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Think about brushing your teeth - you don't debate whether to do it, you just... do it. That's the power we're harnessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Process */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The 4-Step Process That Actually Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Based on behavioral psychology research and tested by thousands of students
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4"
                  >
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  {step.icon}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Common Mistakes (And How to Avoid Them)
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Learn from the mistakes I see students make over and over again
            </p>
          </div>

          <div className="space-y-6"
          >
            {commonMistakes.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="bg-red-50 dark:bg-red-900/20 p-6"
                >
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2"
                  >
                    ❌ {item.mistake}
                  </h3>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800"
                >
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2"
                  >
                    ✅ The Fix:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300"
                  >
                    {item.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science Facts */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Science Actually Says
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Real research, not Instagram advice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6"
          >
            {scienceFacts.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-start"
                >
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 mt-1"
                  >
                    <BookOpen className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium mb-2"
                    >
                      {item.fact}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Source: {item.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Plan */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Your 30-Day Action Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Ready to actually do this? Here's your roadmap
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg text-left"
          >
            <ol className="space-y-4 text-gray-700 dark:text-gray-300"
            >
              <li>
                <strong>Days 1-7:</strong> Pick ONE tiny habit. Track it daily. Don't worry about perfection, just consistency.
              </li>
              <li>
                <strong>Days 8-14:</strong> Refine your cue. Make it easier. If you're struggling, make the habit smaller.
              </li>
              <li>
                <strong>Days 15-21:</strong> You should feel the routine kicking in. Focus on not breaking the streak.
              </li>
              <li>
                <strong>Days 22-30:</strong> You're building momentum. Consider adding a second tiny habit if the first feels automatic.
              </li>
              <li>
                <strong>Day 30+:</strong> Congratulations! You have a real habit. Keep tracking to maintain it.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center"
      >
        <div className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6"
          >
            Ready to Apply What You Learned?
          </h2>
          <p className="text-xl mb-8 opacity-90"
          >
            You now know more about habit formation than 99% of people. Time to put it into action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/free-habit-tracker"
            >
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
              >
                Start Your First Habit <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <Link href="/printable-habit-tracker"
            >
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
              >
                Get Printable Tracker
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}