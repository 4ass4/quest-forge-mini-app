import React, { useEffect, useState } from 'react';
import { Quest, Screen, QuestEngine } from '../types';

interface QuestListProps {
  onScreenChange: (screen: Screen) => void;
  questEngine: QuestEngine;
}

export const QuestList: React.FC<QuestListProps> = ({
  onScreenChange,
  questEngine,
}) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuests = async () => {
      try {
        setLoading(true);
        const questsData = await questEngine.getQuests();
        setQuests(questsData);
      } catch (err) {
        setError('Ошибка загрузки квестов');
        console.error('Ошибка загрузки квестов:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, [questEngine]);

  const handleQuestClick = (quest: Quest) => {
    // Здесь можно добавить логику для начала квеста
    console.log('Выбран квест:', quest.title);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легкий':
        return '#4CAF50';
      case 'Средний':
        return '#FF9800';
      case 'Сложный':
        return '#F44336';
      case 'Хардкор':
        return '#9C27B0';
      default:
        return '#999999';
    }
  };

  if (loading) {
    return (
      <div className="quest-list">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">Загрузка квестов...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quest-list">
        <div className="error-screen">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quest-list fade-in">
      <div className="menu-header">
        <h1>Доступные квесты</h1>
        <p>Выберите квест для прохождения</p>
      </div>

      {quests.length === 0 ? (
        <div className="text-center">
          <p>Квесты не найдены</p>
          <button
            className="menu-button"
            onClick={() => onScreenChange(Screen.MAIN_MENU)}
          >
            Вернуться в меню
          </button>
        </div>
      ) : (
        <div>
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="quest-item"
              onClick={() => handleQuestClick(quest)}
            >
              <div className="quest-title">{quest.title}</div>
              <div className="quest-meta">
                <span>👤 {quest.creator_username || 'Аноним'}</span>
                <span>🎭 {quest.genre}</span>
                <span
                  style={{ color: getDifficultyColor(quest.difficulty) }}
                >
                  ⚡ {quest.difficulty}
                </span>
              </div>
              <div className="quest-rating">
                {'⭐'.repeat(Math.floor(quest.avg_rating))}
                <span> {quest.avg_rating.toFixed(1)}</span>
              </div>
              <div className="quest-stats">
                <span>🎯 {quest.stages_count} этапов</span>
                <span>🎮 {quest.total_plays} прохождений</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="menu-button"
        onClick={() => onScreenChange(Screen.MAIN_MENU)}
        style={{ marginTop: '20px' }}
      >
        <span>🏠 Главное меню</span>
        <span className="icon">←</span>
      </button>
    </div>
  );
}; 