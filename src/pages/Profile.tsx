import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { 
  User, 
  Trophy, 
  Coins, 
  Settings,
  Star,
  Target,
  Zap,
  Award,
  Calendar
} from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface UserStats {
  completedQuests: number;
  createdQuests: number;
  totalErrors: number;
  avgRating: number;
  balance: number;
  rank: number;
  totalPlayTime: number;
  achievements: string[];
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, hapticFeedback } = useTelegram();
  const wallet = useTonWallet();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Мок данные для демонстрации
    const mockStats: UserStats = {
      completedQuests: 12,
      createdQuests: 3,
      totalErrors: 8,
      avgRating: 4.7,
      balance: 1250,
      rank: 127,
      totalPlayTime: 145, // минуты
      achievements: ['🎮 Игрок', '🎨 Квестодел', '🏅 Ветеран']
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 800);
  }, []);

  const handleWithdraw = () => {
    hapticFeedback('impact');
    // TODO: Implement withdrawal logic
    alert('Функция вывода будет реализована');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-telegram-secondary rounded-xl"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-telegram-secondary rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-telegram-bg">
      {/* Шапка профиля */}
      <header className="bg-gradient-primary p-4 rounded-b-3xl">
        <div className="flex items-center space-x-4">
          {/* Аватар */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          
          {/* Информация пользователя */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">
              {user?.first_name} {user?.last_name}
            </h1>
            {user?.username && (
              <p className="text-blue-100 text-sm">@{user.username}</p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-blue-100 text-sm">Рейтинг #{stats?.rank}</span>
            </div>
          </div>

          {/* Настройки */}
          <button className="p-2 bg-white bg-opacity-10 rounded-full">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Баланс и кошелек */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Coins className="w-5 h-5 mr-2 text-telegram-blue" />
              {t('profile.balance')}
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-telegram-blue">
                {stats?.balance} QUC
              </div>
            </div>
          </div>

          {/* TON Wallet */}
          <div className="bg-telegram-bg rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-telegram-hint">TON Кошелек</span>
              {wallet && (
                <span className="text-xs text-green-400">Подключен</span>
              )}
            </div>
            <TonConnectButton />
          </div>

          {/* Кнопка вывода */}
          {wallet && (
            <button
              onClick={handleWithdraw}
              className="w-full btn-primary"
            >
              Вывести QUC
            </button>
          )}
        </section>

        {/* Статистика */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-telegram-blue" />
            {t('profile.stats')}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="card text-center">
              <div className="text-telegram-blue text-2xl font-bold mb-1">
                {stats?.completedQuests}
              </div>
              <div className="text-xs text-telegram-hint">
                {t('profile.completed')}
              </div>
            </div>

            <div className="card text-center">
              <div className="text-telegram-blue text-2xl font-bold mb-1">
                {stats?.createdQuests}
              </div>
              <div className="text-xs text-telegram-hint">
                {t('profile.created')}
              </div>
            </div>

            <div className="card text-center">
              <div className="text-telegram-blue text-2xl font-bold mb-1 flex items-center justify-center">
                <Star className="w-5 h-5 mr-1" />
                {stats?.avgRating}
              </div>
              <div className="text-xs text-telegram-hint">
                Средний рейтинг
              </div>
            </div>

            <div className="card text-center">
              <div className="text-telegram-blue text-2xl font-bold mb-1">
                {Math.floor((stats?.totalPlayTime || 0) / 60)}ч {(stats?.totalPlayTime || 0) % 60}м
              </div>
              <div className="text-xs text-telegram-hint">
                Время в игре
              </div>
            </div>
          </div>
        </section>

        {/* Достижения */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-telegram-blue" />
            {t('profile.achievements')}
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {stats?.achievements.map((achievement, index) => (
              <div key={index} className="card text-center">
                <div className="text-2xl mb-1">{achievement.split(' ')[0]}</div>
                <div className="text-xs text-telegram-hint">
                  {achievement.split(' ').slice(1).join(' ')}
                </div>
              </div>
            ))}
            
            {/* Заблокированные достижения */}
            <div className="card text-center opacity-50">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs text-telegram-hint">Скоро...</div>
            </div>
          </div>
        </section>

        {/* Активность */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-telegram-blue" />
            Недавняя активность
          </h2>

          <div className="space-y-3">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">Завершен квест "Тайны космоса"</p>
                  <p className="text-telegram-hint text-xs">2 часа назад</p>
                </div>
                <div className="text-green-400 font-semibold">+50 QUC</div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">Достигнут рейтинг 4.7</p>
                  <p className="text-telegram-hint text-xs">1 день назад</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile; 
