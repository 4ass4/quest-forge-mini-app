import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { TelegramUser } from '../types';

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initTelegram = () => {
      try {
        WebApp.ready();
        WebApp.expand();
        
        const telegramUser = WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('Ошибка инициализации Telegram:', error);
      }
    };

    if (WebApp.isVersionAtLeast('6.0')) {
      initTelegram();
    } else {
      console.warn('Версия Telegram Web App слишком старая');
      setIsReady(true);
    }
  }, []);

  const showAlert = (message: string) => {
    if (WebApp.showAlert) {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (WebApp.showConfirm) {
      WebApp.showConfirm(message, callback);
    } else {
      const confirmed = confirm(message);
      callback(confirmed);
    }
  };

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (WebApp.HapticFeedback?.impactOccurred) {
      WebApp.HapticFeedback.impactOccurred(style);
    }
  };

  const hapticNotification = (type: 'error' | 'success' | 'warning' = 'success') => {
    if (WebApp.HapticFeedback?.notificationOccurred) {
      WebApp.HapticFeedback.notificationOccurred(type);
    }
  };

  const close = () => {
    WebApp.close();
  };

  const getThemeParams = () => {
    return WebApp.themeParams;
  };

  const getColorScheme = () => {
    return WebApp.colorScheme;
  };

  const getPlatform = () => {
    return WebApp.platform;
  };

  return {
    user,
    isReady,
    showAlert,
    showConfirm,
    hapticImpact,
    hapticNotification,
    close,
    getThemeParams,
    getColorScheme,
    getPlatform,
  };
}; 