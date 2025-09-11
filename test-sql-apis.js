#!/usr/bin/env node

/**
 * 测试原生SQL API的功能性脚本
 * 用于验证新的API是否正常工作
 */

const { Pool } = require('pg');

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...');
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ 数据库连接成功:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

async function testTasksQuery() {
  console.log('\n📋 测试任务查询...');
  try {
    const client = await pool.connect();
    
    // 查询任务组和任务
    const result = await client.query(`
      SELECT 
        tg.id as "group_id",
        tg.title as "group_title",
        tg.theme as "group_theme",
        t.id as "task_id",
        t.name as "task_name",
        t.icon as "task_icon"
      FROM task_groups tg
      LEFT JOIN tasks t ON tg.id = t."taskGroupId" AND t."isActive" = true
      WHERE tg."isActive" = true
      ORDER BY tg."order" ASC, t."order" ASC
      LIMIT 10
    `);
    
    client.release();
    console.log(`✅ 查询到 ${result.rows.length} 条任务记录`);
    
    if (result.rows.length > 0) {
      console.log('📝 示例数据:');
      result.rows.slice(0, 3).forEach(row => {
        console.log(`   - ${row.group_title}: ${row.task_name || '(无任务)'}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ 任务查询失败:', error.message);
    return false;
  }
}

async function testCheckInsQuery() {
  console.log('\n📊 测试打卡记录查询...');
  try {
    const client = await pool.connect();
    
    // 查询最近的打卡记录
    const result = await client.query(`
      SELECT 
        ci.id,
        ci.date,
        ci."userId",
        t.name as "task_name",
        tg.title as "group_title"
      FROM check_ins ci
      JOIN tasks t ON ci."taskId" = t.id
      JOIN task_groups tg ON t."taskGroupId" = tg.id
      ORDER BY ci.date DESC, ci."checkedAt" DESC
      LIMIT 10
    `);
    
    client.release();
    console.log(`✅ 查询到 ${result.rows.length} 条打卡记录`);
    
    if (result.rows.length > 0) {
      console.log('📝 最近的打卡记录:');
      result.rows.slice(0, 3).forEach(row => {
        const date = new Date(row.date).toLocaleDateString();
        console.log(`   - ${date}: ${row.group_title} - ${row.task_name}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ 打卡记录查询失败:', error.message);
    return false;
  }
}

async function testStatsQuery() {
  console.log('\n📈 测试统计查询...');
  try {
    const client = await pool.connect();
    
    // 统计总打卡次数
    const totalResult = await client.query(`
      SELECT COUNT(*) as total_checkins
      FROM check_ins
    `);
    
    // 统计活跃用户数
    const usersResult = await client.query(`
      SELECT COUNT(DISTINCT "userId") as active_users
      FROM check_ins
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    `);
    
    // 统计每日打卡数据
    const dailyResult = await client.query(`
      SELECT 
        date,
        COUNT(*) as daily_count
      FROM check_ins
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date DESC
      LIMIT 7
    `);
    
    client.release();
    
    console.log(`✅ 总打卡次数: ${totalResult.rows[0].total_checkins}`);
    console.log(`✅ 活跃用户数: ${usersResult.rows[0].active_users}`);
    console.log(`✅ 最近7天每日打卡统计:`);
    
    dailyResult.rows.forEach(row => {
      const date = new Date(row.date).toLocaleDateString();
      console.log(`   - ${date}: ${row.daily_count} 次`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ 统计查询失败:', error.message);
    return false;
  }
}

async function testPerformance() {
  console.log('\n⚡ 测试查询性能...');
  try {
    const client = await pool.connect();
    
    // 测试复杂查询的性能
    const startTime = Date.now();
    
    await client.query(`
      SELECT 
        ci."userId",
        COUNT(*) as total_checkins,
        COUNT(DISTINCT ci.date) as checkin_days,
        COUNT(DISTINCT ci."taskId") as unique_tasks
      FROM check_ins ci
      WHERE ci.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY ci."userId"
      ORDER BY total_checkins DESC
      LIMIT 10
    `);
    
    const endTime = Date.now();
    client.release();
    
    console.log(`✅ 复杂统计查询耗时: ${endTime - startTime}ms`);
    return true;
  } catch (error) {
    console.error('❌ 性能测试失败:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 开始测试原生SQL API功能...\n');
  
  const tests = [
    testDatabaseConnection,
    testTasksQuery,
    testCheckInsQuery,
    testStatsQuery,
    testPerformance
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) passedTests++;
  }
  
  console.log(`\n📊 测试结果: ${passedTests}/${tests.length} 通过`);
  
  if (passedTests === tests.length) {
    console.log('🎉 所有测试通过！原生SQL API准备就绪。');
  } else {
    console.log('⚠️  部分测试失败，请检查数据库配置和数据。');
  }
  
  await pool.end();
}

// 运行测试
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testDatabaseConnection,
  testTasksQuery,
  testCheckInsQuery,
  testStatsQuery,
  testPerformance
};
