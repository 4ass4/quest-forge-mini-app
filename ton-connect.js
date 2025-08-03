// TON Connect интеграция
class TONConnect {
    constructor() {
        this.connector = null;
        this.wallet = null;
        this.isConnected = false;
        this.init();
    }

    async init() {
        try {
            // Инициализация TON Connect
            this.connector = new TonConnect({
                manifestUrl: 'https://quest-forge.com/tonconnect-manifest.json'
            });

            // Подписка на изменения состояния кошелька
            this.connector.onStatusChange(wallet => {
                this.wallet = wallet;
                this.isConnected = !!wallet;
                this.updateUI();
                console.log('Wallet status changed:', wallet);
            });

            // Проверка существующего подключения
            const wallet = this.connector.wallet;
            if (wallet) {
                this.wallet = wallet;
                this.isConnected = true;
                this.updateUI();
            }

        } catch (error) {
            console.error('TON Connect initialization error:', error);
        }
    }

    // Подключение кошелька
    async connectWallet() {
        try {
            if (!this.connector) {
                throw new Error('TON Connect not initialized');
            }

            await this.connector.connect();
            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return false;
        }
    }

    // Отключение кошелька
    async disconnectWallet() {
        try {
            if (this.connector) {
                await this.connector.disconnect();
            }
            return true;
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            return false;
        }
    }

    // Получение адреса кошелька
    getWalletAddress() {
        return this.wallet?.account?.address || null;
    }

    // Получение баланса TON
    async getTONBalance() {
        try {
            if (!this.wallet) return 0;

            const balance = await this.connector.getBalance();
            return balance || 0;
        } catch (error) {
            console.error('Error getting TON balance:', error);
            return 0;
        }
    }

    // Получение баланса QUC токенов
    async getQUCBalance() {
        try {
            if (!this.wallet) return 0;

            // Здесь будет вызов смарт-контракта QUC токенов
            // Пока возвращаем заглушку
            return 0;
        } catch (error) {
            console.error('Error getting QUC balance:', error);
            return 0;
        }
    }

    // Отправка транзакции
    async sendTransaction(transaction) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not connected');
            }

            const result = await this.connector.sendTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Error sending transaction:', error);
            throw error;
        }
    }

    // Минт NFT достижения
    async mintAchievementNFT(achievementData) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not connected');
            }

            // Создание транзакции для минта NFT
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 секунд
                messages: [
                    {
                        address: 'EQD...', // Адрес NFT контракта
                        amount: '10000000', // 0.01 TON
                        payload: JSON.stringify({
                            type: 'mint_nft',
                            achievement: achievementData
                        })
                    }
                ]
            };

            const result = await this.sendTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Error minting NFT:', error);
            throw error;
        }
    }

    // Вывод QUC токенов
    async withdrawQUC(amount) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not connected');
            }

            // Создание транзакции для вывода QUC
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60,
                messages: [
                    {
                        address: 'EQD...', // Адрес QUC контракта
                        amount: '10000000',
                        payload: JSON.stringify({
                            type: 'withdraw_quc',
                            amount: amount
                        })
                    }
                ]
            };

            const result = await this.sendTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Error withdrawing QUC:', error);
            throw error;
        }
    }

    // Обновление UI
    updateUI() {
        const walletConnected = document.getElementById('wallet-connected');
        const walletDisconnected = document.getElementById('wallet-disconnected');
        const tonWalletInfo = document.getElementById('ton-wallet-info');

        if (this.isConnected && this.wallet) {
            // Показываем статус подключения
            if (walletConnected) walletConnected.classList.remove('hidden');
            if (walletDisconnected) walletDisconnected.classList.add('hidden');

            // Обновляем информацию о кошельке
            if (tonWalletInfo) {
                const address = this.getWalletAddress();
                tonWalletInfo.innerHTML = `
                    <h4>TON Кошелёк</h4>
                    <p><strong>Адрес:</strong> ${address ? address.slice(0, 10) + '...' + address.slice(-10) : 'Неизвестно'}</p>
                    <p><strong>Баланс TON:</strong> <span id="ton-balance">Загрузка...</span></p>
                    <button onclick="tonConnect.disconnectWallet()" class="action-btn">Отключить</button>
                `;

                // Загружаем баланс
                this.loadBalance();
            }
        } else {
            // Показываем кнопку подключения
            if (walletConnected) walletConnected.classList.add('hidden');
            if (walletDisconnected) walletDisconnected.classList.remove('hidden');

            if (tonWalletInfo) {
                tonWalletInfo.innerHTML = `
                    <h4>TON Кошелёк</h4>
                    <p>Кошелёк не подключен</p>
                    <button onclick="tonConnect.connectWallet()" class="connect-btn">Подключить</button>
                `;
            }
        }
    }

    // Загрузка баланса
    async loadBalance() {
        try {
            const tonBalance = await this.getTONBalance();
            const qucBalance = await this.getQUCBalance();

            const tonBalanceElement = document.getElementById('ton-balance');
            const qucBalanceElement = document.getElementById('quc-balance');

            if (tonBalanceElement) {
                tonBalanceElement.textContent = `${(tonBalance / 1000000000).toFixed(2)} TON`;
            }

            if (qucBalanceElement) {
                qucBalanceElement.textContent = qucBalance;
            }
        } catch (error) {
            console.error('Error loading balance:', error);
        }
    }

    // Проверка поддержки функций
    isFeatureSupported(feature) {
        return this.connector && this.connector.isFeatureSupported(feature);
    }

    // Получение информации о кошельке
    getWalletInfo() {
        return {
            isConnected: this.isConnected,
            address: this.getWalletAddress(),
            wallet: this.wallet
        };
    }
}

// Глобальный экземпляр TON Connect
window.tonConnect = new TONConnect();

// Функция подключения кошелька (для HTML)
window.connectWallet = async function() {
    const success = await window.tonConnect.connectWallet();
    if (success) {
        window.telegramAPI.showAlert('Кошелёк успешно подключен!');
    } else {
        window.telegramAPI.showAlert('Ошибка подключения кошелька');
    }
}; 