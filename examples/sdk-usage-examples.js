// Примеры использования Telegram Web Apps SDK в Quest Forge

// ============================================================================
// 1. ИНИЦИАЛИЗАЦИЯ И НАСТРОЙКА
// ============================================================================

class QuestForgeSDKExamples {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.init();
    }

    init() {
        if (!this.tg) {
            console.error('Telegram Web App SDK не найден');
            return;
        }

        // Уведомляем Telegram что приложение готово
        this.tg.ready();
        
        // Настройка темы
        this.setupTheme();
        
        // Настройка кнопок
        this.setupButtons();
        
        // Слушатели событий
        this.setupEventListeners();
        
        console.log('Quest Forge SDK инициализирован');
    }

    setupTheme() {
        const theme = this.tg.colorScheme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Настройка цветов заголовка и фона
        this.tg.setHeaderColor('#2481cc');
        this.tg.setBackgroundColor(theme === 'dark' ? '#1a1a1a' : '#ffffff');
        
        // Слушаем изменения темы
        this.tg.onEvent('themeChanged', () => {
            const newTheme = this.tg.colorScheme;
            document.documentElement.setAttribute('data-theme', newTheme);
            this.tg.setBackgroundColor(newTheme === 'dark' ? '#1a1a1a' : '#ffffff');
            console.log('Тема изменилась на:', newTheme);
        });
    }

    setupButtons() {
        // Настройка основной кнопки
        this.tg.MainButton.setText('Продолжить');
        this.tg.MainButton.color = '#2481cc';
        this.tg.MainButton.textColor = '#ffffff';
        
        // Настройка кнопки "Назад"
        this.tg.BackButton.color = '#2481cc';
    }

    setupEventListeners() {
        // Слушатель основной кнопки
        this.tg.MainButton.onClick(() => {
            this.handleMainButtonClick();
        });
        
        // Слушатель кнопки "Назад"
        this.tg.BackButton.onClick(() => {
            this.handleBackButtonClick();
        });
    }

    // ============================================================================
    // 2. РАБОТА С ДАННЫМИ ПОЛЬЗОВАТЕЛЯ
    // ============================================================================

    getUserInfo() {
        const user = this.tg.initDataUnsafe?.user;
        const chat = this.tg.initDataUnsafe?.chat;
        
        return {
            user: {
                id: user?.id,
                firstName: user?.first_name,
                lastName: user?.last_name,
                username: user?.username,
                languageCode: user?.language_code
            },
            chat: {
                id: chat?.id,
                type: chat?.type,
                title: chat?.title
            },
            platform: this.tg.platform,
            version: this.tg.version,
            startParam: this.tg.initDataUnsafe?.start_param
        };
    }

    // ============================================================================
    // 3. УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ
    // ============================================================================

    // Показ квестов
    showQuestList() {
        // Скрываем основную кнопку
        this.tg.MainButton.hide();
        
        // Показываем кнопку "Назад"
        this.tg.BackButton.show();
        
        // Haptic feedback
        this.tg.HapticFeedback.impactOccurred('light');
        
        console.log('Показан список квестов');
    }

    // Начало квеста
    startQuest(questId) {
        // Настройка основной кнопки для ответа
        this.tg.MainButton.setText('Ответить');
        this.tg.MainButton.show();
        
        // Показываем кнопку "Назад"
        this.tg.BackButton.show();
        
        // Haptic feedback
        this.tg.HapticFeedback.impactOccurred('medium');
        
        console.log('Начат квест:', questId);
    }

    // Завершение квеста
    completeQuest(questData) {
        // Скрываем кнопки
        this.tg.MainButton.hide();
        this.tg.BackButton.hide();
        
        // Haptic notification
        this.tg.HapticFeedback.notificationOccurred('success');
        
        // Показываем уведомление
        this.tg.showAlert(`🎉 Квест "${questData.name}" завершен!\nНаграда: ${questData.reward} QUC`);
        
        // Отправляем данные в бот
        this.sendQuestData('quest_completed', questData);
        
        console.log('Квест завершен:', questData);
    }

    // ============================================================================
    // 4. ВЗАИМОДЕЙСТВИЕ С БОТОМ
    // ============================================================================

    sendQuestData(action, data) {
        const message = {
            action: action,
            userId: this.tg.initDataUnsafe?.user?.id,
            chatId: this.tg.initDataUnsafe?.chat?.id,
            timestamp: Date.now(),
            data: data
        };
        
        this.tg.sendData(JSON.stringify(message));
        console.log('Данные отправлены в бот:', message);
    }

    // Отправка ответа на квест
    submitQuestAnswer(questId, answer) {
        this.sendQuestData('quest_answer', {
            questId: questId,
            answer: answer,
            timestamp: Date.now()
        });
        
        // Haptic feedback
        this.tg.HapticFeedback.impactOccurred('medium');
    }

    // Запрос баланса
    requestBalance() {
        this.sendQuestData('get_balance', {});
    }

    // Запрос на вывод QUC
    requestWithdraw(amount) {
        this.tg.showConfirm(
            `Вывести ${amount} QUC?`,
            (confirmed) => {
                if (confirmed) {
                    this.sendQuestData('withdraw_quc', { amount: amount });
                    this.tg.HapticFeedback.notificationOccurred('success');
                }
            }
        );
    }

    // ============================================================================
    // 5. УПРАВЛЕНИЕ КОШЕЛЬКОМ
    // ============================================================================

    showWalletConnect() {
        // Показываем основную кнопку для подключения
        this.tg.MainButton.setText('Подключить кошелек');
        this.tg.MainButton.show();
        
        // Показываем кнопку "Назад"
        this.tg.BackButton.show();
        
        console.log('Показан экран подключения кошелька');
    }

    walletConnected(walletAddress) {
        // Скрываем основную кнопку
        this.tg.MainButton.hide();
        
        // Haptic notification
        this.tg.HapticFeedback.notificationOccurred('success');
        
        // Показываем уведомление
        this.tg.showAlert('✅ Кошелек подключен!');
        
        // Отправляем данные в бот
        this.sendQuestData('wallet_connected', { address: walletAddress });
        
        console.log('Кошелек подключен:', walletAddress);
    }

    // ============================================================================
    // 6. ОБРАБОТКА ОШИБОК
    // ============================================================================

    showError(message, error = null) {
        // Haptic notification
        this.tg.HapticFeedback.notificationOccurred('error');
        
        // Показываем алерт
        this.tg.showAlert(`❌ Ошибка: ${message}`);
        
        // Логируем ошибку
        if (error) {
            console.error('Ошибка:', error);
        }
    }

    showSuccess(message) {
        // Haptic notification
        this.tg.HapticFeedback.notificationOccurred('success');
        
        // Показываем алерт
        this.tg.showAlert(`✅ ${message}`);
    }

    // ============================================================================
    // 7. НАВИГАЦИЯ
    // ============================================================================

    handleMainButtonClick() {
        // Haptic feedback
        this.tg.HapticFeedback.impactOccurred('medium');
        
        // Обработка в зависимости от текущего состояния
        const currentState = this.getCurrentState();
        
        switch (currentState) {
            case 'quest_playing':
                this.submitCurrentAnswer();
                break;
            case 'wallet_connect':
                this.connectWallet();
                break;
            case 'shop':
                this.purchaseItem();
                break;
            default:
                console.log('Основная кнопка нажата');
        }
    }

    handleBackButtonClick() {
        // Haptic feedback
        this.tg.HapticFeedback.impactOccurred('light');
        
        // Возврат к предыдущему экрану
        const currentState = this.getCurrentState();
        
        switch (currentState) {
            case 'quest_playing':
                this.showQuestList();
                break;
            case 'quest_list':
                this.showMainMenu();
                break;
            case 'wallet':
                this.showMainMenu();
                break;
            default:
                this.showMainMenu();
        }
    }

    // ============================================================================
    // 8. ДОСТИЖЕНИЯ И НАГРАДЫ
    // ============================================================================

    showAchievement(achievement) {
        // Haptic notification
        this.tg.HapticFeedback.notificationOccurred('success');
        
        // Показываем всплывающее окно
        this.tg.showPopup({
            title: '🏆 Достижение разблокировано!',
            message: `"${achievement.name}"\n${achievement.description}`,
            buttons: [
                { text: 'Посмотреть', type: 'default' },
                { text: 'Закрыть', type: 'cancel' }
            ]
        });
        
        // Отправляем данные в бот
        this.sendQuestData('achievement_unlocked', achievement);
        
        console.log('Достижение разблокировано:', achievement);
    }

    showNFTMinted(nftData) {
        // Haptic notification
        this.tg.HapticFeedback.notificationOccurred('success');
        
        // Показываем уведомление
        this.tg.showAlert(`💎 NFT "${nftData.name}" создан!\n\nОписание: ${nftData.description}`);
        
        // Отправляем данные в бот
        this.sendQuestData('nft_minted', nftData);
        
        console.log('NFT создан:', nftData);
    }

    // ============================================================================
    // 9. МАГАЗИН И ПОКУПКИ
    // ============================================================================

    showShop() {
        // Скрываем основную кнопку
        this.tg.MainButton.hide();
        
        // Показываем кнопку "Назад"
        this.tg.BackButton.show();
        
        console.log('Показан магазин');
    }

    purchaseItem(item) {
        this.tg.showConfirm(
            `Купить "${item.name}" за ${item.price} QUC?`,
            (confirmed) => {
                if (confirmed) {
                    this.sendQuestData('purchase_item', item);
                    this.tg.HapticFeedback.notificationOccurred('success');
                    this.tg.showAlert(`✅ "${item.name}" куплен!`);
                }
            }
        );
    }

    // ============================================================================
    // 10. УТИЛИТЫ
    // ============================================================================

    getCurrentState() {
        // Получаем текущее состояние из localStorage или другого источника
        return localStorage.getItem('quest_forge_state') || 'main_menu';
    }

    setCurrentState(state) {
        localStorage.setItem('quest_forge_state', state);
    }

    // Проверка валидности данных
    validateData(botToken) {
        if (!this.tg || !botToken) return false;
        
        return this.tg.validateInitData(this.tg.initData, botToken);
    }

    // Получение параметров запуска
    getStartParams() {
        const startParam = this.tg.initDataUnsafe?.start_param;
        
        if (startParam) {
            try {
                return JSON.parse(decodeURIComponent(startParam));
            } catch (error) {
                console.error('Ошибка парсинга параметров запуска:', error);
                return {};
            }
        }
        
        return {};
    }

    // Закрытие приложения
    closeApp() {
        this.tg.close();
    }

    // Открытие ссылки
    openLink(url) {
        this.tg.openLink(url);
    }

    // Открытие Telegram
    openTelegram(path) {
        this.tg.openTelegramLink(path);
    }
}

// ============================================================================
// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
// ============================================================================

// Инициализация
const sdkExamples = new QuestForgeSDKExamples();

// Пример использования в квестах
function exampleQuestFlow() {
    // Показываем список квестов
    sdkExamples.showQuestList();
    
    // Начинаем квест
    sdkExamples.startQuest('quest_123');
    
    // Пользователь отвечает
    sdkExamples.submitQuestAnswer('quest_123', 'ответ пользователя');
    
    // Завершаем квест
    sdkExamples.completeQuest({
        id: 'quest_123',
        name: 'Тайна старого замка',
        reward: 50
    });
}

// Пример работы с кошельком
function exampleWalletFlow() {
    // Показываем подключение кошелька
    sdkExamples.showWalletConnect();
    
    // Кошелек подключен
    sdkExamples.walletConnected('EQD...');
    
    // Запрос на вывод
    sdkExamples.requestWithdraw(100);
}

// Пример достижений
function exampleAchievements() {
    // Показываем достижение
    sdkExamples.showAchievement({
        id: 'first_quest',
        name: 'Первый квест',
        description: 'Завершите свой первый квест'
    });
    
    // Показываем NFT
    sdkExamples.showNFTMinted({
        id: 'nft_123',
        name: 'Редкий артефакт',
        description: 'Уникальный NFT за прохождение сложного квеста'
    });
}

// Экспорт для использования в других модулях
window.QuestForgeSDKExamples = QuestForgeSDKExamples; 