import React, { useState, useEffect } from 'react';
import { Screen, QuestEngine, Quest, UserProgress } from '../types';

interface QuestPlayingProps {
  onScreenChange: (screen: Screen) => void;
  questEngine: QuestEngine;
}

export const QuestPlaying: React.FC<QuestPlayingProps> = ({
  onScreenChange,
  questEngine,
}) => {
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [currentProgress, setCurrentProgress] = useState<UserProgress | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Здесь можно загрузить текущий квест
    // Пока используем заглушку
    setLoading(false);
  }, []);

  const handleAnswerSubmit = async () => {
    if (!currentQuest || !currentProgress) return;

    try {
      const isCorrect = await questEngine.submitAnswer(currentQuest.id, currentAnswer);
      
      if (isCorrect) {
        // Правильный ответ
        if (currentProgress.current_stage < currentQuest.stages_count) {
          // Переходим к следующему этапу
          const newProgress = {
            ...currentProgress,
            current_stage: currentProgress.current_stage + 1,
          };
          setCurrentProgress(newProgress);
          setCurrentAnswer('');
        } else {
          // Квест завершен
          await questEngine.completeQuest(currentQuest.id);
          // Показать экран завершения
        }
      } else {
        // Неправильный ответ
        setError('Неверный ответ. Попробуйте еще раз.');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Ошибка отправки ответа');
      console.error('Ошибка отправки ответа:', err);
    }
  };

  const getProgressPercentage = () => {
    if (!currentQuest || !currentProgress) return 0;
    return (currentProgress.current_stage / currentQuest.stages_count) * 100;
  };

  if (loading) {
    return (
      <div className="quest-playing">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">Загрузка квеста...</div>
        </div>
      </div>
    );
  }

  if (!currentQuest || !currentProgress) {
    return (
      <div className="quest-playing">
        <div className="error-screen">
          <h2>Квест не найден</h2>
          <p>Выберите квест для прохождения</p>
          <button
            className="menu-button"
            onClick={() => onScreenChange(Screen.QUEST_LIST)}
          >
            Выбрать квест
          </button>
        </div>
      </div>
    );
  }

  const currentStage = currentQuest.stages[currentProgress.current_stage - 1];

  return (
    <div className="quest-playing fade-in">
      <div className="quest-header">
        <h1>{currentQuest.title}</h1>
        <p>Этап {currentProgress.current_stage} из {currentQuest.stages_count}</p>
      </div>

      <div className="quest-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="text-center">
          Прогресс: {currentProgress.current_stage} / {currentQuest.stages_count}
        </div>
      </div>

      <div className="quest-stage">
        <div className="stage-description">
          {currentStage.description}
        </div>
        
        <div className="stage-puzzle">
          {currentStage.puzzle}
        </div>

        <input
          type="text"
          className="answer-input"
          placeholder="Введите ваш ответ..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAnswerSubmit();
            }
          }}
        />

        {error && (
          <div style={{ color: '#ff4444', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <div className="quest-actions">
          <button
            className="action-button"
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim()}
          >
            Отправить ответ
          </button>
          
          <button
            className="action-button secondary"
            onClick={() => onScreenChange(Screen.QUEST_LIST)}
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}; 