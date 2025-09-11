const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.lrojvydeqzcywgnwpjfl:ZNX4QTeO3XdpE8t2@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres'
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');
    
    // 查看表结构
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('📊 数据库表:', tables.rows.map(row => row.table_name));

    // 查看task_groups表结构
    const groupColumns = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'task_groups'");
    console.log('📋 task_groups表结构:', groupColumns.rows);

    // 查看tasks表结构
    const taskColumns = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tasks'");
    console.log('📋 tasks表结构:', taskColumns.rows);

    // 测试查询任务组
    const result = await client.query('SELECT * FROM task_groups LIMIT 5');
    console.log('📋 任务组数量:', result.rows.length);
    console.log('📋 任务组:', result.rows);
    
    client.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
