'use client';

import { useCallback } from 'react';
import { trackEvent } from '@/components/analytics/google-analytics';

export function useAnalytics() {
  // Track habit-related events
  const trackHabitCreated = useCallback((habitName: string, color: string) => {
    trackEvent('habit_created', 'habits', habitName);
    trackEvent('habit_color_selected', 'habits', color);
  }, []);

  const trackHabitCompleted = useCallback((habitName: string, date: string) => {
    trackEvent('habit_completed', 'habits', habitName);
    trackEvent('daily_checkin', 'engagement', date);
  }, []);

  const trackHabitUncompleted = useCallback((habitName: string, date: string) => {
    trackEvent('habit_uncompleted', 'habits', habitName);
  }, []);

  const trackHabitDeleted = useCallback((habitName: string) => {
    trackEvent('habit_deleted', 'habits', habitName);
  }, []);

  const trackHabitEdited = useCallback((habitName: string) => {
    trackEvent('habit_edited', 'habits', habitName);
  }, []);

  // Track streak achievements
  const trackStreakAchievement = useCallback((habitName: string, streakLength: number) => {
    trackEvent('streak_achievement', 'achievements', habitName, streakLength);
    
    // Track milestone streaks
    if ([7, 14, 30, 60, 100].includes(streakLength)) {
      trackEvent('streak_milestone', 'achievements', `${streakLength}_days`, streakLength);
    }
  }, []);

  // Track data management
  const trackDataExport = useCallback(() => {
    trackEvent('data_export', 'data_management', 'backup_created');
  }, []);

  const trackDataImport = useCallback((success: boolean) => {
    trackEvent('data_import', 'data_management', success ? 'success' : 'failed');
  }, []);

  // Track user engagement
  const trackPageView = useCallback((pageName: string) => {
    trackEvent('page_view', 'navigation', pageName);
  }, []);

  const trackFeatureUsage = useCallback((feature: string, action: string) => {
    trackEvent(action, 'features', feature);
  }, []);

  // Track user retention
  const trackDailyReturn = useCallback(() => {
    const lastVisit = localStorage.getItem('last_visit_date');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      trackEvent('daily_return', 'retention', today);
      localStorage.setItem('last_visit_date', today);
    }
  }, []);

  // Track habit statistics
  const trackHabitStats = useCallback((totalHabits: number, totalCompletions: number) => {
    trackEvent('habit_stats', 'usage', 'total_habits', totalHabits);
    trackEvent('habit_stats', 'usage', 'total_completions', totalCompletions);
  }, []);

  return {
    trackHabitCreated,
    trackHabitCompleted,
    trackHabitUncompleted,
    trackHabitDeleted,
    trackHabitEdited,
    trackStreakAchievement,
    trackDataExport,
    trackDataImport,
    trackPageView,
    trackFeatureUsage,
    trackDailyReturn,
    trackHabitStats,
  };
}
