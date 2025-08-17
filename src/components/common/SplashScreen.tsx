import React, { useEffect, useState } from 'react';
import { Zap, Star, Trophy, Play } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Анимация появления контента
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500); // Увеличили время появления контента

    // Анимация прогресса загрузки (медленнее для красоты)
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onFinish, 1500); // Увеличенная задержка для показа завершенной анимации
          return 100;
        }
        return prev + 1; // Медленнее прогресс (было 2, стало 1)
      });
    }, 50); // Увеличили интервал (было 30ms, стало 50ms)

    return () => {
      clearTimeout(contentTimer);
      clearInterval(progressTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center text-white z-50">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-blue-400 opacity-20">
          <Star size={24} />
        </div>
        <div className="absolute top-40 right-16 text-purple-400 opacity-30">
          <Trophy size={32} />
        </div>
        <div className="absolute bottom-32 left-20 text-indigo-400 opacity-25">
          <Zap size={28} />
        </div>
        <div className="absolute top-60 left-1/2 text-blue-300 opacity-20">
          <Star size={20} />
        </div>
        <div className="absolute bottom-40 right-10 text-purple-300 opacity-25">
          <Play size={24} />
        </div>
      </div>

      {/* Основной контент */}
      <div className={`text-center transition-all duration-1000 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
        {/* Логотип */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold">🎮</span>
          </div>
          
          {/* Название */}
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quest Forge
          </h1>
          <p className="text-lg text-gray-300">
            Увлекательные квесты ждут вас!
          </p>
        </div>

        {/* Особенности */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
              <Star className="text-blue-400" size={24} />
            </div>
            <p className="text-sm text-gray-300">Интересные<br/>задания</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500 bg-opacity-30 rounded-full flex items-center justify-center">
              <Trophy className="text-purple-400" size={24} />
            </div>
            <p className="text-sm text-gray-300">Соревнования<br/>и рейтинг</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center">
              <Zap className="text-indigo-400" size={24} />
            </div>
            <p className="text-sm text-gray-300">Бонусы<br/>и награды</p>
          </div>
        </div>

        {/* Прогресс загрузки */}
        <div className="w-64 mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Загрузка...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Версия */}
      <div className="absolute bottom-8 text-center text-gray-500 text-sm">
        <p>Quest Forge v1.0</p>
        <p>Powered by Telegram Mini Apps</p>
      </div>
    </div>
  );
};

export default SplashScreen;
