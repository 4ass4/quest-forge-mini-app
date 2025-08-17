const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Конфигурация бота
const BOT_TOKEN = '6441651041:AAF1m6AAIwjIXGuZkaaBUl8Uca9nf0lzbis';
const WEBAPP_URL = 'https://4ass4.github.io/quest-forge-mini-app/';

// Создаем экземпляр бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Создаем Express сервер
const app = express();
app.use(cors());
app.use(express.json());

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  
  try {
    await bot.sendMessage(chatId, 
      `🎮 Добро пожаловать в Quest Forge, ${username}!
      
🚀 Увлекательные квесты ждут вас!
🏆 Соревнуйтесь с другими игроками
💰 Зарабатывайте QUC и покупайте бонусы

Нажмите кнопку "🎮 Играть" чтобы начать!`, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: '🎮 Играть',
              web_app: { url: WEBAPP_URL }
            }],
            [
              { text: '❓ Помощь', callback_data: 'help' },
              { text: '🏆 Рейтинг', callback_data: 'leaderboard' }
            ],
            [
              { text: '👤 Профиль', callback_data: 'profile' },
              { text: '🛒 Магазин', callback_data: 'shop' }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
  }
});

// Обработка команды /help
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId,
      `❓ Как играть в Quest Forge:

1️⃣ Нажмите "🎮 Играть" для запуска Mini App
2️⃣ Выберите квест из списка
3️⃣ Отвечайте на вопросы и зарабатывайте QUC
4️⃣ Используйте подсказки и пропуски при необходимости
5️⃣ Соревнуйтесь в рейтинге с другими игроками

🎯 Цель: пройти как можно больше квестов и занять высокое место в рейтинге!

💡 Дополнительные команды:
/start - Начать игру
/profile - Ваш профиль
/leaderboard - Рейтинг игроков
/shop - Магазин предметов`
    );
  } catch (error) {
    console.error('Ошибка отправки помощи:', error);
  }
});

// Обработка callback запросов
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  try {
    switch (data) {
      case 'help':
        await bot.sendMessage(chatId,
          `❓ Как играть в Quest Forge:

1️⃣ Нажмите "🎮 Играть" для запуска Mini App
2️⃣ Выберите квест из списка
3️⃣ Отвечайте на вопросы и зарабатывайте QUC
4️⃣ Используйте подсказки и пропуски при необходимости
5️⃣ Соревнуйтесь в рейтинге с другими игроками

🎯 Цель: пройти как можно больше квестов и занять высокое место в рейтинге!`
        );
        break;
        
      case 'leaderboard':
        await bot.sendMessage(chatId,
          `🏆 Рейтинг игроков Quest Forge:

🥇 1. Александр - 15,420 очков
🥈 2. Мария - 14,230 очков  
🥉 3. Дмитрий - 13,150 очков
4️⃣ Анна - 12,890 очков
5️⃣ Сергей - 12,340 очков

🎮 Нажмите "🎮 Играть" чтобы улучшить свой результат!`, {
          reply_markup: {
            inline_keyboard: [[
              { text: '🎮 Играть', web_app: { url: WEBAPP_URL } }
            ]]
          }
        });
        break;
        
      case 'profile':
        await bot.sendMessage(chatId,
          `👤 Ваш профиль:

🎮 Игрок: ${query.from.first_name}
🏆 Рейтинг: #127
✅ Пройдено квестов: 12
💰 Баланс: 1,250 QUC
⭐ Средний рейтинг: 4.7

🎯 Продолжайте играть чтобы улучшить статистику!`, {
          reply_markup: {
            inline_keyboard: [[
              { text: '🎮 Играть', web_app: { url: WEBAPP_URL } }
            ]]
          }
        });
        break;
        
      case 'shop':
        await bot.sendMessage(chatId,
          `🛒 Магазин Quest Forge:

💡 Подсказка - 50 QUC
⏭️ Пропуск - 75 QUC
⚡ Удвоитель награды - 300 QUC
🚀 Ускоритель времени - 150 QUC
👑 Премиум квест - 500 QUC

💰 Ваш баланс: 1,250 QUC

🎮 Играйте чтобы заработать больше QUC!`, {
          reply_markup: {
            inline_keyboard: [[
              { text: '🎮 Играть', web_app: { url: WEBAPP_URL } }
            ]]
          }
        });
        break;
    }
    
    // Отвечаем на callback query
    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error('Ошибка обработки callback:', error);
  }
});

// Обработка web app данных
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  
  try {
    console.log('Получены данные от Mini App:', data);
    
    // Здесь можно обработать данные от Mini App
    // Например, сохранить прогресс пользователя
    
    await bot.sendMessage(chatId,
      `🎉 Данные от Mini App получены!
      
📊 Обрабатываем ваш прогресс...
🔄 Обновляем статистику...
✅ Готово!

Продолжайте играть! 🎮`
    );
  } catch (error) {
    console.error('Ошибка обработки web app данных:', error);
  }
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.error('Ошибка polling:', error);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🤖 Бот Quest Forge активен!`);
  console.log(`🌐 Mini App: ${WEBAPP_URL}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Останавливаем сервер...');
  bot.stopPolling();
  process.exit(0);
});

module.exports = { bot, app };
