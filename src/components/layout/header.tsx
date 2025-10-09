'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { UserMenu } from '@/components/auth/user-menu';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthSync } from '@/hooks/use-auth-sync';

export function Header() {
  const { isAuthenticated, isLoading } = useAuthSync();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Navigation */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                <span>Habit Tracker</span>
              </Link>
            </div>

            {/* Student Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/students"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                For Students
              </Link>
              <Link
                href="/free-habit-tracker"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Free Tracker
              </Link>
              <Link
                href="/printable-habit-tracker"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Printable
              </Link>
              <Link
                href="/simple-habit-tracker"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Simple Tracker
              </Link>
            </nav>
          </div>

          {/* Right: Auth & Theme */}
          <div className="flex items-center space-x-3">
            {/* Authentication */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <GoogleSignInButton variant="outline" size="sm">
                Sign In
              </GoogleSignInButton>
            )}

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
