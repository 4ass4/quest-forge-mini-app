import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-telegram-bg flex items-center justify-center">
      <div className="text-center">
        {/* Логотип/Иконка */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
          <div className="text-2xl font-bold text-white">QF</div>
        </div>
        
        {/* Анимация загрузки */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-blue"></div>
        </div>
        
        {/* Текст загрузки */}
        <p className="text-telegram-hint text-sm">{t('common.loading')}</p>
        
        {/* Прогресс бар */}
        <div className="w-48 h-1 bg-telegram-secondary rounded-full mx-auto mt-4 overflow-hidden">
          <div className="h-full bg-telegram-blue rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 
