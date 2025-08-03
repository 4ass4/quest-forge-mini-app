import { useState, useCallback } from 'react';
import { Quest, QuestEngine, UserProgress } from '../types';

export const useQuestEngine = (): QuestEngine => {
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [currentProgress, setCurrentProgress] = useState<UserProgress | null>(null);

  const getQuests = useCallback(async (): Promise<Quest[]> => {
    try {
      const response = await fetch('http://localhost:3001/api/quests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.quests || [];
      }
    } catch (error) {
      console.error('Ошибка загрузки квестов:', error);
    }
    return [];
  }, []);

  const getQuestById = useCallback(async (id: number): Promise<Quest | null> => {
    try {
      const response = await fetch(`http://localhost:3001/api/quests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.quest || null;
      }
    } catch (error) {
      console.error('Ошибка загрузки квеста:', error);
    }
    return null;
  }, []);

  const startQuest = useCallback(async (questId: number): Promise<UserProgress> => {
    try {
      const response = await fetch('http://localhost:3001/api/quests/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId }),
      });

      if (response.ok) {
        const data = await response.json();
        const progress = data.progress;
        setCurrentProgress(progress);
        return progress;
      }
    } catch (error) {
      console.error('Ошибка начала квеста:', error);
    }
    
    // Fallback
    const fallbackProgress: UserProgress = {
      quest_id: questId,
      current_stage: 1,
      is_completed: false,
      start_time: new Date().toISOString(),
      errors_count: 0,
      hints_used: 0,
    };
    setCurrentProgress(fallbackProgress);
    return fallbackProgress;
  }, []);

  const submitAnswer = useCallback(async (questId: number, answer: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/quests/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId, answer }),
      });

      if (response.ok) {
        const data = await response.json();
        const isCorrect = data.isCorrect;
        
        if (isCorrect && currentProgress) {
          const newProgress = {
            ...currentProgress,
            current_stage: currentProgress.current_stage + 1,
          };
          setCurrentProgress(newProgress);
        }
        
        return isCorrect;
      }
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
    }
    return false;
  }, [currentProgress]);

  const getProgress = useCallback(async (questId: number): Promise<UserProgress | null> => {
    try {
      const response = await fetch(`http://localhost:3001/api/quests/${questId}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.progress || null;
      }
    } catch (error) {
      console.error('Ошибка загрузки прогресса:', error);
    }
    return null;
  }, []);

  const completeQuest = useCallback(async (questId: number): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3001/api/quests/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId }),
      });

      if (response.ok) {
        if (currentProgress) {
          const completedProgress = {
            ...currentProgress,
            is_completed: true,
            end_time: new Date().toISOString(),
          };
          setCurrentProgress(completedProgress);
        }
      }
    } catch (error) {
      console.error('Ошибка завершения квеста:', error);
    }
  }, [currentProgress]);

  return {
    getQuests,
    getQuestById,
    startQuest,
    submitAnswer,
    getProgress,
    completeQuest,
  };
}; 