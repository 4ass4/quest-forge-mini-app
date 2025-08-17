// Статические данные для Mini App
export const STATIC_QUESTS = [
  {
    id: 1,
    title: "Тайны космоса",
    description: "Увлекательное путешествие по галактике",
    difficulty: "Легкий",
    rating: 4.8,
    plays: 1247,
    reward: 50,
    estimatedTime: 10,
    steps: [
      {
        id: 1,
        question: 'Какая планета является самой большой в нашей Солнечной системе?',
        answer: 'юпитер',
        hint: 'Эта планета названа в честь римского бога и имеет множество спутников',
        image: '🪐'
      },
      {
        id: 2,
        question: 'Сколько планет в нашей Солнечной системе?',
        answer: '8',
        hint: 'Плутон больше не считается планетой с 2006 года'
      },
      {
        id: 3,
        question: 'Как называется ближайшая к нам звезда?',
        answer: 'солнце',
        hint: 'Мы видим её каждый день на небе'
      }
    ]
  },
  {
    id: 2,
    title: "Загадки истории",
    description: "Раскройте секреты древних цивилизаций",
    difficulty: "Средний",
    rating: 4.6,
    plays: 892,
    reward: 75,
    estimatedTime: 15,
    steps: [
      {
        id: 1,
        question: 'В каком году была построена Берлинская стена?',
        answer: '1961',
        hint: 'Это было в период холодной войны, в начале 60-х годов'
      },
      {
        id: 2,
        question: 'Кто был первым императором Римской империи?',
        answer: 'август',
        hint: 'Его первоначальное имя было Октавиан'
      }
    ]
  },
  {
    id: 3,
    title: "Мир науки",
    description: "Захватывающие научные открытия",
    difficulty: "Сложный",
    rating: 4.9,
    plays: 543,
    reward: 100,
    estimatedTime: 20,
    steps: [
      {
        id: 1,
        question: 'Кто сформулировал теорию относительности?',
        answer: 'эйнштейн',
        hint: 'Немецкий физик, получивший Нобелевскую премию'
      }
    ]
  },
  {
    id: 4,
    title: "IT и технологии",
    description: "Современные технологии и программирование",
    difficulty: "Средний",
    rating: 4.7,
    plays: 678,
    reward: 80,
    estimatedTime: 12,
    steps: [
      {
        id: 1,
        question: 'Кто создал язык программирования Python?',
        answer: 'гвидо ван россум',
        hint: 'Голландский программист, создавший Python в 1991 году'
      }
    ]
  },
  {
    id: 5,
    title: "География мира",
    description: "Путешествие по континентам и странам",
    difficulty: "Легкий",
    rating: 4.5,
    plays: 923,
    reward: 45,
    estimatedTime: 8,
    steps: [
      {
        id: 1,
        question: 'Какая самая большая страна в мире по площади?',
        answer: 'россия',
        hint: 'Эта страна занимает территорию в двух частях света'
      }
    ]
  }
];

export const STATIC_LEADERBOARD = [
  { id: 1, name: 'Александр', username: 'alex_quest', score: 15420, completedQuests: 89, rank: 1 },
  { id: 2, name: 'Мария', username: 'maria_gamer', score: 14230, completedQuests: 76, rank: 2 },
  { id: 3, name: 'Дмитрий', username: 'dmitry_pro', score: 13150, completedQuests: 71, rank: 3 },
  { id: 4, name: 'Анна', username: 'anna_quest', score: 12890, completedQuests: 68, rank: 4 },
  { id: 5, name: 'Сергей', username: 'sergey_top', score: 12340, completedQuests: 65, rank: 5 },
  { id: 6, name: 'Елена', username: 'elena_smart', score: 11980, completedQuests: 62, rank: 6 },
  { id: 7, name: 'Игорь', username: 'igor_quest', score: 11750, completedQuests: 59, rank: 7 },
  { id: 8, name: 'Ольга', username: 'olga_brain', score: 11420, completedQuests: 56, rank: 8 }
];

export const STATIC_SHOP_ITEMS = [
  {
    id: 'hint_1',
    name: 'Подсказка',
    description: 'Получите подсказку для текущего вопроса',
    price: 50,
    icon: '💡',
    category: 'hints'
  },
  {
    id: 'skip_1',
    name: 'Пропуск',
    description: 'Пропустить сложный вопрос',
    price: 75,
    icon: '⏭️',
    category: 'skips'
  },
  {
    id: 'boost_2x',
    name: 'Удвоитель награды',
    description: 'Удваивает награду за квест на 1 час',
    price: 300,
    icon: '⚡',
    category: 'boosters'
  },
  {
    id: 'theme_dark',
    name: 'Темная тема',
    description: 'Стильная темная тема оформления',
    price: 200,
    icon: '🌙',
    category: 'themes'
  },
  {
    id: 'avatar_frame',
    name: 'Рамка аватара',
    description: 'Золотая рамка для профиля',
    price: 150,
    icon: '🖼️',
    category: 'cosmetics'
  }
];
