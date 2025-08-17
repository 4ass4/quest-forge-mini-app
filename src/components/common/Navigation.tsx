import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  User, 
  Trophy, 
  ShoppingBag
} from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { hapticFeedback } = useTelegram();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/leaderboard', icon: Trophy, label: t('nav.leaderboard') },
    { path: '/shop', icon: ShoppingBag, label: t('nav.shop') },
    { path: '/profile', icon: User, label: t('nav.profile') },
  ];

  const handleNavigation = (path: string) => {
    hapticFeedback('selection');
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-telegram-secondary border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'text-telegram-blue bg-telegram-blue bg-opacity-10' 
                  : 'text-gray-400 hover:text-white active:scale-95'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
