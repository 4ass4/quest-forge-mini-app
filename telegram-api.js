import WebApp from '@twa-dev/sdk';

class TelegramAPI {
    constructor() {
        this.tg = WebApp;
        this.init();
    }

    init() {
        // Инициализация Telegram Web App
        this.tg.ready();
        this.setupTheme();
        this.setupHaptics();
    }

    setupTheme() {
        // Применяем тему Telegram
        const themeParams = this.tg.themeParams;
        
        if (themeParams) {
            // Применяем цвета темы к CSS переменным
            const root = document.documentElement;
            
            if (themeParams.bg_color) {
                root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
            }
            if (themeParams.text_color) {
                root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
            }
            if (themeParams.hint_color) {
                root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
            }
            if (themeParams.link_color) {
                root.style.setProperty('--tg-theme-link-color', themeParams.link_color);
            }
            if (themeParams.button_color) {
                root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
            }
            if (themeParams.button_text_color) {
                root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
            }
            if (themeParams.secondary_bg_color) {
                root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
            }
        }

        // Слушаем изменения темы
        this.tg.onEvent('themeChanged', () => {
            this.setupTheme();
        });
    }

    setupHaptics() {
        // Настройка тактильной обратной связи
        if (this.tg.isVersionAtLeast('6.1')) {
            this.tg.HapticFeedback.impactOccurred('medium');
        }
    }

    // Показать алерт
    showAlert(message) {
        this.tg.showAlert(message);
    }

    // Показать подтверждение
    showConfirm(message, callback) {
        this.tg.showConfirm(message, callback);
    }

    // Показать попап
    showPopup(params, callback) {
        if (this.tg.showPopup) {
            this.tg.showPopup(params, callback);
        } else {
            // Fallback для старых версий
            this.showAlert(params.title || 'Уведомление');
        }
    }

    // Открыть ссылку
    openLink(url, options = {}) {
        this.tg.openLink(url, options);
    }

    // Открыть Telegram
    openTelegram(url) {
        this.tg.openTelegramLink(url);
    }

    // Закрыть приложение
    close() {
        this.tg.close();
    }

    // Тактильная обратная связь
    hapticImpact(style = 'medium') {
        if (this.tg.HapticFeedback && this.tg.HapticFeedback.impactOccurred) {
            this.tg.HapticFeedback.impactOccurred(style);
        }
    }

    // Тактильное уведомление
    hapticNotification(type = 'success') {
        if (this.tg.HapticFeedback && this.tg.HapticFeedback.notificationOccurred) {
            this.tg.HapticFeedback.notificationOccurred(type);
        }
    }

    // Получить данные пользователя
    getUser() {
        return this.tg.initDataUnsafe?.user || null;
    }

    // Получить данные чата
    getChat() {
        return this.tg.initDataUnsafe?.chat || null;
    }

    // Получить данные приложения
    getApp() {
        return this.tg.initDataUnsafe?.start_param || null;
    }

    // Проверить версию
    isVersionAtLeast(version) {
        return this.tg.isVersionAtLeast(version);
    }

    // Получить версию
    getVersion() {
        return this.tg.version;
    }

    // Получить платформу
    getPlatform() {
        return this.tg.platform;
    }

    // Получить цветовую схему
    getColorScheme() {
        return this.tg.colorScheme;
    }

    // Получить тему
    getTheme() {
        return this.tg.themeParams;
    }

    // Получить initData для API запросов
    getInitData() {
        return this.tg.initData || '';
    }

    // Получить данные пользователя для API
    getUserData() {
        const user = this.tg.initDataUnsafe?.user;
        if (!user) return null;

        return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            languageCode: user.language_code,
            chatId: this.tg.initDataUnsafe?.chat?.id || user.id
        };
    }

    // Проверить, запущено ли приложение в Telegram
    isTelegramApp() {
        return this.tg.isVersionAtLeast('6.0');
    }

    // Получить основной URL
    getMainButton() {
        return this.tg.MainButton;
    }

    // Получить кнопку назад
    getBackButton() {
        return this.tg.BackButton;
    }
}

// Экспорт для использования в других модулях
export default TelegramAPI; 