'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

export function AnalyticsTest() {
  const [gaLoaded, setGaLoaded] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    // Check if Google Analytics is loaded
    const checkGA = () => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        setGaLoaded(true);
      }
    };

    // Check immediately
    checkGA();

    // Check again after a delay
    const timer = setTimeout(checkGA, 2000);

    return () => clearTimeout(timer);
  }, []);

  const testEvent = () => {
    analytics.trackFeatureUsage('analytics_test', 'test_button_clicked');
    alert('Test event sent! Check your Google Analytics dashboard.');
  };

  return (
    <div className="fixed bottom-20 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border max-w-xs">
      <h4 className="font-semibold text-sm mb-2">Analytics Status</h4>
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${gaLoaded ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Google Analytics: {gaLoaded ? 'Loaded' : 'Not Loaded'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Tracking ID: G-8X4WBV10N3</span>
        </div>
        <button
          onClick={testEvent}
          className="w-full mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Send Test Event
        </button>
      </div>
    </div>
  );
}
