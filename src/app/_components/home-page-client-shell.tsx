'use client';

import type { ReactNode } from 'react';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { DataManager } from '@/components/timesheet/data-manager';
import { AnalyticsTest } from '@/components/analytics/analytics-test';
import { MigrationModal } from '@/components/modals/migration-modal';
import { useMigrationPrompt } from '@/hooks/use-migration-prompt';

interface HomePageClientShellProps {
  children: ReactNode;
}

export function HomePageClientShell({ children }: HomePageClientShellProps) {
  const {
    shouldShowMigration,
    setShouldShowMigration
  } = useMigrationPrompt();

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="w-full px-0 py-8">
          {children}
        </main>

        <DataManager />
        {process.env.NODE_ENV === 'development' && <AnalyticsTest />}
        <MigrationModal
          open={shouldShowMigration}
          onOpenChange={setShouldShowMigration}
        />
      </div>
    </AuthWrapper>
  );
}
