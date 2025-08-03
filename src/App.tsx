import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { useTelegram } from './hooks/useTelegram';
import { useQuestEngine } from './hooks/useQuestEngine';
import { useTONConnect } from './hooks/useTONConnect';
import { MainMenu } from './components/MainMenu';
import { QuestList } from './components/QuestList';
import { QuestPlaying } from './components/QuestPlaying';
import { Wallet } from './components/Wallet';
import { Shop } from './components/Shop';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppState, Screen } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: Screen.LOADING,
    user: null,
    balance: 0,
    isLoading: true,
    error: null,
  });

  const telegram = useTelegram();
  const questEngine = useQuestEngine();
  const tonConnect = useTONConnect();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инициализируем Telegram Web App
        WebApp.ready();
        WebApp.expand();

        // Получаем данные пользователя
        const user = WebApp.initDataUnsafe?.user;
        
        if (user) {
          // Загружаем баланс пользователя
          const balance = await loadUserBalance(user.id);
          
          setAppState(prev => ({
            ...prev,
            user,
            balance,
            currentScreen: Screen.MAIN_MENU,
            isLoading: false,
          }));
        } else {
          setAppState(prev => ({
            ...prev,
            currentScreen: Screen.MAIN_MENU,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setAppState(prev => ({
          ...prev,
          error: 'Ошибка инициализации приложения',
          isLoading: false,
        }));
      }
    };

    initializeApp();
  }, []);

  const loadUserBalance = async (userId: number): Promise<number> => {
    try {
      const response = await fetch('http://localhost:3001/api/user-balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': WebApp.initData || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.balance || 0;
      }
    } catch (error) {
      console.error('Ошибка загрузки баланса:', error);
    }
    return 0;
  };

  const handleScreenChange = (screen: Screen) => {
    setAppState(prev => ({
      ...prev,
      currentScreen: screen,
    }));
  };

  const handleError = (error: string) => {
    setAppState(prev => ({
      ...prev,
      error,
    }));
    WebApp.showAlert(error);
  };

  if (appState.isLoading) {
    return <LoadingScreen />;
  }

  if (appState.error) {
    return (
      <div className="error-screen">
        <h2>Ошибка</h2>
        <p>{appState.error}</p>
        <button onClick={() => window.location.reload()}>
          Перезагрузить
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary onError={handleError}>
      <div className="app">
        {appState.currentScreen === Screen.MAIN_MENU && (
          <MainMenu
            user={appState.user}
            balance={appState.balance}
            onScreenChange={handleScreenChange}
          />
        )}
        
        {appState.currentScreen === Screen.QUEST_LIST && (
          <QuestList
            onScreenChange={handleScreenChange}
            questEngine={questEngine}
          />
        )}
        
        {appState.currentScreen === Screen.QUEST_PLAYING && (
          <QuestPlaying
            onScreenChange={handleScreenChange}
            questEngine={questEngine}
          />
        )}
        
        {appState.currentScreen === Screen.WALLET && (
          <Wallet
            user={appState.user}
            balance={appState.balance}
            onScreenChange={handleScreenChange}
            tonConnect={tonConnect}
          />
        )}
        
        {appState.currentScreen === Screen.SHOP && (
          <Shop
            user={appState.user}
            balance={appState.balance}
            onScreenChange={handleScreenChange}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App; 