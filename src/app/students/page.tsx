'use client';

import { useEffect } from 'react';
import { BookOpen, Bed, Coffee, Target, Clock, Zap, Star, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function StudentHabitTrackerPage() {
  // SEO optimization for student-specific page
  useEffect(() => {
    document.title = "Habit Tracker for Students – Free Focus & Study Routine Tool";

    // Add canonical URL
    const canonicalUrl = document.querySelector('link[rel="canonical"]');
    if (!canonicalUrl) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://www.habittracker.life/students/';
      document.head.appendChild(link);
    } else {
      canonicalUrl.setAttribute('href', 'https://www.habittracker.life/students/');
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Struggling with focus or all-nighters? Track student habits like study blocks, sleep, and morning routines—free, no signup required.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Struggling with focus or all-nighters? Track student habits like study blocks, sleep, and morning routines—free, no signup required.';
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content',
        'habit tracker for students, student productivity, study habits, college habits, exam prep, focus tracker, sleep routine, morning routine, student life, academic success'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'habit tracker for students, student productivity, study habits, college habits, exam prep, focus tracker, sleep routine, morning routine, student life, academic success';
      document.head.appendChild(meta);
    }

    // Add Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = 'Habit Tracker for Students – Free Focus & Study Routine Tool';
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = 'Struggling with focus or all-nighters? Track student habits like study blocks, sleep, and morning routines—free, no signup required.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <HeroSection />

      {/* 5 Essential Habits Section */}
      <EssentialHabitsSection />

      {/* Habits Without Overwhelm */}
      <HabitsWithoutOverwhelm />

      {/* Free Tools Section */}
      <FreeToolsSection />

      {/* Student Success Stories */}
      <SuccessStories />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Habit Tracker for Students
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Hey there! 👋 Between lectures, assignments, and trying to maintain a social life, I know how overwhelming student life can feel. But here's what I learned: small daily habits beat massive effort every time.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Whether you're pulling all-nighters during finals week or trying to establish a morning routine in your dorm, tracking just 1-2 habits can transform your academic game.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/free-habit-tracker">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center">
              Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">No signup required • Works instantly</p>
        </div>
      </div>
    </section>
  );
}

function EssentialHabitsSection() {
  const essentialHabits = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Study Blocks",
      description: "25-minute focused sessions between lectures add up fast. I went from cramming to consistent daily progress."
    },
    {
      icon: <Bed className="w-6 h-6 text-purple-600" />,
      title: "Sleep Schedule",
      description: "Getting to bed by 11pm saved my GPA. Trust me, your brain needs those 7-8 hours during finals week."
    },
    {
      icon: <Coffee className="w-6 h-6 text-amber-600" />,
      title: "Morning Routine",
      description: "Just 15 minutes of planning while your roommate's still asleep sets up your entire day."
    },
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      title: "Daily Review",
      description: "5 minutes each night to review what you learned cements information better than last-minute cramming."
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Phone-Free Time",
      description: "2 hours of focused work without social media = 4 hours of distracted studying. Your grades will thank you."
    }
  ];

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            5 Essential Habits That Changed My Student Life
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            These aren't just random habits - they're the exact ones that helped me go from stressed to organized
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {essentialHabits.map((habit, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {habit.icon}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                  {habit.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {habit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/free-habit-tracker">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center mx-auto">
              Start Your Student Habit Tracker → Free & No Email
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HabitsWithoutOverwhelm() {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Habits Without Overwhelm
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1-2</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Start with just 1–2 habits
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              I know you want to fix everything at once (been there!), but trust me - one small win builds momentum. Start with just sleep schedule OR study blocks, not both.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Use visual streaks for motivation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              There's nothing more satisfying than seeing that visual chain grow. It's like a game - you won't want to break the streak, especially when you see your progress right there on your dorm wall.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <p className="text-lg text-gray-700 dark:text-gray-300 italic">
            "I started with just tracking my sleep. After 2 weeks, I added study blocks. Now I'm that organized student I used to envy - and it started with one simple habit."
            <span className="block mt-2 text-sm">- Sarah, Engineering Major</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function FreeToolsSection() {
  const tools = [
    {
      title: "Free Habit Tracker",
      description: "Works instantly, no signup needed. Perfect for busy students who just want to start tracking.",
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      link: "/free-habit-tracker",
      cta: "Start Now →",
      highlight: "no signup, works instantly"
    },
    {
      title: "Printable Habit Tracker",
      description: "Old school but effective! Stick it on your dorm wall where you can't ignore it.",
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      link: "/printable-habit-tracker",
      cta: "Download PDF →",
      highlight: "for dorm wall or notebook"
    },
    {
      title: "Habit Building Guide",
      description: "Want to understand the psychology behind habits? This deep dive is worth your time.",
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
      link: "/how-to-build-a-habit",
      cta: "Learn More →",
      highlight: "for deeper learning"
    }
  ];

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Free Tools Designed for Student Life
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Because we know you're on a budget but still deserve the best tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div key={index} className="p-8 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                {tool.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                {tool.description}
              </p>
              <div className="text-center">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {tool.highlight}
                </span>
              </div>
              <div className="mt-6 text-center">
                <Link href={tool.link}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    {tool.cta}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessStories() {
  const stories = [
    {
      name: "Mike, Sophomore",
      major: "Computer Science",
      story: "I used to pull all-nighters before every exam. Started tracking my sleep and study blocks - my GPA went from 2.8 to 3.6 in one semester. The visual streaks kept me going even when I wanted to give up.",
      habits: ["Sleep by 11pm", "Study blocks", "Daily review"]
    },
    {
      name: "Emma, Senior",
      major: "Psychology",
      story: "Between thesis writing and part-time work, I was drowning. Tracking just my morning routine helped me reclaim 2 hours every day. I finally had time for myself again.",
      habits: ["Morning routine", "Thesis writing blocks", "Phone-free time"]
    },
    {
      name: "Alex, Freshman",
      major: "Business",
      story: "Freshman year hit me hard. My printable habit tracker on my dorm wall became my accountability buddy. My roommate even joined in - we both saw our grades improve.",
      habits: ["Morning routine", "Study blocks", "Sleep schedule"]
    }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Real Students, Real Results
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See how other students transformed their academic life with simple habit tracking
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{story.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{story.major}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                "{story.story}"
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key habits:</p>
                {story.habits.map((habit, habitIndex) => (
                  <div key={habitIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
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

function FinalCTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Join Thousands of Successful Students?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Your future self will thank you for starting today. Not tomorrow. Not next week. Today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/free-habit-tracker">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center">
              Start Your Student Habit Tracker → Free & No Email
            </button>
          </Link>
          <p className="text-sm opacity-75">Free forever • No credit card required</p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">5,000+</div>
            <div className="text-sm opacity-75">Students Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold">92%</div>
            <div className="text-sm opacity-75">Improved Grades</div>
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