import React, { useState } from 'react';
import { TelegramUser, Screen, ShopItem } from '../types';

interface ShopProps {
  user: TelegramUser | null;
  balance: number;
  onScreenChange: (screen: Screen) => void;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'hint',
    name: 'Подсказка',
    description: 'Получите подсказку для текущего этапа',
    price: 5,
    type: 'hint',
    icon: '💡',
  },
  {
    id: 'skip',
    name: 'Пропуск этапа',
    description: 'Пропустите текущий этап квеста',
    price: 10,
    type: 'skip',
    icon: '⏭️',
  },
  {
    id: 'super_skip',
    name: 'Супер-пропуск',
    description: 'Завершите весь квест мгновенно',
    price: 50,
    type: 'super_skip',
    icon: '🚀',
  },
  {
    id: 'booster50',
    name: 'Бустер +50%',
    description: 'Увеличьте награду на 50% на 1 час',
    price: 15,
    type: 'booster50',
    icon: '⚡',
  },
  {
    id: 'booster100',
    name: 'Бустер +100%',
    description: 'Увеличьте награду на 100% на 1 час',
    price: 25,
    type: 'booster100',
    icon: '🔥',
  },
];

export const Shop: React.FC<ShopProps> = ({
  user,
  balance,
  onScreenChange,
}) => {
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (item: ShopItem) => {
    if (balance < item.price) {
      alert('Недостаточно QUC для покупки');
      return;
    }

    try {
      setPurchasing(item.id);
      
      const response = await fetch('http://localhost:3001/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          itemType: item.type,
          price: item.price,
        }),
      });

      if (response.ok) {
        alert(`Покупка успешна! Вы приобрели ${item.name}`);
        // Здесь можно обновить баланс
      } else {
        alert('Ошибка покупки. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Ошибка покупки:', error);
      alert('Ошибка покупки. Попробуйте еще раз.');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="shop fade-in">
      <div className="shop-header">
        <h1>Магазин</h1>
        <p>Покупайте полезные предметы</p>
      </div>

      <div className="user-info">
        <div className="user-balance">
          💰 Баланс: {balance} QUC
        </div>
      </div>

      <div className="shop-items">
        {SHOP_ITEMS.map((item) => (
          <div key={item.id} className="shop-item">
            <div className="item-icon">{item.icon}</div>
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-description">{item.description}</div>
              <div className="item-price">{item.price} QUC</div>
            </div>
            <button
              className="action-button"
              onClick={() => handlePurchase(item)}
              disabled={purchasing === item.id || balance < item.price}
            >
              {purchasing === item.id ? 'Покупка...' : 'Купить'}
            </button>
          </div>
        ))}
      </div>

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