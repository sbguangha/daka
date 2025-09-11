// SQL查询语句集合
// 为原生SQL操作提供预定义的查询语句

export const checkInQueries = {
  // 查询用户在指定日期范围内的打卡记录
  findByUserAndDateRange: `
    SELECT 
      ci.id,
      ci.date,
      ci."userId",
      ci."taskId", 
      ci."checkedAt",
      ci.note,
      ci."createdAt",
      ci."updatedAt",
      t.id as "task_id",
      t.name as "task_name", 
      t.icon as "task_icon",
      tg.id as "taskgroup_id",
      tg.title as "taskgroup_title",
      tg.theme as "taskgroup_theme"
    FROM check_ins ci
    JOIN tasks t ON ci."taskId" = t.id
    JOIN task_groups tg ON t."taskGroupId" = tg.id
    WHERE ci."userId" = $1
      AND ci.date >= $2
      AND ci.date <= $3
    ORDER BY ci.date DESC, ci."checkedAt" DESC
  `,

  // 查询用户在指定日期的打卡记录
  findByUserAndDate: `
    SELECT 
      ci.id,
      ci.date,
      ci."userId",
      ci."taskId", 
      ci."checkedAt",
      ci.note
    FROM check_ins ci
    WHERE ci."userId" = $1 AND ci.date = $2
  `,

  // 查询特定的打卡记录
  findByUserTaskDate: `
    SELECT id, date, "userId", "taskId", "checkedAt", note
    FROM check_ins 
    WHERE "userId" = $1 AND "taskId" = $2 AND date = $3
  `,

  // 创建打卡记录
  create: `
    INSERT INTO check_ins ("userId", "taskId", date, note, "checkedAt", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())
    RETURNING id, date, "userId", "taskId", "checkedAt", note, "createdAt", "updatedAt"
  `,

  // 删除打卡记录
  deleteById: `
    DELETE FROM check_ins 
    WHERE id = $1 AND "userId" = $2
  `,

  // 删除指定用户、任务、日期的打卡记录
  deleteByUserTaskDate: `
    DELETE FROM check_ins 
    WHERE "userId" = $1 AND "taskId" = $2 AND date = $3
  `,

  // 统计用户打卡记录数量
  countByUser: `
    SELECT COUNT(*) as count
    FROM check_ins 
    WHERE "userId" = $1
  `,

  // 统计用户在指定日期范围内的打卡记录数量
  countByUserAndDateRange: `
    SELECT COUNT(*) as count
    FROM check_ins 
    WHERE "userId" = $1 
      AND date >= $2 
      AND date <= $3
  `
}

export const taskQueries = {
  // 查询所有活跃的任务组和任务
  findAllActiveWithTasks: `
    SELECT 
      tg.id as "group_id",
      tg.title as "group_title",
      tg.description as "group_description", 
      tg.theme as "group_theme",
      tg."order" as "group_order",
      tg."isDefault" as "group_isDefault",
      tg."isActive" as "group_isActive",
      t.id as "task_id",
      t.name as "task_name",
      t.description as "task_description",
      t.icon as "task_icon", 
      t."order" as "task_order",
      t."isActive" as "task_isActive",
      t."taskGroupId" as "task_taskGroupId"
    FROM task_groups tg
    LEFT JOIN tasks t ON tg.id = t."taskGroupId" AND t."isActive" = true
    WHERE tg."isActive" = true
    ORDER BY tg."order" ASC, t."order" ASC
  `,

  // 验证任务是否存在
  findById: `
    SELECT id, name, description, icon, "order", "isActive", "taskGroupId"
    FROM tasks 
    WHERE id = $1 AND "isActive" = true
  `
}

export const statsQueries = {
  // 获取用户总打卡次数
  getTotalCheckIns: `
    SELECT COUNT(*) as count
    FROM check_ins 
    WHERE "userId" = $1
      AND date >= $2
      AND date <= $3
  `,

  // 获取用户打卡天数（去重）
  getCheckInDays: `
    SELECT COUNT(DISTINCT date) as count
    FROM check_ins 
    WHERE "userId" = $1
      AND date >= $2
      AND date <= $3
  `,

  // 获取任务完成统计
  getTaskStats: `
    SELECT 
      ci."taskId",
      COUNT(*) as count,
      t.name as "task_name",
      t.icon as "task_icon",
      tg.title as "taskgroup_title",
      tg.theme as "taskgroup_theme"
    FROM check_ins ci
    JOIN tasks t ON ci."taskId" = t.id
    JOIN task_groups tg ON t."taskGroupId" = tg.id
    WHERE ci."userId" = $1
      AND ci.date >= $2
      AND ci.date <= $3
    GROUP BY ci."taskId", t.name, t.icon, tg.title, tg.theme
    ORDER BY count DESC
  `,

  // 获取每日统计
  getDailyStats: `
    SELECT 
      date,
      COUNT(*) as count
    FROM check_ins 
    WHERE "userId" = $1
      AND date >= $2
      AND date <= $3
    GROUP BY date
    ORDER BY date ASC
  `,

  // 获取月度统计
  getMonthlyStats: `
    SELECT 
      DATE_TRUNC('month', date) as month,
      COUNT(*) as count
    FROM check_ins 
    WHERE "userId" = $1
      AND date >= $2
      AND date <= $3
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY month ASC
  `,

  // 计算连续打卡天数（需要在应用层处理）
  getCheckInsByDateDesc: `
    SELECT DISTINCT date
    FROM check_ins 
    WHERE "userId" = $1
    ORDER BY date DESC
  `
}

export const streakQueries = {
  // 获取用户的连续打卡记录
  findByUser: `
    SELECT id, "userId", count, "startDate", "endDate", "isCurrent", "createdAt", "updatedAt"
    FROM streaks 
    WHERE "userId" = $1
    ORDER BY "startDate" DESC
  `,

  // 获取最长连续记录
  findLongestByUser: `
    SELECT id, "userId", count, "startDate", "endDate", "isCurrent"
    FROM streaks 
    WHERE "userId" = $1
    ORDER BY count DESC
    LIMIT 1
  `,

  // 获取当前连续记录
  findCurrentByUser: `
    SELECT id, "userId", count, "startDate", "endDate", "isCurrent"
    FROM streaks 
    WHERE "userId" = $1 AND "isCurrent" = true
    LIMIT 1
  `
}
