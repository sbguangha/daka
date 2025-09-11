'use client';

import { useState } from 'react';
import { CheckCircle, Target, TrendingUp, Users, Clock, Zap, Star, ArrowRight } from 'lucide-react';

export function LandingPageContent() {
  return (
    <div className="mt-16 bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Interactive Demo */}
      <InteractiveDemo />
      
      {/* Problem & Solution */}
      <ProblemSolution />
      
      {/* Features Showcase */}
      <FeaturesShowcase />
      
      {/* Target Audience */}
      <TargetAudience />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Transform Your Life with Smart <span className="text-blue-600">Habit Tracking</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Join thousands who've discovered the secret to lasting change. Our visual habit tracker makes building good habits effortless and fun.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center">
            Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">No signup required • Works instantly</p>
        </div>
      </div>
    </section>
  );
}

function InteractiveDemo() {
  const [demoHabits, setDemoHabits] = useState([
    { id: 1, name: 'Morning Exercise', color: '#22c55e', streak: 3, completed: [true, true, true, false, false, false, false] },
    { id: 2, name: 'Read 30 Minutes', color: '#3b82f6', streak: 5, completed: [true, true, false, true, true, false, false] },
    { id: 3, name: 'Drink 8 Glasses Water', color: '#f59e0b', streak: 2, completed: [false, true, true, false, false, false, false] }
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

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            See How Easy It Is
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Try our interactive demo below. Click any square to mark a habit as complete!
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
                  <th className="text-center p-4">Streak</th>
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
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                        🔥 {habit.streak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✨ This is just a preview! The real tracker above has even more features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Why Most People Fail at Building Habits
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 text-sm">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">No Visual Progress</h3>
                  <p className="text-gray-600 dark:text-gray-300">Without seeing your progress, motivation fades quickly.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 text-sm">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Overwhelming Complexity</h3>
                  <p className="text-gray-600 dark:text-gray-300">Most apps are too complicated and time-consuming to use daily.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 text-sm">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Lack of Accountability</h3>
                  <p className="text-gray-600 dark:text-gray-300">It's easy to skip days when no one is watching your progress.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              How Our Habit Tracker Solves This
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Beautiful Visual Grid</h3>
                  <p className="text-gray-600 dark:text-gray-300">See your progress at a glance with our colorful habit grid.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">One-Click Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">Mark habits complete with a single click. No forms, no fuss.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Streak Motivation</h3>
                  <p className="text-gray-600 dark:text-gray-300">Watch your streaks grow and feel motivated to keep going.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesShowcase() {
  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Custom Habit Colors",
      description: "Choose from 10 beautiful colors to organize your habits visually. Each habit gets its own unique identity."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Streak Tracking",
      description: "Watch your consistency grow with automatic streak counting. See your longest streaks and current progress."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "20-Day View",
      description: "Perfect timeframe to see patterns and build momentum. Not too short, not overwhelming."
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      title: "Instant Feedback",
      description: "Click any day to mark complete. Immediate visual feedback keeps you engaged and motivated."
    }
  ];

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Simple, powerful features designed to make habit building effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TargetAudience() {
  const audiences = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Busy Professionals",
      description: "Build productive morning routines, exercise consistently, and maintain work-life balance with simple daily tracking.",
      habits: ["Morning meditation", "Daily exercise", "Reading before bed"]
    },
    {
      icon: <Star className="w-8 h-8 text-green-600" />,
      title: "Students & Learners",
      description: "Develop study habits, track learning goals, and build discipline for academic and personal growth.",
      habits: ["Study 2 hours daily", "Practice language", "Review notes"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Health Enthusiasts",
      description: "Monitor fitness routines, nutrition habits, and wellness practices with visual progress tracking.",
      habits: ["Drink 8 glasses water", "10k steps daily", "Healthy meal prep"]
    }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Perfect for Every Lifestyle
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Whether you're just starting or already on your journey, our habit tracker adapts to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                {audience.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                {audience.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                {audience.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Popular habits:</p>
                {audience.habits.map((habit, habitIndex) => (
                  <div key={habitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
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
  );
}

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does it really take to build a habit?",
      answer: "Research shows it takes an average of 66 days to form a new habit, not the commonly cited 21 days. Our 20-day view helps you see patterns and build momentum during the crucial early stages."
    },
    {
      question: "Why is visual tracking so effective?",
      answer: "Visual progress triggers dopamine release in your brain, the same neurotransmitter involved in habit formation. Seeing your streak grow creates a powerful motivation loop that makes you want to continue."
    },
    {
      question: "What if I miss a day?",
      answer: "Missing one day doesn't ruin your progress! The key is getting back on track quickly. Our visual grid helps you see that one missed day is just a small blip in your overall journey."
    },
    {
      question: "How many habits should I track at once?",
      answer: "Start with 2-3 habits maximum. Research shows that focusing on too many changes at once leads to failure. Once these become automatic, you can add more."
    },
    {
      question: "Is this better than other habit tracking apps?",
      answer: "Our focus is simplicity and visual clarity. No complex features, no overwhelming interfaces - just a clean, beautiful way to see your progress and stay motivated."
    },
    {
      question: "Do I need to create an account?",
      answer: "No! You can start tracking immediately. Your data is saved locally in your browser, so you can begin building habits right away without any barriers."
    }
  ];

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about building lasting habits
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <span className="text-gray-500 text-xl">
                    {openFAQ === index ? '−' : '+'}
                  </span>
                </div>
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Life?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands who've already started their habit journey. Your future self will thank you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToTop}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
          >
            Start Your Journey Now <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="text-sm opacity-75">Free forever • No credit card required</p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">10,000+</div>
            <div className="text-sm opacity-75">Habits Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold">95%</div>
            <div className="text-sm opacity-75">User Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold">30 sec</div>
            <div className="text-sm opacity-75">Setup Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
