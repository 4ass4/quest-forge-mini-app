import React from 'react';
import { TelegramUser, Screen } from '../types';

interface MainMenuProps {
  user: TelegramUser | null;
  balance: number;
  onScreenChange: (screen: Screen) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  user,
  balance,
  onScreenChange,
}) => {
  const getUserInitials = (user: TelegramUser) => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="main-menu fade-in">
      <div className="menu-header">
        <h1>Quest Forge</h1>
        <p>Погрузись в мир увлекательных квестов</p>
      </div>

      {user && (
        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(user)}
          </div>
          <div className="user-details">
            <div className="user-name">
              {user.first_name} {user.last_name || ''}
            </div>
            <div className="user-balance">
              💰 {balance} QUC
            </div>
          </div>
        </div>
      )}

      <div className="menu-buttons">
        <button
          className="menu-button"
          onClick={() => onScreenChange(Screen.QUEST_LIST)}
        >
          <span>🎮 Играть в квесты</span>
          <span className="icon">→</span>
        </button>

        <button
          className="menu-button"
          onClick={() => onScreenChange(Screen.WALLET)}
        >
          <span>💼 Кошелек</span>
          <span className="icon">→</span>
        </button>

        <button
          className="menu-button"
          onClick={() => onScreenChange(Screen.SHOP)}
        >
          <span>🛒 Магазин</span>
          <span className="icon">→</span>
        </button>
      </div>
    </div>
  );
}; 