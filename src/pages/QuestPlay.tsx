import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  Lightbulb, 
  SkipForward,
  CheckCircle,
  XCircle,
  Trophy
} from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { STATIC_QUESTS } from '../data/staticData';

interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  reward: number;
  steps: QuestStep[];
}

interface QuestStep {
  id: number;
  question: string;
  answer: string;
  hint?: string;
  image?: string;
  options?: string[];
}

interface QuestProgress {
  currentStep: number;
  answers: string[];
  errors: number;
  startTime: Date;
  hintsUsed: number;
  skipsUsed: number;
}

const QuestPlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hapticFeedback, showConfirm } = useTelegram();
  
  const [quest, setQuest] = useState<Quest | null>(null);
  const [progress, setProgress] = useState<QuestProgress>({
    currentStep: 0,
    answers: [],
    errors: 0,
    startTime: new Date(),
    hintsUsed: 0,
    skipsUsed: 0
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Находим квест по ID из статических данных
    const questId = parseInt(id || '1');
    const selectedQuest = STATIC_QUESTS.find(q => q.id === questId);
    
    if (selectedQuest) {
      setTimeout(() => {
        setQuest(selectedQuest);
        setLoading(false);
      }, 800);
    } else {
      // Fallback на первый квест, если не найден
      setTimeout(() => {
        setQuest(STATIC_QUESTS[0]);
        setLoading(false);
      }, 800);
    }
  }, [id]);

  const currentStep = quest?.steps[progress.currentStep];
  const isLastStep = progress.currentStep === (quest?.steps.length || 0) - 1;

  const handleBack = async () => {
    const confirmed = await showConfirm('Вы уверены, что хотите покинуть квест? Прогресс не сохранится.');
    if (confirmed) {
      navigate('/');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentStep) return;

    setSubmitting(true);
    hapticFeedback('impact');

    // Симуляция проверки ответа
    setTimeout(() => {
      const isCorrect = userAnswer.toLowerCase().trim() === currentStep.answer.toLowerCase();
      
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      
      if (isCorrect) {
        // Правильный ответ
        hapticFeedback('notification');
        
        setTimeout(() => {
          if (isLastStep) {
            // Квест завершен
            navigate('/', { 
              state: { 
                questCompleted: true, 
                reward: quest?.reward,
                stats: {
                  errors: progress.errors,
                  hintsUsed: progress.hintsUsed,
                  skipsUsed: progress.skipsUsed,
                  timeSpent: Date.now() - progress.startTime.getTime()
                }
              }
            });
          } else {
            // Переход к следующему шагу
            setProgress(prev => ({
              ...prev,
              currentStep: prev.currentStep + 1,
              answers: [...prev.answers, userAnswer]
            }));
            setUserAnswer('');
            setShowHint(false);
            setFeedback(null);
          }
        }, 1500);
      } else {
        // Неправильный ответ
        setProgress(prev => ({
          ...prev,
          errors: prev.errors + 1
        }));
        
        setTimeout(() => {
          setFeedback(null);
        }, 2000);
      }
      
      setSubmitting(false);
    }, 1000);
  };

  const handleUseHint = () => {
    hapticFeedback('selection');
    setShowHint(true);
    setProgress(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
  };

  const handleSkipQuestion = () => {
    hapticFeedback('impact');
    setProgress(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      skipsUsed: prev.skipsUsed + 1
    }));
    setUserAnswer('');
    setShowHint(false);
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-telegram-secondary rounded-xl"></div>
          <div className="h-32 bg-telegram-secondary rounded-xl"></div>
          <div className="h-24 bg-telegram-secondary rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-telegram-bg flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Квест не найден</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-telegram-bg">
      {/* Шапка */}
      <header className="bg-gradient-primary p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="p-2 bg-white bg-opacity-20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg font-bold text-white truncate">{quest.title}</h1>
            <div className="flex items-center justify-center space-x-4 mt-1">
              <div className="flex items-center space-x-1 text-blue-100 text-sm">
                <Clock className="w-4 h-4" />
                <span>{Math.floor((Date.now() - progress.startTime.getTime()) / 60000)}м</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-100 text-sm">
                <Trophy className="w-4 h-4" />
                <span>{progress.currentStep + 1}/{quest.steps.length}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white font-bold">+{quest.reward}</div>
            <div className="text-blue-100 text-xs">QUC</div>
          </div>
        </div>

        {/* Прогресс бар */}
        <div className="mt-4">
          <div className="w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((progress.currentStep + 1) / quest.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Вопрос */}
        <div className="card">
          {currentStep?.image && (
            <div className="text-center text-6xl mb-4">
              {currentStep.image}
            </div>
          )}
          
          <h2 className="text-lg font-semibold text-white mb-4 leading-relaxed">
            {currentStep?.question}
          </h2>

          {/* Подсказка */}
          {showHint && currentStep?.hint && (
            <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-100 text-sm">{currentStep.hint}</p>
              </div>
            </div>
          )}

          {/* Отзыв о ответе */}
          {feedback && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${
              feedback === 'correct' 
                ? 'bg-green-500 bg-opacity-10 border border-green-500' 
                : 'bg-red-500 bg-opacity-10 border border-red-500'
            }`}>
              {feedback === 'correct' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-medium ${
                feedback === 'correct' ? 'text-green-400' : 'text-red-400'
              }`}>
                {feedback === 'correct' ? t('quest.correct') : t('quest.incorrect')}
              </span>
            </div>
          )}
        </div>

        {/* Поле ввода ответа */}
        <div className="card">
          <label className="block text-sm font-medium text-telegram-hint mb-2">
            {t('quest.yourAnswer')}
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Введите ваш ответ..."
              disabled={submitting || feedback === 'correct'}
              className="flex-1 bg-telegram-bg border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-telegram-hint focus:border-telegram-blue focus:outline-none disabled:opacity-50"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || submitting || feedback === 'correct'}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Действия */}
        <div className="flex space-x-3">
          {!showHint && currentStep?.hint && (
            <button
              onClick={handleUseHint}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Подсказка</span>
            </button>
          )}
          
          {!isLastStep && (
            <button
              onClick={handleSkipQuestion}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <SkipForward className="w-5 h-5" />
              <span>Пропустить</span>
            </button>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <div className="text-red-400 text-lg font-bold">{progress.errors}</div>
            <div className="text-xs text-telegram-hint">Ошибок</div>
          </div>
          <div className="card text-center">
            <div className="text-yellow-400 text-lg font-bold">{progress.hintsUsed}</div>
            <div className="text-xs text-telegram-hint">Подсказок</div>
          </div>
          <div className="card text-center">
            <div className="text-blue-400 text-lg font-bold">{progress.skipsUsed}</div>
            <div className="text-xs text-telegram-hint">Пропусков</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestPlay; 
