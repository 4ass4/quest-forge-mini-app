import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        enableClosingConfirmation: () => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        initDataUnsafe: {
          user?: TelegramUser;
          start_param?: string;
        };
        platform?: string;
        colorScheme?: 'light' | 'dark';
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      
      if (tg) {
        console.log('🎉 Telegram WebApp обнаружен!', tg);
        
        // Инициализируем Telegram WebApp
        if (typeof tg.ready === 'function') {
          tg.ready();
        }
        if (typeof tg.expand === 'function') {
          tg.expand();
        }
        
        // Получаем пользователя
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
          console.log('✅ Пользователь Telegram получен:', tg.initDataUnsafe.user);
        } else {
          console.log('⚠️ Данные пользователя недоступны, используем мок');
          const mockUser: TelegramUser = {
            id: 123456789,
            first_name: 'Тест',
            last_name: 'Пользователь',
            username: 'testuser',
            language_code: 'ru',
            is_premium: false,
          };
          setUser(mockUser);
        }
        
        // Применяем тему Telegram
        if (tg.themeParams) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#17212b');
          document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
          document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#8596a3');
          document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#62a6ff');
          document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#62a6ff');
          document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
        }
        
        // Устанавливаем основной цвет
        if (tg.themeParams?.bg_color) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        
      } else {
        console.log('⚠️ Telegram WebApp недоступен, используется мок пользователь');
        const mockUser: TelegramUser = {
          id: 123456789,
          first_name: 'Тест',
          last_name: 'Пользователь',
          username: 'testuser',
          language_code: 'ru',
          is_premium: false,
        };
        setUser(mockUser);
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('❌ Ошибка инициализации Telegram:', error);
      // Fallback к мок пользователю
      const mockUser: TelegramUser = {
        id: 123456789,
        first_name: 'Тест',
        last_name: 'Пользователь',
        username: 'testuser',
        language_code: 'ru',
        is_premium: false,
      };
      setUser(mockUser);
      setIsReady(true);
    }
  }, []);

  const showAlert = (message: string) => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.showAlert) {
        tg.showAlert(message);
      } else {
        alert(message);
      }
    } catch (error) {
      console.warn('Ошибка showAlert:', error);
      alert(message);
    }
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg?.showConfirm) {
          tg.showConfirm(message, (confirmed) => {
            resolve(confirmed);
          });
        } else {
          resolve(confirm(message));
        }
      } catch (error) {
        console.warn('Ошибка showConfirm:', error);
        resolve(confirm(message));
      }
    });
  };

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection' = 'impact') => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        switch (type) {
          case 'impact':
            tg.HapticFeedback.impactOccurred('medium');
            break;
          case 'notification':
            tg.HapticFeedback.notificationOccurred('success');
            break;
          case 'selection':
            tg.HapticFeedback.selectionChanged();
            break;
        }
      }
    } catch (error) {
      console.warn('Haptic feedback недоступен:', error);
    }
  };

  const close = () => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.close) {
        tg.close();
      }
    } catch (error) {
      console.warn('Не удалось закрыть WebApp:', error);
    }
  };

  // Безопасное получение platform и colorScheme
  const platform = window.Telegram?.WebApp?.platform || 'web';
  const colorScheme = window.Telegram?.WebApp?.colorScheme || 'dark';

  return {
    tg: window.Telegram?.WebApp || null,
    user,
    isReady,
    showAlert,
    showConfirm,
    close,
    hapticFeedback,
    platform,
    colorScheme,
  };
};