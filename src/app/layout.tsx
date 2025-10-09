import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { Header } from '@/components/layout/header';
import { UnifiedBreadcrumbs } from '@/components/layout/unified-breadcrumbs';

export const metadata: Metadata = {
  title: {
    default: 'Habit Tracker - Build Better Habits That Stick',
    template: '%s | Habit Tracker',
  },
  description: 'Transform your life with our visual habit tracker. Track daily habits, build streaks, and achieve your goals with the most intuitive habit tracking tool.',
  keywords: ['habit tracker', 'daily planner', 'productivity app', 'habit building', 'time management', 'daily routine', 'goal tracking', 'habit formation', 'streak tracking', 'personal development'],
  authors: [{ name: 'LoopHabits', url: 'https://github.com/sbguangha' }],
  creator: 'LoopHabits',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Habit Tracker - Build Better Habits That Stick',
    description: 'Transform your life with our visual habit tracker. Track daily habits, build streaks, and achieve your goals with the most intuitive habit tracking tool.',
    siteName: 'LoopHabits',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habit Tracker - Build Better Habits That Stick',
    description: 'Transform your life with our visual habit tracker. Track daily habits, build streaks, and achieve your goals with the most intuitive habit tracking tool.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="max-w-6xl mx-auto">
                <UnifiedBreadcrumbs customSeparator=">" showCurrentPage={false} className="mb-2" />
              </div>
            </div>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
