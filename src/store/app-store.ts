import { create } from 'zustand';
import { storageManager } from '@/utils/storage';
import { api } from '@/lib/api-client';
import type { AuthUser } from '@/types/auth';

// Simplified task interface
export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export interface TaskGroup {
  id: string;
  title: string;
  theme: string;
  tasks: Task[];
}

// Check-in records stored by date
export interface DailyCheckIns {
  [taskId: string]: boolean;
}

// Timesheet habit interface
export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  isActive: boolean;
  order: number;
}

// Timesheet check-in record
export interface HabitRecord {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completionLevel?: number; // 0-100 completion level
}

// Timesheet data
export interface TimesheetData {
  habits: Habit[];
  records: HabitRecord[];
}

export interface AppState {
  // Current display date
  currentDate: Date;

  // Task group data
  taskGroups: TaskGroup[];

  // Check-in records - stored by date
  checkInHistory: Record<string, DailyCheckIns>; // Format: { "2025-01-05": { "task1": true, "task2": false } }

  // Consecutive check-in days
  streak: number;

  // Timesheet related state
  timesheetData: TimesheetData;

  // Authentication state
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Loading states
  isLoading: boolean;
  isLoadingTasks: boolean;

  // Actions
  setCurrentDate: (date: Date) => void;
  setTaskGroups: (taskGroups: TaskGroup[]) => void;
  toggleTask: (groupId: string, taskId: string) => Promise<void>;
  getCurrentDateTasks: () => TaskGroup[];
  getTodayProgress: () => { completed: number; total: number; percentage: number };

  // API Actions
  loadTasksFromAPI: () => Promise<void>;
  loadCheckInsFromAPI: (startDate?: string, endDate?: string, mergeWithLocal?: boolean) => Promise<void>;
  syncWithAPI: (autoMigrate?: boolean) => Promise<void>;
  migrateLocalDataToAPI: (overwrite?: boolean) => Promise<false | { success: boolean; migratedCount: number; errors: string[] } | { success: boolean; error: any; migratedCount?: undefined; errors?: undefined }>;

  // Auth Actions
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;

  // Timesheet Actions
  addHabit: (name: string, color?: string) => void;
  removeHabit: (habitId: string) => void;
  toggleHabitRecord: (habitId: string, date: string) => void;
  getHabitRecords: (habitId: string, startDate: string, endDate: string) => HabitRecord[];
  getHabitStats: (habitId: string) => { currentStreak: number; longestStreak: number; totalCount: number };
  clearTimesheetData: () => void;
  loadStoredData: () => Promise<void>;
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;

  // Utility functions
  formatDateKey: (date: Date) => string;
}

// Default task data
const defaultTaskGroups: TaskGroup[] = [
  {
    id: '1',
    title: 'Health & Fitness',
    theme: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    tasks: [
      { id: '1', name: 'Dumbbell Exercise', completed: false },
      { id: '2', name: 'Calf Raises', completed: false },
      { id: '3', name: 'Body Stretching', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Career & Growth',
    theme: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    tasks: [
      { id: '4', name: 'Read Knowledge Community', completed: false },
      { id: '5', name: 'Check Developer Groups', completed: false },
      { id: '6', name: 'Practice Web Development', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Mind & Spirit',
    theme: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    tasks: [
      { id: '7', name: 'Reading', completed: false },
    ],
  },
];

// Load data using storage manager
const loadFromStorage = async (): Promise<TimesheetData | null> => {
  if (typeof window === 'undefined') return null;

  try {
    return await storageManager.loadData();
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
};

// Save to storage using storage manager
const saveToStorage = async (data: TimesheetData) => {
  if (typeof window === 'undefined') return;

  try {
    await storageManager.saveData(data);
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

// Initialize Timesheet data
const initTimesheetData = (): TimesheetData => {
  // Return default data initially, will be loaded asynchronously

  // Generate sample records
  const generateSampleRecords = () => {
    const records: HabitRecord[] = [];
    const today = new Date();

    // Generate some random records for the last 20 days
    for (let i = 19; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // swim - high completion rate
      if (Math.random() > 0.1) {
        records.push({
          habitId: 'habit_1',
          date: dateStr,
          completed: true,
          completionLevel: 100
        });
      }

      // play computer game - medium completion rate, with different completion levels
      if (Math.random() > 0.3) {
        const levels = [25, 50, 75, 100];
        records.push({
          habitId: 'habit_2',
          date: dateStr,
          completed: true,
          completionLevel: levels[Math.floor(Math.random() * levels.length)]
        });
      }

      // football and basketball - lower completion rate
      if (Math.random() > 0.5) {
        records.push({
          habitId: 'habit_3',
          date: dateStr,
          completed: true,
          completionLevel: 100
        });
      }
    }

    return records;
  };

  // Default sample data
  return {
    habits: [
      {
        id: 'habit_1',
        name: 'swim',
        color: '#22c55e',
        createdAt: new Date(),
        isActive: true,
        order: 0
      },
      {
        id: 'habit_2',
        name: 'play computer game',
        color: '#3b82f6',
        createdAt: new Date(),
        isActive: true,
        order: 1
      },
      {
        id: 'habit_3',
        name: 'football and basketball',
        color: '#f59e0b',
        createdAt: new Date(),
        isActive: true,
        order: 2
      }
    ],
    records: generateSampleRecords()
  };
};

export const useAppStore = create<AppState>()((set, get) => ({
  // Initial state
  currentDate: new Date(),
  taskGroups: defaultTaskGroups,
  checkInHistory: {},
  streak: 7,
  timesheetData: initTimesheetData(),

  // Auth state
  user: null,
  isAuthenticated: false,

  // Loading states
  isLoading: false,
  isLoadingTasks: false,

  // Utility functions
  formatDateKey: (date: Date) => {
    return date.toISOString().split('T')[0]; // Format: "2025-01-05"
  },

  // Actions
  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
  },

  setTaskGroups: (taskGroups: TaskGroup[]) => {
    set({ taskGroups });
  },

  toggleTask: async (groupId: string, taskId: string) => {
    const { currentDate, formatDateKey, isAuthenticated, user } = get();
    const dateKey = formatDateKey(currentDate);

    // 如果用户已登录，使用API
    if (isAuthenticated && user) {
      try {
        set({ isLoading: true });

        // 调用API切换打卡状态
        const response = await api.checkIns.toggle(taskId, dateKey);

        if (response.success && response.data) {
          // 更新本地状态
          set((state) => {
            const currentDayCheckIns = state.checkInHistory[dateKey] || {};
            const newCheckIns = {
              ...currentDayCheckIns,
              [taskId]: response.data!.action === 'checked'
            };

            return {
              checkInHistory: {
                ...state.checkInHistory,
                [dateKey]: newCheckIns
              }
            };
          });

          // 打卡成功后同步数据，确保其他设备能看到最新状态
          setTimeout(async () => {
            try {
              console.log('🔄 打卡成功，开始同步数据...');
              await get().loadTasksFromAPI(); // 重新加载任务状态
              console.log('✅ 打卡后数据同步完成');
            } catch (syncError) {
              console.error('❌ 打卡后同步数据失败:', syncError);
            }
          }, 300); // 减少延迟，提高响应速度
        }
      } catch (error) {
        console.error('API打卡失败，回退到本地存储:', error);
        // 如果API失败，回退到本地存储
        toggleTaskLocal(taskId, dateKey);
      } finally {
        set({ isLoading: false });
      }
    } else {
      // 用户未登录，使用本地存储
      toggleTaskLocal(taskId, dateKey);
    }

    // 本地切换函数
    function toggleTaskLocal(taskId: string, dateKey: string) {
      set((state) => {
        const currentDayCheckIns = state.checkInHistory[dateKey] || {};
        const newCheckIns = {
          ...currentDayCheckIns,
          [taskId]: !currentDayCheckIns[taskId]
        };

        return {
          checkInHistory: {
            ...state.checkInHistory,
            [dateKey]: newCheckIns
          }
        };
      });
    }
  },

  getCurrentDateTasks: () => {
    const { currentDate, taskGroups, checkInHistory, formatDateKey } = get();
    const dateKey = formatDateKey(currentDate);
    const currentDayCheckIns = checkInHistory[dateKey] || {};

    // Return task groups with current date completion status
    return taskGroups.map(group => ({
      ...group,
      tasks: group.tasks.map(task => ({
        ...task,
        completed: currentDayCheckIns[task.id] || false
      }))
    }));
  },

  getTodayProgress: () => {
    const { getCurrentDateTasks } = get();
    const currentTasks = getCurrentDateTasks();

    const allTasks = currentTasks.flatMap(group => group.tasks);
    const completedTasks = allTasks.filter(task => task.completed);

    return {
      completed: completedTasks.length,
      total: allTasks.length,
      percentage: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0,
    };
  },

  // API Actions
  loadTasksFromAPI: async () => {
    const { isAuthenticated, formatDateKey, currentDate } = get();

    if (!isAuthenticated) return;

    try {
      set({ isLoadingTasks: true });

      const dateKey = formatDateKey(currentDate);
      const response = await api.tasks.get({
        includeCheckIns: true,
        date: dateKey
      });

      if (response.success && response.data) {
        // 转换API类型到本地类型
        const localTaskGroups = response.data.map(group => ({
          ...group,
          tasks: group.tasks.map(task => ({
            ...task,
            completed: task.completed || false
          }))
        }));
        set({ taskGroups: localTaskGroups });
      }
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      set({ isLoadingTasks: false });
    }
  },

  loadCheckInsFromAPI: async (startDate?: string, endDate?: string, mergeWithLocal = true) => {
    const { isAuthenticated, formatDateKey, checkInHistory } = get();

    if (!isAuthenticated) return;

    try {
      set({ isLoading: true });

      const response = await api.checkIns.get({
        startDate,
        endDate
      });

      if (response.success && response.data) {
        // 转换API数据为本地格式
        const serverCheckInHistory: Record<string, DailyCheckIns> = {};

        response.data.forEach((checkIn: any) => {
          const dateKey = checkIn.date.split('T')[0]; // 提取日期部分
          if (!serverCheckInHistory[dateKey]) {
            serverCheckInHistory[dateKey] = {};
          }
          serverCheckInHistory[dateKey][checkIn.taskId] = true;
        });

        // 如果需要合并本地数据，则合并而不是覆盖
        if (mergeWithLocal) {
          const mergedHistory = { ...checkInHistory };

          // 合并服务器数据到本地数据
          Object.keys(serverCheckInHistory).forEach(dateKey => {
            if (!mergedHistory[dateKey]) {
              mergedHistory[dateKey] = {};
            }
            mergedHistory[dateKey] = {
              ...mergedHistory[dateKey],
              ...serverCheckInHistory[dateKey]
            };
          });

          set({ checkInHistory: mergedHistory });
        } else {
          // 直接使用服务器数据（用于初始加载）
          set({ checkInHistory: serverCheckInHistory });
        }
      }
    } catch (error) {
      console.error('加载打卡记录失败:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  syncWithAPI: async (autoMigrate = false) => {
    const { isAuthenticated, checkInHistory } = get();

    if (!isAuthenticated) return;

    try {
      set({ isLoading: true });

      // 如果需要自动迁移且有本地数据，先迁移本地数据
      if (autoMigrate && Object.keys(checkInHistory).length > 0) {
        console.log('🔄 检测到本地数据，开始自动迁移...');
        const migrationResult = await get().migrateLocalDataToAPI();

        if (migrationResult && typeof migrationResult === 'object' && migrationResult.success) {
          console.log(`✅ 自动迁移成功，迁移了 ${migrationResult.migratedCount} 条记录`);
        } else {
          console.warn('⚠️ 自动迁移失败，将加载服务器数据');
        }
      }

      // 并行加载任务和打卡记录
      await Promise.all([
        get().loadTasksFromAPI(),
        get().loadCheckInsFromAPI(undefined, undefined, !autoMigrate) // 如果刚迁移过，不再合并本地数据
      ]);

    } catch (error) {
      console.error('同步数据失败:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  migrateLocalDataToAPI: async (overwrite = false) => {
    const { isAuthenticated, checkInHistory, timesheetData } = get();

    if (!isAuthenticated) {
      console.warn('用户未登录，无法迁移数据');
      return false;
    }

    console.log('🔄 开始迁移本地数据到服务器...');
    console.log('本地打卡记录:', checkInHistory);

    try {
      set({ isLoading: true });

      let migratedCount = 0;
      const errors: string[] = [];

      // 迁移打卡记录
      for (const [dateKey, dailyCheckIns] of Object.entries(checkInHistory)) {
        for (const [taskId, isChecked] of Object.entries(dailyCheckIns)) {
          if (isChecked) {
            try {
              const response = await api.checkIns.toggle(taskId, dateKey);
              if (response.success) {
                migratedCount++;
                console.log(`✅ 迁移打卡记录: ${dateKey} - 任务${taskId}`);
              } else {
                errors.push(`${dateKey}-${taskId}: ${response.error}`);
              }
            } catch (error) {
              errors.push(`${dateKey}-${taskId}: ${error}`);
              console.error(`❌ 迁移失败: ${dateKey} - 任务${taskId}`, error);
            }
          }
        }
      }

      console.log(`🎉 数据迁移完成！成功迁移 ${migratedCount} 条打卡记录`);

      if (errors.length > 0) {
        console.warn(`⚠️ 有 ${errors.length} 条记录迁移失败:`, errors);
      }

      // 迁移成功后重新从服务器加载数据（不合并本地数据）
      await get().loadCheckInsFromAPI(undefined, undefined, false);

      return { success: true, migratedCount, errors };
    } catch (error) {
      console.error('数据迁移失败:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
      set({ isLoading: false });
    }
  },

  // Timesheet Actions
  addHabit: (name: string, color?: string) => {
    const newHabit: Habit = {
      id: `habit_${Date.now()}`,
      name,
      color: color || '#22c55e',
      createdAt: new Date(),
      isActive: true,
      order: get().timesheetData.habits.length
    };

    set((state) => {
      const newTimesheetData = {
        ...state.timesheetData,
        habits: [...state.timesheetData.habits, newHabit]
      };

      // Save to localStorage
      saveToStorage(newTimesheetData);

      return { timesheetData: newTimesheetData };
    });
  },

  removeHabit: (habitId: string) => {
    set((state) => {
      const newTimesheetData = {
        habits: state.timesheetData.habits.filter(h => h.id !== habitId),
        records: state.timesheetData.records.filter(r => r.habitId !== habitId)
      };

      // Save to localStorage
      saveToStorage(newTimesheetData);

      return { timesheetData: newTimesheetData };
    });
  },

  toggleHabitRecord: (habitId: string, date: string) => {
    set((state) => {
      const existingRecord = state.timesheetData.records.find(
        r => r.habitId === habitId && r.date === date
      );

      let newTimesheetData: TimesheetData;

      if (existingRecord) {
        // Toggle completion status
        newTimesheetData = {
          ...state.timesheetData,
          records: state.timesheetData.records.map(r =>
            r.habitId === habitId && r.date === date
              ? { ...r, completed: !r.completed }
              : r
          )
        };
      } else {
        // Create new record
        const newRecord: HabitRecord = {
          habitId,
          date,
          completed: true,
          completionLevel: 100
        };

        newTimesheetData = {
          ...state.timesheetData,
          records: [...state.timesheetData.records, newRecord]
        };
      }

      // Save to localStorage
      saveToStorage(newTimesheetData);

      return { timesheetData: newTimesheetData };
    });

    // 习惯打卡后同步数据，确保其他设备能看到最新状态
    const { isAuthenticated } = get();
    if (isAuthenticated) {
      setTimeout(async () => {
        try {
          console.log('🔄 习惯打卡成功，开始同步数据...');
          await get().syncWithAPI();
          console.log('✅ 习惯打卡后数据同步完成');
        } catch (syncError) {
          console.error('❌ 习惯打卡后同步数据失败:', syncError);
        }
      }, 300);
    }
  },

  getHabitRecords: (habitId: string, startDate: string, endDate: string) => {
    const { timesheetData } = get();
    return timesheetData.records.filter(
      r => r.habitId === habitId && r.date >= startDate && r.date <= endDate
    );
  },

  getHabitStats: (habitId: string) => {
    const { timesheetData } = get();
    const records = timesheetData.records
      .filter(r => r.habitId === habitId && r.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const totalCount = records.length;

    // Calculate consecutive days
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    // Calculate current consecutive days
    while (checkDate >= new Date(records[0]?.date || today)) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasRecord = records.some(r => r.date === dateStr);

      if (hasRecord) {
        currentStreak++;
      } else {
        break;
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest consecutive days
    for (let i = 0; i < records.length; i++) {
      if (i === 0 ||
          new Date(records[i].date).getTime() - new Date(records[i-1].date).getTime() === 24 * 60 * 60 * 1000) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return { currentStreak, longestStreak, totalCount };
  },

  clearTimesheetData: () => {
    const emptyData: TimesheetData = { habits: [], records: [] };
    saveToStorage(emptyData);
    set({ timesheetData: emptyData });
  },

  // Load stored data asynchronously
  loadStoredData: async () => {
    try {
      const storedData = await loadFromStorage();
      if (storedData) {
        set({ timesheetData: storedData });
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    }
  },

  // Export data for backup
  exportData: () => {
    return storageManager.exportData();
  },

  // Import data from backup
  importData: async (jsonData: string) => {
    try {
      const success = await storageManager.importData(jsonData);
      if (success) {
        // Reload data after import
        const storedData = await loadFromStorage();
        if (storedData) {
          set({ timesheetData: storedData });
        }
      }
      return success;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  // Auth Actions
  setUser: (user: AuthUser | null) => {
    set({
      user,
      isAuthenticated: !!user
    });

    // 用户登录后自动同步数据
    if (user) {
      console.log('🔄 用户已登录，开始自动同步数据...');
      setTimeout(async () => {
        try {
          console.log('🔄 用户登录，开始同步数据并迁移本地打卡记录...');
          await get().syncWithAPI(true); // 启用自动迁移
          console.log('✅ 用户登录后数据同步完成');
        } catch (error) {
          console.error('❌ 用户登录后同步数据失败:', error);
        }
      }, 500); // 延迟500ms确保用户状态已更新
    }
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      // 清除用户相关的数据
      checkInHistory: {},
      streak: 0
    });
  },
}));
