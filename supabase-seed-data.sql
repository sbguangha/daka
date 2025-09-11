-- 🌱 Supabase 初始数据脚本
-- 为打卡应用创建默认的任务组和任务

-- 插入默认任务组
INSERT INTO "task_groups" ("id", "title", "description", "theme", "order", "isDefault", "isActive") VALUES
('tg_health', '健康生活', '保持身心健康的日常习惯', 'bg-gradient-to-br from-green-400 to-blue-500', 1, true, true),
('tg_learning', '学习成长', '持续学习和自我提升', 'bg-gradient-to-br from-purple-400 to-pink-500', 2, true, true),
('tg_work', '工作效率', '提高工作效率和专注力', 'bg-gradient-to-br from-blue-400 to-indigo-500', 3, true, true),
('tg_life', '生活品质', '提升生活质量和幸福感', 'bg-gradient-to-br from-yellow-400 to-orange-500', 4, true, true)
ON CONFLICT ("id") DO NOTHING;

-- 插入默认任务 - 健康生活
INSERT INTO "tasks" ("id", "name", "description", "icon", "order", "taskGroupId") VALUES
('task_exercise', '运动锻炼', '每天至少30分钟的运动', 'Dumbbell', 1, 'tg_health'),
('task_water', '喝水', '每天喝足够的水（8杯）', 'Droplets', 2, 'tg_health'),
('task_sleep', '早睡', '晚上11点前上床睡觉', 'Moon', 3, 'tg_health'),
('task_meditation', '冥想', '每天10分钟的冥想或放松', 'Brain', 4, 'tg_health')
ON CONFLICT ("id") DO NOTHING;

-- 插入默认任务 - 学习成长
INSERT INTO "tasks" ("id", "name", "description", "icon", "order", "taskGroupId") VALUES
('task_reading', '阅读', '每天阅读至少30分钟', 'BookOpen', 1, 'tg_learning'),
('task_coding', '编程练习', '每天写代码或学习新技术', 'Code', 2, 'tg_learning'),
('task_language', '语言学习', '学习外语或提升语言技能', 'Languages', 3, 'tg_learning'),
('task_skill', '技能提升', '学习新技能或提升专业能力', 'GraduationCap', 4, 'tg_learning')
ON CONFLICT ("id") DO NOTHING;

-- 插入默认任务 - 工作效率
INSERT INTO "tasks" ("id", "name", "description", "icon", "order", "taskGroupId") VALUES
('task_plan', '制定计划', '每天制定工作计划和目标', 'Calendar', 1, 'tg_work'),
('task_focus', '专注工作', '使用番茄工作法等提高专注力', 'Target', 2, 'tg_work'),
('task_review', '工作总结', '每天回顾工作成果和改进点', 'FileText', 3, 'tg_work'),
('task_organize', '整理环境', '保持工作环境整洁有序', 'FolderOpen', 4, 'tg_work')
ON CONFLICT ("id") DO NOTHING;

-- 插入默认任务 - 生活品质
INSERT INTO "tasks" ("id", "name", "description", "icon", "order", "taskGroupId") VALUES
('task_family', '陪伴家人', '与家人共度美好时光', 'Heart', 1, 'tg_life'),
('task_hobby', '兴趣爱好', '培养和享受个人兴趣爱好', 'Palette', 2, 'tg_life'),
('task_nature', '亲近自然', '到户外走走，享受自然', 'TreePine', 3, 'tg_life'),
('task_gratitude', '感恩记录', '记录每天值得感恩的事情', 'Smile', 4, 'tg_life')
ON CONFLICT ("id") DO NOTHING;

-- 创建一个示例用户设置（当用户首次登录时会自动创建）
-- 这里只是展示数据结构，实际会在用户登录时动态创建

COMMENT ON TABLE "users" IS '用户基本信息表 - NextAuth.js 标准';
COMMENT ON TABLE "accounts" IS 'OAuth 账户关联表 - 存储 Google 登录信息';
COMMENT ON TABLE "sessions" IS '用户会话管理表 - NextAuth.js 标准';
COMMENT ON TABLE "verificationtokens" IS '验证令牌表 - NextAuth.js 标准';
COMMENT ON TABLE "user_settings" IS '用户个性化设置表';
COMMENT ON TABLE "task_groups" IS '任务分组表';
COMMENT ON TABLE "tasks" IS '具体任务表';
COMMENT ON TABLE "check_ins" IS '打卡记录表';
COMMENT ON TABLE "streaks" IS '连续打卡统计表';
COMMENT ON TABLE "daily_stats" IS '每日统计表';
