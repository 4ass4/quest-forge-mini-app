import axios from 'axios';

// API будет работать через CORS с вашего сервера
const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем Telegram данные к запросам
api.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp;
  if (tg && tg.initDataUnsafe.user) {
    config.headers['X-Telegram-User-ID'] = tg.initDataUnsafe.user.id;
    config.headers['X-Telegram-User-Data'] = JSON.stringify(tg.initDataUnsafe.user);
  }
  return config;
});

// API методы
export const questApi = {
  getQuests: () => api.get('/api/quests'),
  getQuest: (id: number) => api.get(`/api/quests/${id}`),
  submitAnswer: (questId: number, answer: string) => 
    api.post(`/api/quests/${questId}/answer`, { answer }),
};

export const userApi = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data: any) => api.put('/api/user/profile', data),
  getStats: () => api.get('/api/user/stats'),
};

export const shopApi = {
  getItems: () => api.get('/api/shop/items'),
  purchaseItem: (itemId: string) => api.post(`/api/shop/purchase/${itemId}`),
  getUserItems: () => api.get('/api/shop/user-items'),
};

export const leaderboardApi = {
  getTopPlayers: () => api.get('/api/leaderboard/players'),
  getTopQuests: () => api.get('/api/leaderboard/quests'),
  getUserRank: () => api.get('/api/leaderboard/user-rank'),
};

export default api;
