const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.lrojvydeqzcywgnwpjfl:ZNX4QTeO3XdpE8t2@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres'
});

// 生成CUID格式的ID
function generateCuid() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `c${timestamp}${randomPart}`;
}

const taskGroupsData = [
  {
    id: generateCuid(),
    title: '身体锻炼',
    description: '保持身体健康的运动习惯',
    theme: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
    order: 1
  },
  {
    id: generateCuid(),
    title: '学习成长',
    description: '持续学习和个人发展',
    theme: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    order: 2
  },
  {
    id: generateCuid(),
    title: '精神修养',
    description: '心理健康和精神成长',
    theme: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
    order: 3
  }
];

const tasksData = [
  // 身体锻炼
  { name: '跑步', description: '有氧运动，增强心肺功能', icon: 'activity', order: 1, groupIndex: 0 },
  { name: '俯卧撑', description: '力量训练，锻炼上肢', icon: 'dumbbell', order: 2, groupIndex: 0 },
  { name: '仰卧起坐', description: '核心训练，增强腹肌', icon: 'target', order: 3, groupIndex: 0 },
  { name: '瑜伽', description: '柔韧性训练，放松身心', icon: 'heart', order: 4, groupIndex: 0 },
  
  // 学习成长
  { name: '阅读', description: '每日阅读，增长知识', icon: 'book-open', order: 1, groupIndex: 1 },
  { name: '写作', description: '记录思考，提升表达', icon: 'pen-tool', order: 2, groupIndex: 1 },
  { name: '编程练习', description: '技能提升，保持手感', icon: 'code', order: 3, groupIndex: 1 },
  { name: '学习新技能', description: '持续学习，拓展能力', icon: 'graduation-cap', order: 4, groupIndex: 1 },
  
  // 精神修养
  { name: '冥想', description: '静心冥想，减压放松', icon: 'brain', order: 1, groupIndex: 2 },
  { name: '感恩日记', description: '记录美好，培养感恩', icon: 'heart-handshake', order: 2, groupIndex: 2 },
  { name: '深呼吸', description: '调节呼吸，平静心情', icon: 'wind', order: 3, groupIndex: 2 },
  { name: '正念练习', description: '专注当下，提升觉察', icon: 'eye', order: 4, groupIndex: 2 }
];

async function seedData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 开始插入种子数据...');
    
    // 清空现有数据
    await client.query('DELETE FROM check_ins');
    await client.query('DELETE FROM tasks');
    await client.query('DELETE FROM task_groups');
    console.log('🗑️ 清空现有数据');
    
    // 插入任务组
    for (const group of taskGroupsData) {
      await client.query(
        'INSERT INTO task_groups (id, title, description, theme, "order", "isDefault", "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
        [group.id, group.title, group.description, group.theme, group.order, true, true]
      );
    }
    console.log('📋 插入任务组完成');
    
    // 插入任务
    for (const task of tasksData) {
      const taskId = generateCuid();
      const groupId = taskGroupsData[task.groupIndex].id;
      
      await client.query(
        'INSERT INTO tasks (id, name, description, icon, "order", "isActive", "taskGroupId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
        [taskId, task.name, task.description, task.icon, task.order, true, groupId]
      );
    }
    console.log('✅ 插入任务完成');
    
    // 验证数据
    const groupCount = await client.query('SELECT COUNT(*) FROM task_groups');
    const taskCount = await client.query('SELECT COUNT(*) FROM tasks');
    
    console.log(`📊 数据统计:`);
    console.log(`   - 任务组: ${groupCount.rows[0].count} 个`);
    console.log(`   - 任务: ${taskCount.rows[0].count} 个`);
    console.log('🎉 种子数据插入完成！');
    
  } catch (error) {
    console.error('❌ 插入种子数据失败:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedData();
