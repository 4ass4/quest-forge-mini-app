# Quest Forge Mini App

Современное Telegram Mini App для платформы Quest Forge, построенное с использованием React, TypeScript и Webpack.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Разработка
```bash
npm start
```
Приложение будет доступно на `http://localhost:9000`

### Сборка для продакшена
```bash
npm run build
```

### Анализ бандла
```bash
npm run analyze
```

## 🛠️ Технологии

- **React 18** - Современный UI фреймворк
- **TypeScript** - Типизированный JavaScript
- **Webpack 5** - Сборщик модулей
- **@twa-dev/sdk** - Официальный SDK для Telegram Web Apps
- **CSS Modules** - Изолированные стили
- **ESLint + Prettier** - Линтинг и форматирование кода

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── MainMenu.tsx
│   ├── QuestList.tsx
│   ├── QuestPlaying.tsx
│   ├── Wallet.tsx
│   ├── Shop.tsx
│   ├── LoadingScreen.tsx
│   └── ErrorBoundary.tsx
├── hooks/              # React хуки
│   ├── useTelegram.ts
│   ├── useQuestEngine.ts
│   └── useTONConnect.ts
├── types/              # TypeScript типы
│   └── index.ts
├── styles.css          # Глобальные стили
├── App.tsx             # Главный компонент
└── index.tsx           # Точка входа
```

## 🎨 Особенности

### Telegram Web App интеграция
- Автоматическая адаптация к теме Telegram
- Поддержка haptic feedback
- Интеграция с Telegram API

### Современный UI/UX
- Адаптивный дизайн
- Плавные анимации
- Поддержка темной/светлой темы
- Нативные жесты

### TypeScript
- Полная типизация
- Автодополнение в IDE
- Раннее обнаружение ошибок

### Оптимизация
- Tree shaking
- Code splitting
- Минификация для продакшена
- Анализ размера бандла

## 🔧 Команды разработки

```bash
# Линтинг
npm run test:eslint
npm run lint:fix

# Проверка типов
npm run tsc

# Форматирование
npm run prettier
npm run prettier:fix

# Проверка стилей
npm run test:stylelint
```

## 📱 Функциональность

### Основные экраны
1. **Главное меню** - Навигация по приложению
2. **Список квестов** - Просмотр доступных квестов
3. **Прохождение квеста** - Игровой процесс
4. **Кошелек** - Управление токенами QUC
5. **Магазин** - Покупка предметов

### Интеграции
- **Telegram Web App API** - Основная интеграция
- **TON Connect** - Блокчейн кошелек
- **REST API** - Связь с бэкендом

## 🚀 Развертывание

### Локальная разработка
1. Установите зависимости: `npm install`
2. Запустите dev сервер: `npm start`
3. Откройте `http://localhost:9000`

### Продакшен
1. Соберите проект: `npm run build`
2. Загрузите файлы из `dist/` на ваш сервер
3. Настройте HTTPS (обязательно для Telegram Mini Apps)

## 🔒 Безопасность

- Валидация Telegram initData
- HTTPS только
- Защита от XSS
- Безопасные API вызовы

## 📊 Мониторинг

- Автоматическое логирование ошибок
- Анализ производительности
- Отслеживание пользовательских действий

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature ветку
3. Внесите изменения
4. Запустите линтеры: `npm run test:eslint && npm run tsc`
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера
2. Убедитесь, что все зависимости установлены
3. Проверьте, что API сервер запущен
4. Создайте issue в репозитории 