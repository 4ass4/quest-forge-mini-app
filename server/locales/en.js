module.exports = {
  // Common phrases
  welcome: '🎮 Welcome to Quest Forge, {firstName}!',
  error: '😔 An error occurred. Try again later or contact administrator.',
  
  // User progress
  progress: '🏆 Your progress:',
  level: '📊 Level: {level}',
  balance: '💰 Balance: {balance} QUC',
  questsCompleted: '✅ Quests completed: {count}',
  totalScore: '⭐ Total score: {score}',
  
  // Welcome for new users
  newUserBonus: '🎁 Welcome! You received a starting bonus of 100 QUC!',
  excitingQuests: '🚀 Exciting quests await you!',
  
  // Buttons
  buttons: {
    play: '🎮 Play',
    profile: '👤 Profile',
    leaderboard: '🏆 Leaderboard',
    help: '❓ Help',
    shop: '💰 Shop',
    refresh: '🔄 Refresh',
    openShop: '🛒 Open Shop'
  },
  
  // Help
  help: {
    title: '❓ How to play Quest Forge:',
    steps: [
      '1️⃣ Click "🎮 Play" to launch Mini App',
      '2️⃣ Choose a quest from the list',
      '3️⃣ Answer questions and earn QUC',
      '4️⃣ Use hints and skips when needed',
      '5️⃣ Compete in leaderboard with other players'
    ],
    goal: '🎯 Goal: complete as many quests as possible and achieve high ranking!'
  },
  
  // Profile
  profile: {
    title: '👤 **Player Profile {firstName}**',
    stats: '📊 **Statistics:**',
    achievements: '✅ **Achievements:**',
    registrationDate: '📅 Registration date: {date}',
    lastActive: '🕐 Last activity: {date}'
  },
  
  // Shop
  shop: {
    title: '💰 **Quest Forge Shop**',
    availableItems: '🛒 **Available items:**',
    items: [
      '💡 Hint - 50 QUC',
      '⏭️ Skip question - 75 QUC',
      '🚀 Experience booster x2 - 100 QUC',
      '🎨 New theme - 150 QUC'
    ],
    howToBuy: '💎 **How to buy:**',
    buySteps: [
      '1️⃣ Open Mini App',
      '2️⃣ Go to "Shop" section',
      '3️⃣ Choose an item',
      '4️⃣ Confirm purchase'
    ],
    yourBalance: '💰 **Your balance:** {balance} QUC'
  },
  
  // Leaderboard
  leaderboard: {
    title: '🏆 **Quest Forge Top Players:**',
    noData: '😔 No player data yet',
    openForDetails: 'Open Mini App for detailed leaderboard!',
    playerInfo: '   ⭐ {score} points | 🎯 {quests} quests | 🆙 {level} level'
  },
  
  // Web App data
  webAppSuccess: {
    title: '🎉 Great game!',
    progress: '📊 Your progress is saved',
    stats: '🔄 Statistics updated',
    continue: '✅ Keep playing!',
    goodLuck: 'Good luck in the next quests! 🎮'
  },
  
  // Errors
  errors: {
    profileNotFound: '❌ Profile not found. Try /start',
    profileError: '❌ Error getting profile',
    shopError: '❌ Error getting shop',
    leaderboardError: '❌ Error getting leaderboard',
    callbackError: 'Feature will be available soon!'
  }
};
