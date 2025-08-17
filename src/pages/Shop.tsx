import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Coins, Zap, Target, Gift, Plus, Check } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'hints' | 'skips' | 'boosters' | 'special';
  owned?: number;
  maxOwned?: number;
}

const Shop: React.FC = () => {
  const { t } = useTranslation();
  const { hapticFeedback } = useTelegram();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [userBalance, setUserBalance] = useState(1250);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  useEffect(() => {
    // Мок данные для магазина
    const mockItems: ShopItem[] = [
      {
        id: 'hint_1',
        name: 'Подсказка',
        description: 'Получите подсказку для текущего вопроса',
        price: 50,
        icon: '💡',
        category: 'hints',
        owned: 3
      },
      {
        id: 'hint_5',
        name: '5 подсказок',
        description: 'Набор из 5 подсказок со скидкой',
        price: 200,
        icon: '💡',
        category: 'hints'
      },
      {
        id: 'skip_1',
        name: 'Пропуск',
        description: 'Пропустить сложный вопрос',
        price: 75,
        icon: '⏭️',
        category: 'skips',
        owned: 1
      },
      {
        id: 'skip_3',
        name: '3 пропуска',
        description: 'Набор из 3 пропусков со скидкой',
        price: 180,
        icon: '⏭️',
        category: 'skips'
      },
      {
        id: 'boost_2x',
        name: 'Удвоитель награды',
        description: 'Удваивает награду за квест на 1 час',
        price: 300,
        icon: '⚡',
        category: 'boosters',
        owned: 0,
        maxOwned: 5
      },
      {
        id: 'boost_time',
        name: 'Ускоритель времени',
        description: 'Убирает задержки между вопросами',
        price: 150,
        icon: '🚀',
        category: 'boosters',
        owned: 2
      },
      {
        id: 'premium_quest',
        name: 'Премиум квест',
        description: 'Доступ к эксклюзивному квесту',
        price: 500,
        icon: '👑',
        category: 'special'
      },
      {
        id: 'lucky_box',
        name: 'Сундук удачи',
        description: 'Случайные предметы и QUC',
        price: 250,
        icon: '🎁',
        category: 'special'
      }
    ];

    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 800);
  }, []);

  const handlePurchase = async (item: ShopItem) => {
    if (userBalance < item.price) {
      hapticFeedback('notification');
      alert(t('shop.insufficient_funds'));
      return;
    }

    setPurchaseLoading(item.id);
    hapticFeedback('impact');

    // Симуляция покупки
    setTimeout(() => {
      setUserBalance(prev => prev - item.price);
      setItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, owned: (i.owned || 0) + 1 }
          : i
      ));
      setPurchaseLoading(null);
      hapticFeedback('notification');
      alert(t('shop.purchase_success'));
    }, 1500);
  };

  const getCategoryName = (category: ShopItem['category']) => {
    switch (category) {
      case 'hints': return t('shop.hints');
      case 'skips': return t('shop.skips');
      case 'boosters': return t('shop.boosters');
      case 'special': return 'Особые предметы';
      default: return category;
    }
  };

  const getCategoryIcon = (category: ShopItem['category']) => {
    switch (category) {
      case 'hints': return <Target className="w-5 h-5" />;
      case 'skips': return <Zap className="w-5 h-5" />;
      case 'boosters': return <Gift className="w-5 h-5" />;
      case 'special': return <ShoppingBag className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShopItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-telegram-bg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-telegram-secondary rounded-xl"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <h1 className="text-xl font-bold text-white flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2" />
            {t('nav.shop')}
          </h1>
          <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
            <div className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-white font-bold">{userBalance}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Баланс и статистика */}
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-telegram-blue mb-1">
              {userBalance} QUC
            </div>
            <p className="text-telegram-hint text-sm">Ваш баланс</p>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">💡 3</div>
                <div className="text-xs text-telegram-hint">Подсказки</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">⏭️ 1</div>
                <div className="text-xs text-telegram-hint">Пропуски</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">⚡ 2</div>
                <div className="text-xs text-telegram-hint">Бустеры</div>
              </div>
            </div>
          </div>
        </div>

        {/* Категории товаров */}
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <section key={category}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              {getCategoryIcon(category as ShopItem['category'])}
              <span className="ml-2">{getCategoryName(category as ShopItem['category'])}</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {categoryItems.map((item) => (
                <div key={item.id} className="card">
                  {/* Иконка и название */}
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-telegram-hint mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Количество в наличии */}
                  {item.owned !== undefined && (
                    <div className="text-center mb-2">
                      <span className="text-xs bg-telegram-blue bg-opacity-20 text-telegram-blue px-2 py-1 rounded-full">
                        {t('shop.owned')}: {item.owned}
                        {item.maxOwned && `/${item.maxOwned}`}
                      </span>
                    </div>
                  )}

                  {/* Цена и кнопка покупки */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-1 text-telegram-blue font-bold">
                      <Coins className="w-4 h-4" />
                      <span>{item.price}</span>
                    </div>

                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={
                        purchaseLoading === item.id || 
                        userBalance < item.price ||
                        Boolean(item.maxOwned && (item.owned !== undefined ? item.owned : 0) >= item.maxOwned)
                      }
                      className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        purchaseLoading === item.id
                          ? 'bg-telegram-blue bg-opacity-50 text-white cursor-not-allowed'
                          : userBalance < item.price
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : item.maxOwned && (item.owned !== undefined ? item.owned : 0) >= item.maxOwned
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : 'bg-telegram-blue hover:bg-blue-600 text-white active:scale-95'
                      }`}
                    >
                      {purchaseLoading === item.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Покупка...</span>
                        </div>
                      ) : userBalance < item.price ? (
                        'Недостаточно QUC'
                      ) : item.maxOwned && (item.owned !== undefined ? item.owned : 0) >= item.maxOwned ? (
                        <div className="flex items-center justify-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>Максимум</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <Plus className="w-4 h-4" />
                          <span>{t('shop.buy')}</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Информация о способах получения QUC */}
        <section className="card bg-telegram-blue bg-opacity-10 border border-telegram-blue">
          <div className="text-center">
            <h3 className="font-semibold text-telegram-blue mb-2">
              💰 Как получить больше QUC?
            </h3>
            <div className="space-y-2 text-sm text-telegram-hint">
              <p>• Проходите квесты (+10-100 QUC)</p>
              <p>• Создавайте популярные квесты</p>
              <p>• Выполняйте ежедневные задания</p>
              <p>• Приглашайте друзей</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Shop; 
