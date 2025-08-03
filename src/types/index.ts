export enum Screen {
  LOADING = 'loading',
  MAIN_MENU = 'main_menu',
  QUEST_LIST = 'quest_list',
  QUEST_PLAYING = 'quest_playing',
  WALLET = 'wallet',
  SHOP = 'shop',
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  genre: string;
  difficulty: string;
  stages_count: number;
  avg_rating: number;
  total_plays: number;
  creator_username?: string;
  cover_image_url?: string;
  keywords: string;
  stages: QuestStage[];
}

export interface QuestStage {
  id: number;
  description: string;
  puzzle: string;
  correct_answer: string;
  hint: string;
}

export interface UserProgress {
  quest_id: number;
  current_stage: number;
  is_completed: boolean;
  start_time: string;
  end_time?: string;
  errors_count: number;
  hints_used: number;
}

export interface UserInventory {
  hint_count: number;
  skip_count: number;
  super_skip_count: number;
  booster50_count: number;
  booster100_count: number;
  booster50_activated_at?: number;
  booster100_activated_at?: number;
}

export interface AppState {
  currentScreen: Screen;
  user: TelegramUser | null;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

export interface QuestEngine {
  getQuests: () => Promise<Quest[]>;
  getQuestById: (id: number) => Promise<Quest | null>;
  startQuest: (questId: number) => Promise<UserProgress>;
  submitAnswer: (questId: number, answer: string) => Promise<boolean>;
  getProgress: (questId: number) => Promise<UserProgress | null>;
  completeQuest: (questId: number) => Promise<void>;
}

export interface TONConnect {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  getWallet: () => any;
  sendTransaction: (transaction: any) => Promise<any>;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'hint' | 'skip' | 'super_skip' | 'booster50' | 'booster100';
  icon: string;
} 