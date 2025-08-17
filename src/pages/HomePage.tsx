import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Users, Clock, Zap } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { STATIC_QUESTS } from '../data/staticData';

// Остальной код остается тот же, но убираем неиспользуемый импорт useTranslation

interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  rating: number;
  plays: number;
  reward: number;
  coverImage?: string;
  estimatedTime: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { user, hapticFeedback } = useTelegram();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Используем статические данные для Mini App
    console.log('HomePage: Загружаем статические данные...');
    
    // Имитируем загрузку с сервера
    setTimeout(() => {
      console.log('HomePage: Статические квесты загружены:', STATIC_QUESTS);
      setQuests(STATIC_QUESTS);
      setLoading(false);
    }, 800);
  }, []);

  const handleQuestStart = (questId: number) => {
    hapticFeedback('impact');
    navigate(`/quest/${questId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легкий': return 'text-green-400';
      case 'Средний': return 'text-yellow-400';
      case 'Сложный': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-telegram-secondary rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-telegram-secondary rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-telegram-bg">
      {/* Шапка */}
      <header className="bg-gradient-primary p-4 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              👋 Привет, {user?.first_name}!
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Готов к новым приключениям?
            </p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">1,250 QUC</div>
            <div className="text-blue-100 text-xs">Баланс</div>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="p-4 space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <div className="text-telegram-blue text-xl font-bold">12</div>
            <div className="text-xs text-telegram-hint">Квестов</div>
          </div>
          <div className="card text-center">
            <div className="text-telegram-blue text-xl font-bold">4.8</div>
            <div className="text-xs text-telegram-hint">Рейтинг</div>
          </div>
          <div className="card text-center">
            <div className="text-telegram-blue text-xl font-bold">#127</div>
            <div className="text-xs text-telegram-hint">Место</div>
          </div>
        </div>

        {/* Популярные квесты */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">🔥 Популярные квесты</h2>
            <button className="text-telegram-blue text-sm">Все</button>
          </div>

          <div className="space-y-3">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className="card hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => handleQuestStart(quest.id)}
              >
                <div className="flex items-center space-x-3">
                  {/* Иконка квеста */}
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>

                  {/* Информация о квесте */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{quest.title}</h3>
                    <p className="text-sm text-telegram-hint truncate">{quest.description}</p>
                    
                    {/* Метрики */}
                    <div className="flex items-center space-x-3 mt-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-telegram-hint">{quest.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-telegram-hint" />
                        <span className="text-telegram-hint">{quest.plays}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-telegram-hint" />
                        <span className="text-telegram-hint">{quest.estimatedTime}м</span>
                      </div>
                      <div className={`font-medium ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </div>
                    </div>
                  </div>

                  {/* Награда и кнопка */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-telegram-blue font-bold">+{quest.reward}</div>
                    <div className="text-xs text-telegram-hint mb-2">QUC</div>
                    <button className="bg-telegram-blue hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg transition-colors">
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Дневные задания */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">🎯 Ежедневные задания</h2>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Пройди 3 квеста</h3>
                <p className="text-sm text-telegram-hint">Прогресс: 1/3</p>
              </div>
              <div className="text-right">
                <div className="text-telegram-blue font-bold">+200 QUC</div>
                <div className="w-16 h-2 bg-telegram-secondary rounded-full mt-1">
                  <div className="w-1/3 h-full bg-telegram-blue rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage; 
