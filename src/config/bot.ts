export const BOT_CONFIG = {
  // Замените на ваш токен бота
  BOT_TOKEN: '6441651041:AAF1m6AAIwjIXGuZkaaBUl8Uca9nf0lzbis',
  
  // URL вашего Mini App
  WEBAPP_URL: 'https://4ass4.github.io/quest-forge-mini-app/',
  
  // Название бота
  BOT_NAME: 'Quest Forge Bot',
  
  // Команды бота
  COMMANDS: {
    START: '/start',
    HELP: '/help',
    PROFILE: '/profile',
    LEADERBOARD: '/leaderboard',
    SHOP: '/shop'
  },
  
  // Сообщения бота
  MESSAGES: {
    WELCOME: `🎮 Добро пожаловать в Quest Forge!
    
🚀 Увлекательные квесты ждут вас!
🏆 Соревнуйтесь с другими игроками
💰 Зарабатывайте QUC и покупайте бонусы

Нажмите кнопку "🎮 Играть" чтобы начать!`,
    
    HELP: `❓ Как играть в Quest Forge:

1️⃣ Нажмите "🎮 Играть" для запуска Mini App
2️⃣ Выберите квест из списка
3️⃣ Отвечайте на вопросы и зарабатывайте QUC
4️⃣ Используйте подсказки и пропуски при необходимости
5️⃣ Соревнуйтесь в рейтинге с другими игроками

🎯 Цель: пройти как можно больше квестов и занять высокое место в рейтинге!`,
    
    ERROR: '❌ Произошла ошибка. Попробуйте позже.',
    NOT_AVAILABLE: '🚧 Функция пока недоступна. Скоро!'
  }
};

export default BOT_CONFIG;
