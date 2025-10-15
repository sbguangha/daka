'use client';

import { useState } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function LandingPageInteractiveDemo() {
  const [demoHabits, setDemoHabits] = useState([
    { id: 1, name: 'Morning Exercise', color: '#22c55e', streak: 3, completed: [true, true, true, false, false, false, false] },
    { id: 2, name: 'Read 30 Minutes', color: '#3b82f6', streak: 5, completed: [true, true, false, true, true, false, false] },
    { id: 3, name: 'Drink 8 Glasses Water', color: '#f59e0b', streak: 2, completed: [false, true, true, false, false, false, false] },
  ]);

  const toggleDay = (habitId: number, dayIndex: number) => {
    setDemoHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const newCompleted = [...habit.completed];
          newCompleted[dayIndex] = !newCompleted[dayIndex];
          return { ...habit, completed: newCompleted };
        }
        return habit;
      }),
    );
  };

  return (
    <section className="py-16 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            See How Easy It Is
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Try our interactive demo below. Click any square to mark a habit as complete!
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 w-48">Habit</th>
                  {days.map(day => (
                    <th key={day} className="text-center p-2 text-sm text-gray-600 dark:text-gray-400">
                      {day}
                    </th>
                  ))}
                  <th className="text-center p-4">Streak</th>
                </tr>
              </thead>
              <tbody>
                {demoHabits.map(habit => (
                  <tr key={habit.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
                      </div>
                    </td>
                    {habit.completed.map((completed, index) => (
                      <td key={index} className="p-2">
                        <button
                          onClick={() => toggleDay(habit.id, index)}
                          className={`w-8 h-8 rounded transition-all duration-200 ${
                            completed
                              ? 'shadow-md transform scale-105'
                              : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                          style={{ backgroundColor: completed ? habit.color : undefined }}
                          aria-label={`Toggle ${habit.name} for ${days[index]}`}
                        />
                      </td>
                    ))}
                    <td className="p-4 text-center">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                        🔥 {habit.streak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✨ This is just a preview! The real tracker above has even more features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
