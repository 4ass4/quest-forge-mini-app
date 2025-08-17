-- Quest Forge Database Setup for Supabase
-- Выполните этот скрипт в SQL Editor Supabase

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  language_code TEXT DEFAULT 'ru',
  is_premium BOOLEAN DEFAULT false,
  
  -- Игровые характеристики
  balance INTEGER DEFAULT 100,
  total_score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  
  -- Статистика
  quests_completed INTEGER DEFAULT 0,
  quests_created INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  total_wrong_answers INTEGER DEFAULT 0,
  total_hints_used INTEGER DEFAULT 0,
  total_skips_used INTEGER DEFAULT 0,
  
  -- Системные поля
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы достижений
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы достижений пользователей
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Создание таблицы квестов
CREATE TABLE IF NOT EXISTS quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  category TEXT NOT NULL,
  estimated_time INTEGER NOT NULL,
  reward INTEGER NOT NULL,
  plays INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_official BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы шагов квестов
CREATE TABLE IF NOT EXISTS quest_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  hint TEXT,
  explanation TEXT,
  image TEXT,
  time_limit INTEGER,
  points INTEGER DEFAULT 10,
  UNIQUE(quest_id, step_number)
);

-- Создание таблицы прогресса квестов
CREATE TABLE IF NOT EXISTS quest_progresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  skips_used INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Создание таблицы товаров магазина
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT CHECK (category IN ('HINTS', 'SKIPS', 'BOOSTERS', 'THEMES', 'COSMETICS')),
  max_owned INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы покупок
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES shop_items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  total_price INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_total_score ON users(total_score);
CREATE INDEX IF NOT EXISTS idx_quest_progresses_user_quest ON quest_progresses(user_id, quest_id);
CREATE INDEX IF NOT EXISTS idx_achievements_key ON achievements(key);

-- Вставка стартового достижения
INSERT INTO achievements (key, title, description, icon, points) 
VALUES ('first_steps', 'Первые шаги', 'Добро пожаловать в Quest Forge!', '🎮', 10)
ON CONFLICT (key) DO NOTHING;

-- Вставка базовых товаров магазина
INSERT INTO shop_items (key, name, description, icon, price, category) VALUES
('hint', 'Подсказка', 'Получить подсказку для текущего вопроса', '💡', 50, 'HINTS'),
('skip', 'Пропуск', 'Пропустить текущий вопрос', '⏭️', 75, 'SKIPS'),
('booster_xp', 'Бустер опыта x2', 'Удвоить опыт за прохождение квеста', '🚀', 100, 'BOOSTERS'),
('theme_dark', 'Темная тема', 'Новая темная тема для приложения', '🎨', 150, 'THEMES')
ON CONFLICT (key) DO NOTHING;

-- Включение Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_progresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для чтения (все могут читать)
CREATE POLICY "Allow read access to all" ON users FOR SELECT USING (true);
CREATE POLICY "Allow read access to all" ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow read access to all" ON quests FOR SELECT USING (true);
CREATE POLICY "Allow read access to all" ON shop_items FOR SELECT USING (true);

-- Политики для пользователей (только свои данные)
CREATE POLICY "Users can manage own data" ON users FOR ALL USING (telegram_id = current_setting('app.telegram_id')::bigint);
CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (user_id IN (SELECT id FROM users WHERE telegram_id = current_setting('app.telegram_id')::bigint));
CREATE POLICY "Users can manage own progress" ON quest_progresses FOR ALL USING (user_id IN (SELECT id FROM users WHERE telegram_id = current_setting('app.telegram_id')::bigint));
CREATE POLICY "Users can manage own purchases" ON purchases FOR ALL USING (user_id IN (SELECT id FROM users WHERE telegram_id = current_setting('app.telegram_id')::bigint));

-- Политики для создания/обновления (все могут создавать)
CREATE POLICY "Allow insert for all" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for own data" ON users FOR UPDATE USING (telegram_id = current_setting('app.telegram_id')::bigint);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quest_progresses_updated_at BEFORE UPDATE ON quest_progresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Пользователи Telegram с игровой статистикой';
COMMENT ON TABLE achievements IS 'Достижения в игре';
COMMENT ON TABLE quests IS 'Квесты для прохождения';
COMMENT ON TABLE shop_items IS 'Товары в магазине';
COMMENT ON TABLE quest_progresses IS 'Прогресс пользователей по квестам';
