import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';

// Страницы
import HomePage from './pages/HomePage';
import QuestPlay from './pages/QuestPlay';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Shop from './pages/Shop';

// Компоненты
import Navigation from './components/common/Navigation';
import SplashScreen from './components/common/SplashScreen';
// import LoadingScreen from './components/common/LoadingScreen'; // Не используется в текущей версии
import ErrorBoundary from './components/common/ErrorBoundary';

// Hooks
import { useTelegram } from './hooks/useTelegram';

const manifestUrl = 'https://your-domain.com/tonconnect-manifest.json';

function AppContent() {
  const { tg, isReady } = useTelegram();
  const [showSplash, setShowSplash] = useState(true);
  
  // Добавляем отладочную информацию
  console.log('App: Компонент загружен');
  console.log('App: Telegram WebApp ready:', isReady);
  console.log('App: Telegram object:', tg);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Применяем цветовую схему Telegram
    if (tg?.themeParams) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#17212b');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#8596a3');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#62a6ff');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#3b82f6');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    }
    
    // Применяем тему к body
    if (tg?.colorScheme) {
      document.body.setAttribute('data-theme', tg.colorScheme);
    }
  }, [tg]);

  // Показываем SplashScreen при первом запуске
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-telegram-bg text-telegram-text">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quest/:id" element={<QuestPlay />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/shop" element={<Shop />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <AppContent />
        </TonConnectUIProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;