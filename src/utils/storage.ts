// Multi-layer storage utility for habit tracking data
import { TimesheetData } from '@/store/app-store';

// Generate a unique browser fingerprint for anonymous users
const generateBrowserFingerprint = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Browser fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

// Get or create user ID
const getUserId = (): string => {
  let userId = localStorage.getItem('habit-tracker-user-id');
  if (!userId) {
    userId = generateBrowserFingerprint();
    localStorage.setItem('habit-tracker-user-id', userId);
  }
  return userId;
};

// IndexedDB wrapper
class IndexedDBStorage {
  private dbName = 'HabitTrackerDB';
  private version = 1;
  private storeName = 'habits';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'userId' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveData(userId: string, data: TimesheetData): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await store.put({
        userId,
        data,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('IndexedDB save failed:', error);
    }
  }

  async loadData(userId: string): Promise<TimesheetData | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(userId);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.data : null);
        };
      });
    } catch (error) {
      console.warn('IndexedDB load failed:', error);
      return null;
    }
  }
}

// Cloud backup (placeholder for future implementation)
class CloudBackup {
  private apiEndpoint = '/api/habits'; // Future API endpoint

  async saveToCloud(userId: string, data: TimesheetData): Promise<boolean> {
    try {
      // Future implementation: send to your backend
      console.log('Cloud backup placeholder for user:', userId);
      return true;
    } catch (error) {
      console.warn('Cloud backup failed:', error);
      return false;
    }
  }

  async loadFromCloud(userId: string): Promise<TimesheetData | null> {
    try {
      // Future implementation: fetch from your backend
      console.log('Cloud restore placeholder for user:', userId);
      return null;
    } catch (error) {
      console.warn('Cloud restore failed:', error);
      return null;
    }
  }
}

// Main storage manager
export class StorageManager {
  private indexedDB = new IndexedDBStorage();
  private cloudBackup = new CloudBackup();
  private userId: string;

  constructor() {
    this.userId = typeof window !== 'undefined' ? getUserId() : 'server';
  }

  // Save data with multiple fallbacks
  async saveData(data: TimesheetData): Promise<void> {
    const promises: Promise<any>[] = [];

    // 1. Save to localStorage (immediate)
    try {
      localStorage.setItem('timesheet-data', JSON.stringify(data));
    } catch (error) {
      console.warn('localStorage save failed:', error);
    }

    // 2. Save to IndexedDB (more persistent)
    promises.push(this.indexedDB.saveData(this.userId, data));

    // 3. Save to cloud (future feature)
    // promises.push(this.cloudBackup.saveToCloud(this.userId, data));

    // Wait for all saves to complete
    await Promise.allSettled(promises);
  }

  // Load data with fallback priority
  async loadData(): Promise<TimesheetData | null> {
    // 1. Try localStorage first (fastest)
    try {
      const localData = localStorage.getItem('timesheet-data');
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (error) {
      console.warn('localStorage load failed:', error);
    }

    // 2. Try IndexedDB (more persistent)
    try {
      const indexedData = await this.indexedDB.loadData(this.userId);
      if (indexedData) {
        // Restore to localStorage for faster future access
        localStorage.setItem('timesheet-data', JSON.stringify(indexedData));
        return indexedData;
      }
    } catch (error) {
      console.warn('IndexedDB load failed:', error);
    }

    // 3. Try cloud backup (future feature)
    // try {
    //   const cloudData = await this.cloudBackup.loadFromCloud(this.userId);
    //   if (cloudData) {
    //     localStorage.setItem('timesheet-data', JSON.stringify(cloudData));
    //     return cloudData;
    //   }
    // } catch (error) {
    //   console.warn('Cloud load failed:', error);
    // }

    return null;
  }

  // Get user ID for potential future features
  getUserId(): string {
    return this.userId;
  }

  // Export data for user backup
  exportData(): string {
    const data = localStorage.getItem('timesheet-data');
    return data || '{}';
  }

  // Import data from user backup
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      await this.saveData(data);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();
