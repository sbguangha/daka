'use client';

import { useState } from 'react';
import { Download, Upload, Shield, Info } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { storageManager } from '@/utils/storage';

export function DataManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { exportData, importData } = useAppStore();

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = await importData(text);
      setImportStatus(success ? 'success' : 'error');
      
      // Reset status after 3 seconds
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }

    // Reset file input
    event.target.value = '';
  };

  const userId = storageManager.getUserId();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors z-50"
        title="Data Management"
      >
        <Shield className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Management
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* User ID Info */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                  Your Browser ID
                </p>
                <p className="text-blue-600 dark:text-blue-300 font-mono text-xs break-all">
                  {userId}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                  This unique ID helps us remember your habits even if you clear cookies.
                </p>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <h4 className="font-medium text-gray-900 dark:text-white">How your data is stored:</h4>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Browser Storage:</strong> Saved locally in your browser</li>
              <li>• <strong>IndexedDB:</strong> More persistent, survives cookie clearing</li>
              <li>• <strong>Browser Fingerprint:</strong> Helps identify your device</li>
            </ul>
          </div>

          {/* Export Section */}
          <div className="mb-4">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Backup</span>
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Download your habits as a JSON file for safekeeping
            </p>
          </div>

          {/* Import Section */}
          <div className="mb-4">
            <label className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Restore your habits from a backup file
            </p>
          </div>

          {/* Import Status */}
          {importStatus !== 'idle' && (
            <div className={`p-3 rounded-lg text-sm ${
              importStatus === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {importStatus === 'success' 
                ? '✓ Data imported successfully!' 
                : '✗ Import failed. Please check your file.'}
            </div>
          )}

          {/* Data Persistence Info */}
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Data Persistence
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>✓ Survives browser restart</p>
              <p>✓ Survives most cookie clearing</p>
              <p>✓ Works offline</p>
              <p>⚠ May be lost if you clear all browser data</p>
              <p>💡 Export regularly for backup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
