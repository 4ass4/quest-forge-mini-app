import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import './styles.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Инициализация...');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setDebugInfo('Инициализация Telegram Web App...');
        
        // Инициализируем Telegram Web App
        WebApp.ready();
        WebApp.expand();

        setDebugInfo('Получение данных пользователя...');
        
        // Получаем данные пользователя
        const user = WebApp.initDataUnsafe?.user;
        
        if (user) {
          setDebugInfo(`Пользователь найден: ${user.id}`);
          // Загружаем баланс пользователя
          const userBalance = await loadUserBalance(user.id);
          setBalance(userBalance);
          setDebugInfo(`Баланс загружен: ${userBalance} QUC`);
        } else {
          setDebugInfo('Пользователь не найден, используем тестовый режим');
        }
        
        setIsLoading(false);
        setDebugInfo('Приложение готово!');
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setError('Ошибка инициализации приложения');
        setIsLoading(false);
        setDebugInfo(`Ошибка: ${error}`);
      }
    };

    initializeApp();
  }, []);

  const loadUserBalance = async (userId: number): Promise<number> => {
    try {
      console.log('Загрузка баланса для пользователя:', userId);
      
      const response = await fetch('http://localhost:3001/api/user-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          chatId: userId
        }),
      });

      console.log('Ответ API:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Данные баланса:', data);
        return data.balance || 0;
      } else {
        console.error('Ошибка API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки баланса:', error);
    }
    return 0;
  };

  const handleGetBalance = async () => {
    try {
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        const newBalance = await loadUserBalance(user.id);
        setBalance(newBalance);
        WebApp.showAlert(`Ваш баланс: ${newBalance} QUC`);
      } else {
        WebApp.showAlert('Пользователь не найден');
      }
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
      WebApp.showAlert('Ошибка получения баланса');
    }
  };

  const handleStartQuest = () => {
    WebApp.showAlert('Функция запуска квеста в разработке');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Quest Forge</h2>
        <p>Загрузка приложения...</p>
        <p style={{fontSize: '12px', opacity: 0.7}}>{debugInfo}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <p style={{fontSize: '12px', opacity: 0.7}}>{debugInfo}</p>
        <button onClick={() => window.location.reload()}>
          Перезагрузить
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Quest Forge</h1>
        <p>Ваш баланс: {balance} QUC</p>
      </div>
      
      <div className="main-content">
        <button className="action-button" onClick={handleGetBalance}>
          Получить баланс
        </button>
        
        <button className="action-button" onClick={handleStartQuest}>
          Начать квест
        </button>
      </div>
      
      <div style={{position: 'fixed', bottom: '10px', left: '10px', fontSize: '10px', opacity: 0.5}}>
        Debug: {debugInfo}
      </div>
    </div>
  );
};

export default App; 