import { Pool, PoolClient } from 'pg'

// 创建数据库连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 2000, // 连接超时时间
})

// 数据库连接池实例
export { pool }

// 获取数据库连接的辅助函数
export async function getDbConnection(): Promise<PoolClient> {
  return await pool.connect()
}

// 执行查询的辅助函数
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows
  } finally {
    client.release()
  }
}

// 执行单个查询并返回第一行
export async function executeQuerySingle<T = any>(
  query: string, 
  params: any[] = []
): Promise<T | null> {
  const rows = await executeQuery<T>(query, params)
  return rows.length > 0 ? rows[0] : null
}

// 执行事务
export async function executeTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// 优雅关闭连接池
export async function closePool(): Promise<void> {
  await pool.end()
}

// 检查数据库连接
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    return true
  } catch (error) {
    console.error('数据库连接检查失败:', error)
    return false
  }
}
