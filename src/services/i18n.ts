import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Переводы (пока создаем базовые)
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        leaderboard: "Leaderboard", 
        shop: "Shop",
        profile: "Profile"
      },
      common: {
        loading: "Loading...",
        error: "Error",
        retry: "Retry",
        cancel: "Cancel",
        confirm: "Confirm",
        close: "Close",
        back: "Back",
        next: "Next",
        save: "Save"
      },
      quest: {
        start: "Start Quest",
        continue: "Continue",
        complete: "Complete",
        difficulty: "Difficulty",
        rating: "Rating",
        plays: "Plays",
        reward: "Reward",
        yourAnswer: "Your Answer",
        submit: "Submit Answer",
        correct: "Correct!",
        incorrect: "Incorrect. Try again!",
        hint: "Hint",
        skip: "Skip"
      },
      profile: {
        stats: "Statistics",
        balance: "Balance",
        achievements: "Achievements",
        history: "History",
        completed: "Completed Quests",
        created: "Created Quests",
        totalErrors: "Total Errors",
        avgErrors: "Average Errors"
      },
      shop: {
        buy: "Buy",
        price: "Price",
        owned: "Owned",
        purchase_success: "Purchase successful!",
        insufficient_funds: "Insufficient QUC balance",
        hints: "Hints",
        skips: "Skip Tokens",
        boosters: "Boosters"
      },
      leaderboard: {
        topPlayers: "Top Players",
        topQuests: "Top Quests", 
        topCreators: "Top Creators",
        rank: "Rank",
        score: "Score",
        quests: "Quests"
      }
    }
  },
  ru: {
    translation: {
      nav: {
        home: "Главная",
        leaderboard: "Рейтинг", 
        shop: "Магазин",
        profile: "Профиль"
      },
      common: {
        loading: "Загрузка...",
        error: "Ошибка",
        retry: "Повторить",
        cancel: "Отмена",
        confirm: "Подтвердить",
        close: "Закрыть",
        back: "Назад",
        next: "Далее",
        save: "Сохранить"
      },
      quest: {
        start: "Начать квест",
        continue: "Продолжить",
        complete: "Завершить",
        difficulty: "Сложность",
        rating: "Рейтинг",
        plays: "Прохождений",
        reward: "Награда",
        yourAnswer: "Ваш ответ",
        submit: "Отправить ответ",
        correct: "Правильно!",
        incorrect: "Неправильно. Попробуйте ещё раз!",
        hint: "Подсказка",
        skip: "Пропустить"
      },
      profile: {
        stats: "Статистика",
        balance: "Баланс",
        achievements: "Достижения", 
        history: "История",
        completed: "Пройдено квестов",
        created: "Создано квестов",
        totalErrors: "Всего ошибок",
        avgErrors: "Средние ошибки"
      },
      shop: {
        buy: "Купить",
        price: "Цена",
        owned: "В наличии",
        purchase_success: "Покупка успешна!",
        insufficient_funds: "Недостаточно QUC",
        hints: "Подсказки",
        skips: "Пропуски",
        boosters: "Бустеры"
      },
      leaderboard: {
        topPlayers: "Топ игроков",
        topQuests: "Топ квестов",
        topCreators: "Топ авторов", 
        rank: "Место",
        score: "Очки",
        quests: "Квесты"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n; 
