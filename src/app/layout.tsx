import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '每日打卡',
    template: '%s | 每日打卡',
  },
  description: '一个简洁优雅的每日打卡应用，帮助你养成良好的习惯，追踪个人成长进度。',
  keywords: ['打卡', '习惯养成', '进度追踪', '个人成长', 'daily-checkin', 'habit-tracker'],
  authors: [{ name: '葛勇攀', url: 'https://github.com/sbguangha' }],
  creator: '葛勇攀',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: '每日打卡',
    description: '一个简洁优雅的每日打卡应用，帮助你养成良好的习惯，追踪个人成长进度。',
    siteName: '每日打卡',
  },
  twitter: {
    card: 'summary_large_image',
    title: '每日打卡',
    description: '一个简洁优雅的每日打卡应用，帮助你养成良好的习惯，追踪个人成长进度。',
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
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
