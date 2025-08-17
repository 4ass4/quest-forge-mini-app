const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || '6441651041:AAF1m6AAIwjIXGuZkaaBUl8Uca9nf0lzbis';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://4ass4.github.io/quest-forge-mini-app/';

// Импортируем Supabase сервис
const supabaseService = require('./services/supabaseService');

// Создаем бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Quest Forge Bot запущен!');
console.log('🌐 Mini App:', WEBAPP_URL);
console.log('🗄️ Supabase подключен');

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramUser = msg.from;
  const firstName = telegramUser.first_name || 'игрок';
  
  try {
    console.log(`🔄 Обработка /start от пользователя ${telegramUser.id} (@${telegramUser.username})`);
    
    // Регистрируем или получаем пользователя из Supabase
    const user = await supabaseService.createOrGetUser(telegramUser);
    
    console.log(`✅ Пользователь ${user.first_name} обработан. Баланс: ${user.balance} QUC`);
    
    // Формируем приветственное сообщение
    let welcomeMessage = `🎮 Добро пожаловать в Quest Forge, ${firstName}!`;
    
    if (user.quests_completed > 0) {
      welcomeMessage += `\n\n🏆 Ваш прогресс:\n`;
      welcomeMessage += `📊 Уровень: ${user.level}\n`;
      welcomeMessage += `💰 Баланс: ${user.balance} QUC\n`;
      welcomeMessage += `✅ Квестов пройдено: ${user.quests_completed}\n`;
      welcomeMessage += `⭐ Общий счет: ${user.total_score}`;
    } else {
      welcomeMessage += `\n\n🎁 Добро пожаловать! Вы получили стартовый бонус 100 QUC!`;
    }
    
    welcomeMessage += `\n\n🚀 Увлекательные квесты ждут вас!`;
    
    await bot.sendMessage(chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎮 Играть',
              web_app: { url: WEBAPP_URL }
            }
          ],
          [
            { text: '👤 Профиль', callback_data: 'profile' },
            { text: '🏆 Рейтинг', callback_data: 'leaderboard' }
          ],
          [
            { text: '❓ Помощь', callback_data: 'help' },
            { text: '💰 Магазин', callback_data: 'shop' }
          ]
        ]
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка обработки /start:', error);
    
    // Отправляем сообщение об ошибке пользователю
    await bot.sendMessage(chatId, 
      `😔 Произошла ошибка при регистрации. Попробуйте позже или обратитесь к администратору.`
    );
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

🎯 Цель: пройти как можно больше квестов и занять высокое место в рейтинге!`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎮 Играть',
                web_app: { url: WEBAPP_URL }
              }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Ошибка отправки help:', error);
  }
});

// Обработка callback запросов
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  try {
    switch (data) {
      case 'profile':
        await bot.answerCallbackQuery(query.id);
        try {
          const telegramUser = query.from;
          const user = await supabaseService.getUserByTelegramId(telegramUser.id);
          
          if (user) {
            // Безопасная обработка дат
            const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно';
            const lastActiveDate = user.last_active_at ? new Date(user.last_active_at).toLocaleDateString('ru-RU') : 'Неизвестно';
            
            const profileMessage = `👤 **Профиль игрока ${user.first_name}**
            
📊 **Статистика:**
🆙 Уровень: ${user.level || 1}
⭐ Опыт: ${user.experience || 0}
💰 Баланс: ${user.balance || 0} QUC
🏆 Общий счет: ${user.total_score || 0}

✅ **Достижения:**
🎯 Квестов пройдено: ${user.quests_completed || 0}
🎨 Квестов создано: ${user.quests_created || 0}
🎯 Правильных ответов: ${user.total_correct_answers || 0}
❌ Неправильных ответов: ${user.total_wrong_answers || 0}
💡 Подсказок использовано: ${user.total_hints_used || 0}
⏭️ Пропусков использовано: ${user.total_skips_used || 0}

📅 Дата регистрации: ${createdDate}
🕐 Последняя активность: ${lastActiveDate}`;

            await bot.sendMessage(chatId, profileMessage, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '🔄 Обновить', callback_data: 'profile' }],
                  [{ text: '🎮 Играть', web_app: { url: WEBAPP_URL } }]
                ]
              }
            });
          } else {
            await bot.sendMessage(chatId, '❌ Профиль не найден. Попробуйте /start');
          }
        } catch (error) {
          console.error('❌ Ошибка получения профиля:', error);
          await bot.sendMessage(chatId, '❌ Ошибка получения профиля');
        }
        break;
        
      case 'shop':
        await bot.answerCallbackQuery(query.id);
        try {
          const telegramUser = query.from;
          const user = await supabaseService.getUserByTelegramId(telegramUser.id);
          
          const shopMessage = `💰 **Магазин Quest Forge**
          
🛒 **Доступные товары:**
💡 Подсказка - 50 QUC
⏭️ Пропуск вопроса - 75 QUC
🚀 Бустер опыта x2 - 100 QUC
🎨 Новая тема - 150 QUC

💎 **Как купить:**
1️⃣ Откройте Mini App
2️⃣ Перейдите в раздел "Магазин"
3️⃣ Выберите товар
4️⃣ Подтвердите покупку

💰 **Ваш баланс:** ${user?.balance || 0} QUC`;

          await bot.sendMessage(chatId, shopMessage, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🛒 Открыть магазин', web_app: { url: WEBAPP_URL } }],
                [{ text: '👤 Профиль', callback_data: 'profile' }]
              ]
            }
          });
        } catch (error) {
          console.error('❌ Ошибка получения магазина:', error);
          await bot.sendMessage(chatId, '❌ Ошибка получения магазина');
        }
        break;
        
      case 'help':
        await bot.answerCallbackQuery(query.id);
        await bot.sendMessage(chatId,
          `❓ Как играть в Quest Forge:

1️⃣ Нажмите "🎮 Играть" для запуска Mini App
2️⃣ Выберите квест из списка
3️⃣ Отвечайте на вопросы и зарабатывайте QUC
4️⃣ Используйте подсказки и пропуски при необходимости
5️⃣ Соревнуйтесь в рейтинге с другими игроками

🎯 Цель: пройти как можно больше квестов и занять высокое место в рейтинге!`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🎮 Играть',
                    web_app: { url: WEBAPP_URL }
                  }
                ]
              ]
            }
          }
        );
        break;
        
      case 'leaderboard':
        await bot.answerCallbackQuery(query.id);
        try {
          const topPlayers = await supabaseService.getTopPlayers(5);
          
          let leaderboardMessage = `🏆 **Топ игроков Quest Forge:**\n\n`;
          
          if (topPlayers.length > 0) {
            topPlayers.forEach((player, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}️⃣`;
              leaderboardMessage += `${medal} ${player.first_name} (@${player.username || 'без username'})\n`;
              leaderboardMessage += `   ⭐ ${player.total_score} очков | 🎯 ${player.quests_completed} квестов | 🆙 ${player.level} уровень\n\n`;
            });
          } else {
            leaderboardMessage += `😔 Пока нет данных о игроках\n`;
          }
          
          leaderboardMessage += `Откройте Mini App для подробного рейтинга!`;
          
          await bot.sendMessage(chatId, leaderboardMessage, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🎮 Играть',
                    web_app: { url: WEBAPP_URL }
                  }
                ],
                [{ text: '🔄 Обновить', callback_data: 'leaderboard' }]
              ]
            }
          });
        } catch (error) {
          console.error('❌ Ошибка получения рейтинга:', error);
          await bot.sendMessage(chatId, '❌ Ошибка получения рейтинга');
        }
        break;
        
      default:
        await bot.answerCallbackQuery(query.id, 'Функция скоро будет доступна!');
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callback:', error);
  }
});

// Обработка web app данных
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  
  try {
    console.log('Получены данные от Mini App:', data);
    
    await bot.sendMessage(chatId,
      `🎉 Отличная игра!
      
📊 Ваш прогресс сохранен
🔄 Статистика обновлена
✅ Продолжайте играть!

Удачи в следующих квестах! 🎮`
    );
  } catch (error) {
    console.error('Ошибка обработки web app данных:', error);
  }
});

// Обработка ошибок
bot.on('error', (error) => {
  console.log('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.log('❌ Ошибка polling:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Unhandled Rejection:', reason);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Останавливаем бота...');
  bot.stopPolling();
  process.exit(0);
});

module.exports = { bot };
