// Движок квестов для Mini App
class QuestEngine {
    constructor() {
        this.currentQuest = null;
        this.currentStage = 0;
        this.quests = [];
        this.userProgress = {};
        this.init();
    }

    async init() {
        // Загрузка квестов с сервера
        await this.loadQuests();
        // Загрузка прогресса пользователя
        await this.loadUserProgress();
    }

    // Загрузка квестов с сервера
    async loadQuests() {
        try {
            const chatId = window.telegramAPI.getChatId();
            const user = window.telegramAPI.getUser();

            // Отправляем запрос в бот для получения квестов
            const response = await fetch('/api/quests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: chatId,
                    userId: user.id,
                    action: 'get_quests'
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.quests = data.quests || [];
                this.renderQuestList();
            } else {
                console.error('Failed to load quests');
                // Показываем тестовые квесты
                this.quests = this.getTestQuests();
                this.renderQuestList();
            }
        } catch (error) {
            console.error('Error loading quests:', error);
            // Показываем тестовые квесты
            this.quests = this.getTestQuests();
            this.renderQuestList();
        }
    }

    // Загрузка прогресса пользователя
    async loadUserProgress() {
        try {
            const user = window.telegramAPI.getUser();
            const response = await fetch('/api/user-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    action: 'get_progress'
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.userProgress = data.progress || {};
            }
        } catch (error) {
            console.error('Error loading user progress:', error);
        }
    }

    // Тестовые квесты для демонстрации
    getTestQuests() {
        return [
            {
                id: 1,
                title: "Тайны старого города",
                description: "Исследуйте древние улицы и раскройте секреты прошлого",
                genre: "Детектив",
                difficulty: "Средний",
                stages_count: 3,
                reward: 50,
                is_completed: false
            },
            {
                id: 2,
                title: "Космическое путешествие",
                description: "Отправьтесь в межгалактическое приключение",
                genre: "Фантастика",
                difficulty: "Сложный",
                stages_count: 5,
                reward: 100,
                is_completed: false
            },
            {
                id: 3,
                title: "Магическая академия",
                description: "Изучите древние заклинания и станьте великим магом",
                genre: "Фэнтези",
                difficulty: "Легкий",
                stages_count: 2,
                reward: 30,
                is_completed: false
            }
        ];
    }

    // Отображение списка квестов
    renderQuestList() {
        const container = document.getElementById('quests-container');
        if (!container) return;

        container.innerHTML = '';

        this.quests.forEach(quest => {
            const questCard = this.createQuestCard(quest);
            container.appendChild(questCard);
        });
    }

    // Создание карточки квеста
    createQuestCard(quest) {
        const card = document.createElement('div');
        card.className = 'quest-card';
        card.onclick = () => this.startQuest(quest);

        const difficultyClass = this.getDifficultyClass(quest.difficulty);
        const progress = this.userProgress[quest.id] || 0;
        const progressPercent = (progress / quest.stages_count) * 100;

        card.innerHTML = `
            <div class="quest-title">${quest.title}</div>
            <div class="quest-info">
                <p>${quest.description}</p>
                <p><strong>Жанр:</strong> ${quest.genre}</p>
                <p><strong>Этапов:</strong> ${quest.stages_count}</p>
                <p><strong>Награда:</strong> ${quest.reward} QUC</p>
                <span class="quest-difficulty ${difficultyClass}">${quest.difficulty}</span>
            </div>
            <div class="quest-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-text">${progress}/${quest.stages_count}</span>
            </div>
        `;

        return card;
    }

    // Получение класса сложности
    getDifficultyClass(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'легкий': return 'difficulty-easy';
            case 'средний': return 'difficulty-medium';
            case 'сложный': return 'difficulty-hard';
            default: return 'difficulty-medium';
        }
    }

    // Начало квеста
    async startQuest(quest) {
        try {
            this.currentQuest = quest;
            this.currentStage = 0;

            // Загружаем детали квеста с сервера
            const questDetails = await this.loadQuestDetails(quest.id);
            if (questDetails) {
                this.currentQuest = { ...quest, ...questDetails };
            }

            this.showQuestPlaying();
        } catch (error) {
            console.error('Error starting quest:', error);
            window.telegramAPI.showAlert('Ошибка загрузки квеста');
        }
    }

    // Загрузка деталей квеста
    async loadQuestDetails(questId) {
        try {
            const response = await fetch('/api/quest-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questId: questId,
                    action: 'get_details'
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error loading quest details:', error);
        }
        return null;
    }

    // Показ экрана прохождения квеста
    showQuestPlaying() {
        this.hideAllScreens();
        document.getElementById('quest-playing').classList.add('active');
        
        this.updateQuestUI();
    }

    // Обновление UI квеста
    updateQuestUI() {
        if (!this.currentQuest) return;

        const titleElement = document.getElementById('quest-title');
        const descriptionElement = document.getElementById('quest-description');
        const stageElement = document.getElementById('quest-stage');

        if (titleElement) {
            titleElement.textContent = this.currentQuest.title;
        }

        if (descriptionElement) {
            descriptionElement.innerHTML = `
                <h3>Описание квеста</h3>
                <p>${this.currentQuest.description}</p>
                <p><strong>Жанр:</strong> ${this.currentQuest.genre}</p>
                <p><strong>Сложность:</strong> ${this.currentQuest.difficulty}</p>
                <p><strong>Награда:</strong> ${this.currentQuest.reward} QUC</p>
            `;
        }

        this.showCurrentStage();
    }

    // Показ текущего этапа
    showCurrentStage() {
        if (!this.currentQuest || !this.currentQuest.stages) return;

        const stage = this.currentQuest.stages[this.currentStage];
        const stageElement = document.getElementById('quest-stage');

        if (stageElement && stage) {
            stageElement.innerHTML = `
                <h3>Этап ${stage.stage_number}</h3>
                <p><strong>Загадка:</strong> ${stage.puzzle}</p>
                <p><strong>Подсказка:</strong> ${stage.hint}</p>
            `;
        }
    }

    // Отправка ответа
    async submitAnswer() {
        const answerInput = document.getElementById('answer-input');
        const answer = answerInput.value.trim();

        if (!answer) {
            window.telegramAPI.showAlert('Введите ответ');
            return;
        }

        try {
            const isCorrect = await this.checkAnswer(answer);
            
            if (isCorrect) {
                this.currentStage++;
                
                if (this.currentStage >= this.currentQuest.stages.length) {
                    // Квест завершен
                    await this.completeQuest();
                } else {
                    // Следующий этап
                    this.showCurrentStage();
                    answerInput.value = '';
                    window.telegramAPI.showAlert('Правильно! Переходим к следующему этапу');
                }
            } else {
                window.telegramAPI.showAlert('Неправильный ответ. Попробуйте еще раз');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            window.telegramAPI.showAlert('Ошибка проверки ответа');
        }
    }

    // Проверка ответа
    async checkAnswer(answer) {
        try {
            const response = await fetch('/api/check-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questId: this.currentQuest.id,
                    stageNumber: this.currentStage + 1,
                    answer: answer
                })
            });

            if (response.ok) {
                const result = await response.json();
                return result.isCorrect;
            }
        } catch (error) {
            console.error('Error checking answer:', error);
        }

        // Заглушка для демонстрации
        const stage = this.currentQuest.stages[this.currentStage];
        return answer.toLowerCase() === stage.correct_answer.toLowerCase();
    }

    // Завершение квеста
    async completeQuest() {
        try {
            // Отправляем данные о завершении в бот
            await window.telegramAPI.sendData({
                action: 'complete_quest',
                questId: this.currentQuest.id,
                userId: window.telegramAPI.getUser().id
            });

            // Обновляем прогресс
            this.userProgress[this.currentQuest.id] = this.currentQuest.stages.length;

            // Показываем поздравление
            window.telegramAPI.showAlert(`🎉 Поздравляем! Квест "${this.currentQuest.title}" завершен!`);
            
            // Возвращаемся к списку квестов
            this.showQuestList();
        } catch (error) {
            console.error('Error completing quest:', error);
        }
    }

    // Навигация между экранами
    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
    }

    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('main-menu').classList.add('active');
    }

    showQuestList() {
        this.hideAllScreens();
        document.getElementById('quest-list').classList.add('active');
        this.renderQuestList();
    }

    showWallet() {
        this.hideAllScreens();
        document.getElementById('wallet-screen').classList.add('active');
    }

    showShop() {
        this.hideAllScreens();
        document.getElementById('shop-screen').classList.add('active');
    }
}

// Глобальный экземпляр движка квестов
window.questEngine = new QuestEngine();

// Глобальные функции для HTML
window.showQuestList = function() {
    window.questEngine.showQuestList();
};

window.showMainMenu = function() {
    window.questEngine.showMainMenu();
};

window.showWallet = function() {
    window.questEngine.showWallet();
};

window.showShop = function() {
    window.questEngine.showShop();
};

window.submitAnswer = function() {
    window.questEngine.submitAnswer();
}; 