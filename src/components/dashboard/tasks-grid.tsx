'use client';

import { useAppStore } from '@/store/app-store';

export function TasksGrid() {
  const { getCurrentDateTasks, toggleTask } = useAppStore();
  const taskGroups = getCurrentDateTasks();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {taskGroups.map((group) => (
        <div key={group.id} className="space-y-4">
          {/* 任务组标题 */}
          <div className={`${group.theme} rounded-lg p-4 text-center`}>
            <h3 className="font-semibold">{group.title}</h3>
          </div>

          {/* 任务列表 */}
          <div className="space-y-2">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">
                        {task.completed ? '✅' : '📝'}
                      </span>
                    </div>
                    <span className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.name}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleTask(group.id, task.id)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      task.completed
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {task.completed ? '已完成' : '打卡'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
