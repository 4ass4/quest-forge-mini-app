import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, Star, Crown, Medal, Award } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface LeaderboardPlayer {
  id: number;
  name: string;
  username?: string;
  score: number;
  completedQuests: number;
  avatar?: string;
  rank: number;
}

interface LeaderboardQuest {
  id: number;
  title: string;
  rating: number;
  plays: number;
  creator: string;
}

type TabType = 'players' | 'quests' | 'creators';

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, hapticFeedback } = useTelegram();
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [quests, setQuests] = useState<LeaderboardQuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Мок данные
    const mockPlayers: LeaderboardPlayer[] = [
      { id: 1, name: 'Александр', username: 'alex_quest', score: 15420, completedQuests: 89, rank: 1 },
      { id: 2, name: 'Мария', username: 'maria_gamer', score: 14230, completedQuests: 76, rank: 2 },
      { id: 3, name: 'Дмитрий', username: 'dmitry_pro', score: 13150, completedQuests: 71, rank: 3 },
      { id: 4, name: 'Анна', username: 'anna_quest', score: 12890, completedQuests: 68, rank: 4 },
      { id: 5, name: 'Сергей', username: 'sergey_top', score: 12340, completedQuests: 65, rank: 5 },
    ];

    const mockQuests: LeaderboardQuest[] = [
      { id: 1, title: 'Тайны космоса', rating: 4.9, plays: 2847, creator: 'Александр' },
      { id: 2, title: 'Загадки истории', rating: 4.8, plays: 2156, creator: 'Мария' },
      { id: 3, title: 'Мир науки', rating: 4.7, plays: 1923, creator: 'Дмитрий' },
    ];

    setTimeout(() => {
      setPlayers(mockPlayers);
      setQuests(mockQuests);
      setLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (tab: TabType) => {
    hapticFeedback('selection');
    setActiveTab(tab);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-telegram-hint font-bold">#{rank}</span>;
    }
  };

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default: return 'bg-telegram-secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-telegram-secondary rounded-xl"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-telegram-secondary rounded-xl"></div>
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
        <h1 className="text-xl font-bold text-white text-center flex items-center justify-center">
          <Trophy className="w-6 h-6 mr-2" />
          {t('nav.leaderboard')}
        </h1>
      </header>

      <main className="p-4">
        {/* Табы */}
        <div className="flex bg-telegram-secondary rounded-xl p-1 mb-6">
          <button
            onClick={() => handleTabChange('players')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'players'
                ? 'bg-telegram-blue text-white'
                : 'text-telegram-hint hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 mx-auto mb-1" />
            {t('leaderboard.topPlayers')}
          </button>
          <button
            onClick={() => handleTabChange('quests')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'quests'
                ? 'bg-telegram-blue text-white'
                : 'text-telegram-hint hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 mx-auto mb-1" />
            {t('leaderboard.topQuests')}
          </button>
        </div>

        {/* Топ игроков */}
        {activeTab === 'players' && (
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={`card ${getRankColors(player.rank)} ${
                  player.rank <= 3 ? 'text-white' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Ранг */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(player.rank)}
                  </div>

                  {/* Аватар */}
                  <div className="w-10 h-10 bg-telegram-blue bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {player.name.charAt(0)}
                    </span>
                  </div>

                  {/* Информация игрока */}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${player.rank <= 3 ? 'text-white' : 'text-white'}`}>
                      {player.name}
                    </h3>
                    {player.username && (
                      <p className={`text-sm ${player.rank <= 3 ? 'text-gray-200' : 'text-telegram-hint'}`}>
                        @{player.username}
                      </p>
                    )}
                    <p className={`text-xs ${player.rank <= 3 ? 'text-gray-200' : 'text-telegram-hint'}`}>
                      {player.completedQuests} квестов пройдено
                    </p>
                  </div>

                  {/* Очки */}
                  <div className="text-right">
                    <div className={`font-bold ${player.rank <= 3 ? 'text-white' : 'text-telegram-blue'}`}>
                      {player.score.toLocaleString()}
                    </div>
                    <div className={`text-xs ${player.rank <= 3 ? 'text-gray-200' : 'text-telegram-hint'}`}>
                      очков
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Позиция текущего пользователя */}
            <div className="card border-2 border-telegram-blue bg-telegram-blue bg-opacity-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <span className="text-telegram-blue font-bold">#127</span>
                </div>
                <div className="w-10 h-10 bg-telegram-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.first_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {user?.first_name} (Вы)
                  </h3>
                  <p className="text-sm text-telegram-hint">12 квестов пройдено</p>
                </div>
                <div className="text-right">
                  <div className="text-telegram-blue font-bold">1,250</div>
                  <div className="text-xs text-telegram-hint">очков</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Топ квестов */}
        {activeTab === 'quests' && (
          <div className="space-y-3">
            {quests.map((quest, index) => (
              <div key={quest.id} className="card">
                <div className="flex items-center space-x-3">
                  {/* Позиция */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Иконка квеста */}
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>

                  {/* Информация о квесте */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{quest.title}</h3>
                    <p className="text-sm text-telegram-hint">
                      от {quest.creator}
                    </p>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-telegram-hint">{quest.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-telegram-hint" />
                        <span className="text-xs text-telegram-hint">{quest.plays}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard; 
