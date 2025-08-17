const ru = require('../locales/ru');
const en = require('../locales/en');

class LocalizationService {
  constructor() {
    this.locales = {
      ru,
      en
    };
    
    // Определяем язык по умолчанию
    this.defaultLocale = 'ru';
  }
  
  // Получаем язык пользователя из Telegram
  getUserLanguage(telegramUser) {
    if (telegramUser.language_code) {
      const lang = telegramUser.language_code.toLowerCase();
      // Поддерживаемые языки
      if (this.locales[lang]) {
        return lang;
      }
      // Если язык не поддерживается, проверяем основную часть
      const mainLang = lang.split('-')[0];
      if (this.locales[mainLang]) {
        return mainLang;
      }
    }
    
    // Возвращаем язык по умолчанию
    return this.defaultLocale;
  }
  
  // Получаем локализованный текст
  getText(key, locale = this.defaultLocale, params = {}) {
    const selectedLocale = this.locales[locale] || this.locales[this.defaultLocale];
    
    // Поддерживаем вложенные ключи (например: 'buttons.play')
    const keys = key.split('.');
    let text = selectedLocale;
    
    for (const k of keys) {
      if (text && text[k]) {
        text = text[k];
      } else {
        // Если ключ не найден, возвращаем ключ как есть
        return key;
      }
    }
    
    // Если это массив (например, шаги помощи), возвращаем как есть
    if (Array.isArray(text)) {
      return text;
    }
    
    // Заменяем параметры в тексте
    if (typeof text === 'string' && params) {
      return this.replaceParams(text, params);
    }
    
    return text;
  }
  
  // Заменяем параметры в тексте
  replaceParams(text, params) {
    let result = text;
    
    for (const [key, value] of Object.entries(params)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return result;
  }
  
  // Получаем локализованные кнопки
  getButtons(buttonKeys, locale = this.defaultLocale) {
    const buttons = [];
    
    for (const row of buttonKeys) {
      const buttonRow = [];
      for (const button of row) {
        if (typeof button === 'string') {
          // Простая кнопка с текстом
          buttonRow.push({
            text: this.getText(`buttons.${button}`, locale)
          });
        } else if (button.text) {
          // Кнопка с кастомным текстом
          buttonRow.push({
            ...button,
            text: this.getText(button.text, locale)
          });
        } else {
          // Кнопка без изменений
          buttonRow.push(button);
        }
      }
      buttons.push(buttonRow);
    }
    
    return buttons;
  }
  
  // Получаем локализованное сообщение профиля
  getProfileMessage(user, locale = this.defaultLocale) {
    const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU') : 'Unknown';
    const lastActiveDate = user.last_active_at ? new Date(user.last_active_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU') : 'Unknown';
    
    let message = this.getText('profile.title', locale, { firstName: user.first_name }) + '\n\n';
    message += this.getText('profile.stats', locale) + '\n';
    message += this.getText('level', locale, { level: user.level || 1 }) + '\n';
    message += this.getText('balance', locale, { balance: user.balance || 0 }) + '\n';
    message += this.getText('totalScore', locale, { score: user.total_score || 0 }) + '\n\n';
    
    message += this.getText('profile.achievements', locale) + '\n';
    message += this.getText('questsCompleted', locale, { count: user.quests_completed || 0 }) + '\n';
    message += this.getText('registrationDate', locale, { date: createdDate }) + '\n';
    message += this.getText('lastActive', locale, { date: lastActiveDate });
    
    return message;
  }
  
  // Получаем локализованное сообщение магазина
  getShopMessage(user, locale = this.defaultLocale) {
    let message = this.getText('shop.title', locale) + '\n\n';
    message += this.getText('shop.availableItems', locale) + '\n';
    
    const items = this.getText('shop.items', locale);
    items.forEach(item => {
      message += item + '\n';
    });
    
    message += '\n' + this.getText('shop.howToBuy', locale) + '\n';
    const buySteps = this.getText('shop.buySteps', locale);
    buySteps.forEach(step => {
      message += step + '\n';
    });
    
    message += '\n' + this.getText('shop.yourBalance', locale, { balance: user?.balance || 0 });
    
    return message;
  }
  
  // Получаем локализованное сообщение рейтинга
  getLeaderboardMessage(players, locale = this.defaultLocale) {
    let message = this.getText('leaderboard.title', locale) + '\n\n';
    
    if (players.length > 0) {
      players.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}️⃣`;
        message += `${medal} ${player.first_name} (@${player.username || 'no username'})\n`;
        message += this.getText('leaderboard.playerInfo', locale, {
          score: player.total_score,
          quests: player.quests_completed,
          level: player.level
        }) + '\n\n';
      });
    } else {
      message += this.getText('leaderboard.noData', locale) + '\n';
    }
    
    message += this.getText('leaderboard.openForDetails', locale);
    
    return message;
  }
}

module.exports = new LocalizationService();
