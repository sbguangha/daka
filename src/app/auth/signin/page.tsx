import { Metadata } from "next"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"

export const metadata: Metadata = {
  title: "Sign In - Daily Habit Tracker",
  description: "Sign in to Daily Habit Tracker app",
  alternates: {
    canonical: 'https://www.habittracker.life/auth/signin/',
  },
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your Daily Habit Tracker account
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4">
              <GoogleSignInButton 
                className="w-full"
                size="lg"
              />
              
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
