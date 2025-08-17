# Quest Forge Telegram Bot

Telegram бот для Mini App Quest Forge с интеграцией Supabase.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` в корне папки `server`:

```env
# Telegram Bot
BOT_TOKEN=6441651041:AAF1m6AAIwjIXGuZkaaBUl8Uca9nf0lzbis
WEBAPP_URL=https://4ass4.github.io/quest-forge-mini-app/

# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://eyqfxkllsmnlqefbiibi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cWZ4a2xsc21ubHFlZmJpaWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDM2OTcsImV4cCI6MjA3MTAxOTY5N30.G-XfgSziZ2VrqjOogkNHbpumEjcDs2gb_BJ7wAMRq7Y

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Настройка базы данных Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект `eyqfxkllsmnlqefbiibi`
3. Перейдите в **SQL Editor**
4. Скопируйте содержимое файла `supabase-setup.sql`
5. Выполните SQL скрипт

### 4. Запуск бота

**Режим разработки (с автоперезагрузкой):**
```bash
npm run dev
```

**Продакшн режим:**
```bash
npm start
```

## 📋 Команды бота

- `/start` - Регистрация и приветствие
- `/help` - Справка по игре

## 🎮 Функции

- ✅ **Регистрация пользователей** при первом `/start`
- ✅ **Профиль игрока** с статистикой
- ✅ **Рейтинг игроков** по очкам
- ✅ **Магазин** с игровыми товарами
- ✅ **Достижения** система
- ✅ **Интеграция с Mini App**

## 🗄️ Структура базы данных

### Таблицы:
- `users` - Пользователи Telegram
- `achievements` - Достижения
- `user_achievements` - Достижения пользователей
- `quests` - Квесты
- `quest_steps` - Шаги квестов
- `quest_progresses` - Прогресс по квестам
- `shop_items` - Товары магазина
- `purchases` - Покупки

## 🔧 Технологии

- **Node.js** - Серверная платформа
- **node-telegram-bot-api** - Telegram Bot API
- **@supabase/supabase-js** - Supabase клиент
- **dotenv** - Переменные окружения

## 📁 Структура проекта

```
server/
├── services/
│   └── supabaseService.js    # Сервис для работы с Supabase
├── simple-bot.js             # Основной файл бота
├── bot.js                    # Расширенная версия бота
├── package.json              # Зависимости
├── .env                      # Переменные окружения
├── supabase-setup.sql        # SQL скрипт для настройки БД
└── README.md                 # Документация
```

## 🚨 Устранение неполадок

### Ошибка подключения к Supabase
1. Проверьте правильность `SUPABASE_URL` и `SUPABASE_ANON_KEY`
2. Убедитесь что SQL скрипт выполнен в Supabase
3. Проверьте настройки Row Level Security (RLS)

### Ошибка Telegram Bot
1. Проверьте правильность `BOT_TOKEN`
2. Убедитесь что бот не заблокирован
3. Проверьте логи в консоли

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь что все переменные окружения настроены
3. Проверьте что база данных Supabase настроена

## 🎯 Следующие шаги

- [ ] Интеграция с Mini App для обновления статистики
- [ ] Система уровней и опыта
- [ ] Создание пользовательских квестов
- [ ] Система друзей и команд
- [ ] Уведомления о достижениях
