const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Создаем Supabase клиент
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

class SupabaseService {
  // Создание или получение пользователя
  async createOrGetUser(telegramUser) {
    try {
      console.log(`🔄 Создание/получение пользователя ${telegramUser.id}`);
      
      // Проверяем существующего пользователя
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        console.error('❌ Ошибка поиска пользователя:', findError);
        throw findError;
      }

      if (existingUser) {
        // Обновляем существующего пользователя
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            language_code: telegramUser.language_code,
            is_premium: telegramUser.is_premium,
            last_active_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Ошибка обновления пользователя:', updateError);
          throw updateError;
        }

        console.log(`✅ Пользователь обновлен: ${updatedUser.first_name}`);
        return updatedUser;
      }

      // Создаем нового пользователя
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          language_code: telegramUser.language_code || 'ru',
          is_premium: telegramUser.is_premium || false,
          balance: 100, // Стартовый баланс
          level: 1,
          experience: 0,
          total_score: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Ошибка создания пользователя:', createError);
        throw createError;
      }

      console.log(`🎉 Новый пользователь создан: ${newUser.first_name}`);
      
      // Даем стартовое достижение
      await this.giveStarterAchievement(newUser.id);

      return newUser;
    } catch (error) {
      console.error('❌ Ошибка в createOrGetUser:', error);
      throw error;
    }
  }

  // Получение пользователя по Telegram ID
  async getUserByTelegramId(telegramId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (error) {
        console.error('❌ Ошибка получения пользователя:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('❌ Ошибка в getUserByTelegramId:', error);
      return null;
    }
  }

  // Получение топ игроков
  async getTopPlayers(limit = 10) {
    try {
      const { data: players, error } = await supabase
        .from('users')
        .select('id, first_name, username, total_score, quests_completed, level')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Ошибка получения топ игроков:', error);
        return [];
      }

      return players || [];
    } catch (error) {
      console.error('❌ Ошибка в getTopPlayers:', error);
      return [];
    }
  }

  // Стартовое достижение
  async giveStarterAchievement(userId) {
    try {
      // Создаем достижение если его нет
      const { data: achievement, error: findError } = await supabase
        .from('achievements')
        .select('*')
        .eq('key', 'first_steps')
        .single();

      if (findError && findError.code !== 'PGRST116') {
        console.error('❌ Ошибка поиска достижения:', findError);
        return;
      }

      let achievementId;
      if (!achievement) {
        // Создаем достижение
        const { data: newAchievement, error: createError } = await supabase
          .from('achievements')
          .insert({
            key: 'first_steps',
            title: 'Первые шаги',
            description: 'Добро пожаловать в Quest Forge!',
            icon: '🎮',
            points: 10
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Ошибка создания достижения:', createError);
          return;
        }

        achievementId = newAchievement.id;
      } else {
        achievementId = achievement.id;
      }

      // Даем достижение пользователю
      const { error: assignError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId
        });

      if (assignError) {
        console.error('❌ Ошибка назначения достижения:', assignError);
        return;
      }

      console.log(`🏆 Пользователю ${userId} дано стартовое достижение`);
    } catch (error) {
      console.error('❌ Ошибка в giveStarterAchievement:', error);
    }
  }
}

module.exports = new SupabaseService();