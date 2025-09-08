import { NextResponse } from 'next/server';

// 模拟数据
const mockTaskGroups = [
  {
    id: '1',
    title: '身体是革命的本钱',
    description: '保持身体健康，提升体能',
    theme: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    order: 1,
    isDefault: true,
    isActive: true,
    tasks: [
      { id: '1', name: '哑铃', description: '力量训练', icon: 'dumbbell', order: 1, isActive: true, taskGroupId: '1' },
      { id: '2', name: '踮脚跟', description: '小腿训练', icon: 'arrow-up', order: 2, isActive: true, taskGroupId: '1' },
      { id: '3', name: '身体拉升', description: '柔韧性训练', icon: 'stretch-horizontal', order: 3, isActive: true, taskGroupId: '1' },
    ],
  },
  {
    id: '2',
    title: '月入万刀，加油！',
    description: '学习成长，提升技能',
    theme: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    order: 2,
    isDefault: true,
    isActive: true,
    tasks: [
      { id: '4', name: '看知识星球', description: '学习新知识', icon: 'book-open', order: 1, isActive: true, taskGroupId: '2' },
      { id: '5', name: '看哥飞社群', description: '交流学习', icon: 'users', order: 2, isActive: true, taskGroupId: '2' },
      { id: '6', name: '实操建站', description: '实践练习', icon: 'code', order: 3, isActive: true, taskGroupId: '2' },
    ],
  },
  {
    id: '3',
    title: '明心净心',
    description: '精神修养，内心平静',
    theme: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
    order: 3,
    isDefault: true,
    isActive: true,
    tasks: [
      { id: '7', name: '阅读', description: '读书学习', icon: 'book', order: 1, isActive: true, taskGroupId: '3' },
    ],
  },
];

export async function GET() {
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json(mockTaskGroups);
  } catch (error) {
    console.error('获取任务失败:', error);
    return NextResponse.json(
      { error: '获取任务失败' },
      { status: 500 }
    );
  }
}

// POST 方法暂时不实现，返回 405
export async function POST() {
  return NextResponse.json(
    { error: '方法不支持' },
    { status: 405 }
  );
}
