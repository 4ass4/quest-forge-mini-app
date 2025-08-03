import React, { useState } from 'react';
import { TelegramUser, Screen, TONConnect } from '../types';

interface WalletProps {
  user: TelegramUser | null;
  balance: number;
  onScreenChange: (screen: Screen) => void;
  tonConnect: TONConnect;
}

export const Wallet: React.FC<WalletProps> = ({
  user,
  balance,
  onScreenChange,
  tonConnect,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await tonConnect.connect();
      const connectedWallet = tonConnect.getWallet();
      setWallet(connectedWallet);
    } catch (error) {
      console.error('Ошибка подключения кошелька:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await tonConnect.disconnect();
      setWallet(null);
    } catch (error) {
      console.error('Ошибка отключения кошелька:', error);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet fade-in">
      <div className="wallet-header">
        <h1>Кошелек</h1>
        <p>Управление вашими активами</p>
      </div>

      <div className="wallet-balance">
        <div className="balance-amount">{balance}</div>
        <div className="balance-label">QUC токенов</div>
      </div>

      {wallet ? (
        <div className="wallet-info">
          <h3>Подключенный кошелек</h3>
          <div className="wallet-address">
            <strong>Адрес:</strong> {formatAddress(wallet.account.address)}
          </div>
          <div className="wallet-chain">
            <strong>Сеть:</strong> {wallet.account.chain}
          </div>
          
          <div className="wallet-actions">
            <button
              className="action-button secondary"
              onClick={handleDisconnect}
            >
              Отключить кошелек
            </button>
          </div>
        </div>
      ) : (
        <div className="wallet-connect">
          <h3>Подключение кошелька</h3>
          <p>Подключите TON кошелек для управления токенами</p>
          
          <div className="wallet-actions">
            <button
              className="action-button"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? 'Подключение...' : 'Подключить кошелек'}
            </button>
          </div>
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