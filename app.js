import TelegramAPI from './telegram-api.js';
import TONConnect from './ton-connect.js';
import QuestEngine from './quest-engine.js';

class QuestForgeApp {
    constructor() {
        this.telegramAPI = new TelegramAPI();
        this.tonConnect = new TONConnect();
        this.questEngine = new QuestEngine();
        
        this.currentSection = 'loading';
        this.userBalance = 0;
        this.currentQuest = null;
        
        this.init();
    }

    init() {
        try {
            // Проверяем, запущено ли приложение в Telegram
            if (!this.telegramAPI.isTelegramApp()) {
                this.showError('Это приложение должно быть запущено в Telegram');
                return;
            }

            // Инициализируем приложение
            this.setupEventListeners();
            this.loadUserData();
            this.showMainMenu();
            
            console.log('Quest Forge Mini App инициализирован');
        } catch (error) {
            this.handleError('Ошибка инициализации приложения', error);
        }
    }

    setupEventListeners() {
        // Обработчики для навигации
        document.getElementById('main-menu-btn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('quests-btn').addEventListener('click', () => this.showQuestsList());
        document.getElementById('wallet-btn').addEventListener('click', () => this.showWallet());
        document.getElementById('shop-btn').addEventListener('click', () => this.showShop());
        
        // Обработчики для квестов
        document.getElementById('back-to-quests').addEventListener('click', () => this.showQuestsList());
        document.getElementById('play-quest-btn').addEventListener('click', () => this.startQuest());
        
        // Обработчики для кошелька
        document.getElementById('connect-wallet-btn').addEventListener('click', () => this.connectWallet());
        document.getElementById('withdraw-btn').addEventListener('click', () => this.withdrawFunds());
        
        // Обработчики для магазина
        document.getElementById('buy-hint-btn').addEventListener('click', () => this.purchaseItem('hint', 5));
        document.getElementById('buy-booster-btn').addEventListener('click', () => this.purchaseItem('booster', 10));
        document.getElementById('buy-nft-btn').addEventListener('click', () => this.purchaseItem('nft', 50));
    }

    async loadUserData() {
        try {
            this.userBalance = await this.getQUCBalance();
            this.updateBalanceDisplay();
        } catch (error) {
            this.handleError('Ошибка загрузки данных пользователя', error);
        }
    }

    async getQUCBalance() {
        try {
            // Сначала проверим, работает ли API сервер
            const testResponse = await fetch('http://localhost:3001/api/test');
            if (!testResponse.ok) {
                console.error('API сервер недоступен');
                return 0;
            }

            const userData = this.telegramAPI.getUserData();
            if (!userData) {
                console.log('Данные пользователя не найдены, используем тестовые данные');
                // Используем тестовые данные для разработки
                const testData = {
                    id: 123456,
                    chatId: 123456
                };

                const response = await fetch('http://localhost:3001/api/user-balance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: testData.id,
                        chatId: testData.chatId
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.balance || 0;
                }
            } else {
                const response = await fetch('http://localhost:3001/api/user-balance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userData.id,
                        chatId: userData.chatId
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.balance || 0;
                }
            }
            return 0;
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
            return 0;
        }
    }

    updateBalanceDisplay() {
        const balanceElements = document.querySelectorAll('.balance-amount');
        balanceElements.forEach(element => {
            element.textContent = this.userBalance;
        });
    }

    showSection(sectionId) {
        // Скрываем все секции
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Показываем нужную секцию
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            this.currentSection = sectionId;
            
            // Тактильная обратная связь
            this.telegramAPI.hapticImpact('light');
        }
    }

    showMainMenu() {
        this.showSection('main-menu');
        this.telegramAPI.getMainButton().hide();
        this.telegramAPI.getBackButton().hide();
    }

    async showQuestsList() {
        this.showSection('quests-list');
        
        try {
            // Загружаем список квестов
            const quests = await this.loadQuests();
            this.displayQuests(quests);
        } catch (error) {
            this.handleError('Ошибка загрузки квестов', error);
        }
    }

    async loadQuests() {
        try {
            const response = await fetch('http://localhost:3001/api/quests');
            if (response.ok) {
                const data = await response.json();
                return data.quests || [];
            }
            return [];
        } catch (error) {
            console.error('Ошибка загрузки квестов:', error);
            return [];
        }
    }

    displayQuests(quests) {
        const container = document.getElementById('quests-container');
        container.innerHTML = '';

        if (quests.length === 0) {
            container.innerHTML = '<p class="no-quests">Квесты не найдены</p>';
            return;
        }

        quests.forEach(quest => {
            const questElement = document.createElement('div');
            questElement.className = 'quest-item';
            questElement.innerHTML = `
                <h3>${quest.title}</h3>
                <p>${quest.description}</p>
                <div class="quest-meta">
                    <span class="difficulty">${quest.difficulty}</span>
                    <span class="reward">Награда: ${quest.reward} QUC</span>
                </div>
                <button onclick="app.selectQuest(${quest.id})" class="quest-btn">Выбрать</button>
            `;
            container.appendChild(questElement);
        });
    }

    async selectQuest(questId) {
        try {
            const userData = this.telegramAPI.getUserData();
            const response = await fetch('http://localhost:3001/api/quest-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questId: questId,
                    userId: userData?.id || 123456
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.currentQuest = data.quest;
                this.showQuestDetails(data.quest, data.progress);
            }
        } catch (error) {
            this.handleError('Ошибка загрузки деталей квеста', error);
        }
    }

    showQuestDetails(quest, progress) {
        this.showSection('quest-details');
        
        document.getElementById('quest-title').textContent = quest.title;
        document.getElementById('quest-description').textContent = quest.description;
        document.getElementById('quest-difficulty').textContent = quest.difficulty;
        document.getElementById('quest-reward').textContent = `${quest.reward} QUC`;
        
        // Показываем прогресс
        const progressElement = document.getElementById('quest-progress');
        if (progress && progress.current_stage) {
            progressElement.textContent = `Этап ${progress.current_stage} из ${JSON.parse(quest.stages).length}`;
        } else {
            progressElement.textContent = 'Начать квест';
        }
    }

    startQuest() {
        if (!this.currentQuest) {
            this.telegramAPI.showAlert('Квест не выбран');
            return;
        }

        this.showSection('quest-playing');
        this.questEngine.startQuest(this.currentQuest);
    }

    showWallet() {
        this.showSection('wallet');
        this.updateBalanceDisplay();
    }

    async connectWallet() {
        try {
            const connected = await this.tonConnect.connect();
            if (connected) {
                this.telegramAPI.showAlert('Кошелек подключен!');
                this.telegramAPI.hapticNotification('success');
            }
        } catch (error) {
            this.handleError('Ошибка подключения кошелька', error);
        }
    }

    async withdrawFunds() {
        if (this.userBalance < 100) {
            this.telegramAPI.showAlert('Минимальная сумма для вывода: 100 QUC');
            return;
        }

        this.telegramAPI.showConfirm(
            `Вывести ${this.userBalance} QUC?`,
            (confirmed) => {
                if (confirmed) {
                    this.processWithdrawal();
                }
            }
        );
    }

    async processWithdrawal() {
        try {
            const userData = this.telegramAPI.getUserData();
            const response = await fetch('http://localhost:3001/api/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData?.id || 123456,
                    amount: this.userBalance,
                    walletAddress: 'TON_WALLET_ADDRESS' // В реальном приложении получаем от пользователя
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.telegramAPI.showAlert(`Запрос на вывод создан! ID: ${data.withdrawalId}`);
                this.userBalance = 0;
                this.updateBalanceDisplay();
            }
        } catch (error) {
            this.handleError('Ошибка вывода средств', error);
        }
    }

    showShop() {
        this.showSection('shop');
        this.updateBalanceDisplay();
    }

    async purchaseItem(itemType, price) {
        if (this.userBalance < price) {
            this.telegramAPI.showAlert('Недостаточно QUC для покупки');
            return;
        }

        this.telegramAPI.showConfirm(
            `Купить ${this.getItemName(itemType)} за ${price} QUC?`,
            async (confirmed) => {
                if (confirmed) {
                    await this.processPurchase(itemType, price);
                }
            }
        );
    }

    getItemName(itemType) {
        const names = {
            hint: 'Подсказку',
            booster: 'Бустер',
            nft: 'NFT'
        };
        return names[itemType] || 'Товар';
    }

    async processPurchase(itemType, price) {
        try {
            const userData = this.telegramAPI.getUserData();
            const response = await fetch('http://localhost:3001/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData?.id || 123456,
                    itemType: itemType,
                    price: price
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.userBalance = data.newBalance;
                this.updateBalanceDisplay();
                this.telegramAPI.showAlert('Покупка совершена!');
                this.telegramAPI.hapticNotification('success');
            }
        } catch (error) {
            this.handleError('Ошибка покупки', error);
        }
    }

    handleError(message, error) {
        console.error(message, error);
        this.telegramAPI.showAlert(`${message}: ${error.message}`);
        this.telegramAPI.hapticNotification('error');
    }

    showError(message) {
        this.telegramAPI.showAlert(message);
        console.error(message);
    }
}

// Создаем глобальный экземпляр приложения
const app = new QuestForgeApp();

// Экспортируем для использования в HTML
window.app = app; 