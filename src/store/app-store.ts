import { create } from 'zustand';

// 简化的任务接口
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

// 打卡记录按日期存储
export interface DailyCheckIns {
  [taskId: string]: boolean;
}

// Timesheet 习惯接口
export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  isActive: boolean;
  order: number;
}

// Timesheet 打卡记录
export interface HabitRecord {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completionLevel?: number; // 0-100 完成度
}

// Timesheet 数据
export interface TimesheetData {
  habits: Habit[];
  records: HabitRecord[];
}

export interface AppState {
  // 当前显示日期
  currentDate: Date;

  // 任务组数据
  taskGroups: TaskGroup[];

  // 打卡记录 - 按日期存储
  checkInHistory: Record<string, DailyCheckIns>; // 格式: { "2025-01-05": { "task1": true, "task2": false } }

  // 连续打卡天数
  streak: number;

  // Timesheet 相关状态
  timesheetData: TimesheetData;

  // Actions
  setCurrentDate: (date: Date) => void;
  setTaskGroups: (taskGroups: TaskGroup[]) => void;
  toggleTask: (groupId: string, taskId: string) => void;
  getCurrentDateTasks: () => TaskGroup[];
  getTodayProgress: () => { completed: number; total: number; percentage: number };

  // Timesheet Actions
  addHabit: (name: string, color?: string) => void;
  removeHabit: (habitId: string) => void;
  toggleHabitRecord: (habitId: string, date: string) => void;
  getHabitRecords: (habitId: string, startDate: string, endDate: string) => HabitRecord[];
  getHabitStats: (habitId: string) => { currentStreak: number; longestStreak: number; totalCount: number };
  clearTimesheetData: () => void;

  // 工具函数
  formatDateKey: (date: Date) => string;
}

// 默认任务数据
const defaultTaskGroups: TaskGroup[] = [
  {
    id: '1',
    title: '身体是革命的本钱',
    theme: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    tasks: [
      { id: '1', name: '哑铃', completed: false },
      { id: '2', name: '踮脚跟', completed: false },
      { id: '3', name: '身体拉升', completed: false },
    ],
  },
  {
    id: '2',
    title: '月入万刀，加油！',
    theme: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    tasks: [
      { id: '4', name: '看知识星球', completed: false },
      { id: '5', name: '看哥飞社群', completed: false },
      { id: '6', name: '实操建站', completed: false },
    ],
  },
  {
    id: '3',
    title: '明心净心',
    theme: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    tasks: [
      { id: '7', name: '阅读', completed: false },
    ],
  },
];

// 从 localStorage 加载数据
const loadFromStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('timesheet-data');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// 保存到 localStorage
const saveToStorage = (data: TimesheetData) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('timesheet-data', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// 初始化 Timesheet 数据
const initTimesheetData = (): TimesheetData => {
  const stored = loadFromStorage();
  if (stored) return stored;

  // 生成示例记录
  const generateSampleRecords = () => {
    const records: HabitRecord[] = [];
    const today = new Date();

    // 为最近20天生成一些随机记录
    for (let i = 19; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // swim - 高完成率
      if (Math.random() > 0.1) {
        records.push({
          habitId: 'habit_1',
          date: dateStr,
          completed: true,
          completionLevel: 100
        });
      }

      // play computer game - 中等完成率，有不同的完成度
      if (Math.random() > 0.3) {
        const levels = [25, 50, 75, 100];
        records.push({
          habitId: 'habit_2',
          date: dateStr,
          completed: true,
          completionLevel: levels[Math.floor(Math.random() * levels.length)]
        });
      }

      // football and basketball - 较低完成率
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

  // 默认示例数据
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
  // 初始状态
  currentDate: new Date(),
  taskGroups: defaultTaskGroups,
  checkInHistory: {},
  streak: 7,
  timesheetData: initTimesheetData(),

  // 工具函数
  formatDateKey: (date: Date) => {
    return date.toISOString().split('T')[0]; // 格式: "2025-01-05"
  },

  // Actions
  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
  },

  setTaskGroups: (taskGroups: TaskGroup[]) => {
    set({ taskGroups });
  },

  toggleTask: (groupId: string, taskId: string) => {
    const { currentDate, checkInHistory, formatDateKey } = get();
    const dateKey = formatDateKey(currentDate);

    set((state) => {
      // 获取当前日期的打卡记录
      const currentDayCheckIns = state.checkInHistory[dateKey] || {};

      // 切换任务状态
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
  },

  getCurrentDateTasks: () => {
    const { currentDate, taskGroups, checkInHistory, formatDateKey } = get();
    const dateKey = formatDateKey(currentDate);
    const currentDayCheckIns = checkInHistory[dateKey] || {};

    // 返回带有当前日期完成状态的任务组
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

      // 保存到 localStorage
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

      // 保存到 localStorage
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
        // 切换完成状态
        newTimesheetData = {
          ...state.timesheetData,
          records: state.timesheetData.records.map(r =>
            r.habitId === habitId && r.date === date
              ? { ...r, completed: !r.completed }
              : r
          )
        };
      } else {
        // 创建新记录
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

      // 保存到 localStorage
      saveToStorage(newTimesheetData);

      return { timesheetData: newTimesheetData };
    });
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

    // 计算连续天数
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    // 计算当前连续天数
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

    // 计算最长连续天数
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
}));
