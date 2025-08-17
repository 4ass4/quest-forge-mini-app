const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// Настройки из .env
const BOT_TOKEN = '6441651041:AAF1m6AAIwjIXGuZkaaBUl8Uca9nf0lzbis';
const PORT = 3000;
const WEBAPP_URL = 'https://4ass4.github.io/quest-forge-mini-app/';

// Создаем бота и Express сервер
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();

// Настройка CORS
app.use(cors({
  origin: [
    'https://4ass4.github.io',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// ======================
// TELEGRAM BOT HANDLERS
// ======================

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Друг';

  const welcomeText = `🎉 <b>Добро пожаловать в Quest Forge, ${firstName}!</b>

🚀 <b>Новое поколение квестов!</b>
Теперь с современным Mini App интерфейсом!

✨ <b>Что вас ждет:</b>
• 🎮 Интерактивные AI-квесты
• 💰 Заработок QUC токенов
• 🏆 Рейтинги и достижения
• 🛒 Магазин улучшений
• 📱 Красивый мобильный интерфейс

👆 <b>Нажмите кнопку ниже для запуска!</b>`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Играть в Quest Forge',
          web_app: { url: WEBAPP_URL }
        }
      ],
      [
        { text: '❓ Помощь', callback_data: 'help' },
        { text: '📊 Статистика', callback_data: 'stats' }
      ]
    ]
  };

  await bot.sendMessage(chatId, welcomeText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
});

// Команда /play - прямой запуск Mini App
bot.onText(/\/play/, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId, 
    '🎮 <b>Запуск Quest Forge!</b>\n\nНажмите кнопку для начала игры:', 
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Играть',
            web_app: { url: WEBAPP_URL }
          }
        ]]
      }
    }
  );
});

// Обработка callback кнопок
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'help') {
    await bot.sendMessage(chatId, 
      '❓ <b>Справка по Quest Forge</b>\n\n' +
      '🎮 <b>Как играть:</b>\n' +
      '• Нажмите "🚀 Играть" для запуска Mini App\n' +
      '• Выберите квест и начните прохождение\n' +
      '• Отвечайте на вопросы и зарабатывайте QUC\n' +
      '• Используйте подсказки при необходимости\n\n' +
      '💰 <b>QUC токены:</b>\n' +
      '• Зарабатывайте за прохождение квестов\n' +
      '• Тратьте в магазине на улучшения\n' +
      '• Выводите на TON кошелек\n\n' +
      '🏆 <b>Рейтинг:</b>\n' +
      '• Соревнуйтесь с другими игроками\n' +
      '• Поднимайтесь в таблице лидеров',
      { parse_mode: 'HTML' }
    );
  }

  if (data === 'stats') {
    // Здесь можно добавить реальную статистику
    await bot.sendMessage(chatId,
      '📊 <b>Статистика Quest Forge</b>\n\n' +
      '👥 Активных игроков: <b>1,247</b>\n' +
      '🎮 Квестов создано: <b>89</b>\n' +
      '💰 QUC в обращении: <b>125,340</b>\n' +
      '🏆 Игр завершено: <b>3,892</b>\n\n' +
      '🚀 Присоединяйтесь к игре!',
      { parse_mode: 'HTML' }
    );
  }

  await bot.answerCallbackQuery(query.id);
});

// ======================
// API ENDPOINTS для Mini App
// ======================

// Получить данные пользователя
app.get('/api/user', (req, res) => {
  const telegramUserId = req.headers['x-telegram-user-id'];
  const telegramUserData = req.headers['x-telegram-user-data'];
  
  // Мок данные пользователя
  res.json({
    id: telegramUserId || 123456789,
    name: 'Тест Пользователь',
    username: 'testuser',
    balance: 1250,
    completedQuests: 12,
    createdQuests: 3,
    rank: 127,
    achievements: ['🎮 Игрок', '🎨 Квестодел', '🏅 Ветеран']
  });
});

// Получить список квестов
app.get('/api/quests', (req, res) => {
  const quests = [
    {
      id: 1,
      title: "Тайны космоса",
      description: "Увлекательное путешествие по галактике",
      difficulty: "Легкий",
      rating: 4.8,
      plays: 1247,
      reward: 50,
      estimatedTime: 10,
      steps: [
        {
          id: 1,
          question: "Какая планета является самой большой в нашей Солнечной системе?",
          answer: "юпитер",
          hint: "Эта планета названа в честь римского бога"
        }
      ]
    },
    {
      id: 2,
      title: "Загадки истории",
      description: "Раскройте секреты древних цивилизаций",
      difficulty: "Средний",
      rating: 4.6,
      plays: 892,
      reward: 75,
      estimatedTime: 15
    },
    {
      id: 3,
      title: "Мир науки",
      description: "Захватывающие научные открытия",
      difficulty: "Сложный",
      rating: 4.9,
      plays: 543,
      reward: 100,
      estimatedTime: 20
    }
  ];
  
  res.json(quests);
});

// Получить конкретный квест
app.get('/api/quests/:id', (req, res) => {
  const questId = parseInt(req.params.id);
  
  // Мок данные квеста
  const quest = {
    id: questId,
    title: "Тайны космоса",
    description: "Увлекательное путешествие по галактике",
    difficulty: "Легкий",
    estimatedTime: 10,
    reward: 50,
    steps: [
      {
        id: 1,
        question: "Какая планета является самой большой в нашей Солнечной системе?",
        answer: "юпитер",
        hint: "Эта планета названа в честь римского бога и имеет множество спутников",
        image: "🪐"
      },
      {
        id: 2,
        question: "Сколько планет в нашей Солнечной системе?",
        answer: "8",
        hint: "Плутон больше не считается планетой с 2006 года"
      },
      {
        id: 3,
        question: "Как называется ближайшая к нам звезда?",
        answer: "солнце",
        hint: "Мы видим её каждый день на небе"
      }
    ]
  };
  
  res.json(quest);
});

// Предметы магазина
app.get('/api/shop/items', (req, res) => {
  const items = [
    {
      id: 'hint_1',
      name: 'Подсказка',
      description: 'Получите подсказку для текущего вопроса',
      price: 50,
      icon: '💡',
      category: 'hints'
    },
    {
      id: 'skip_1',
      name: 'Пропуск',
      description: 'Пропустить сложный вопрос',
      price: 75,
      icon: '⏭️',
      category: 'skips'
    },
    {
      id: 'boost_2x',
      name: 'Удвоитель награды',
      description: 'Удваивает награду за квест на 1 час',
      price: 300,
      icon: '⚡',
      category: 'boosters'
    }
  ];
  
  res.json(items);
});

// Лидерборды
app.get('/api/leaderboard/players', (req, res) => {
  const players = [
    { id: 1, name: 'Александр', username: 'alex_quest', score: 15420, completedQuests: 89, rank: 1 },
    { id: 2, name: 'Мария', username: 'maria_gamer', score: 14230, completedQuests: 76, rank: 2 },
    { id: 3, name: 'Дмитрий', username: 'dmitry_pro', score: 13150, completedQuests: 71, rank: 3 },
    { id: 4, name: 'Анна', username: 'anna_quest', score: 12890, completedQuests: 68, rank: 4 },
    { id: 5, name: 'Сергей', username: 'sergey_top', score: 12340, completedQuests: 65, rank: 5 }
  ];
  
  res.json(players);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log('🚀 Сервер запущен на порту', PORT);
  console.log('🤖 Бот Quest Forge активен!');
  console.log('🌐 Mini App:', WEBAPP_URL);
  console.log('🔗 API доступен на http://localhost:' + PORT + '/api/');
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.log('❌ Ошибка polling:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Unhandled Rejection:', reason);
});
