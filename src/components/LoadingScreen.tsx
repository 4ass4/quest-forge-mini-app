import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <div className="loading-text">Загрузка Quest Forge...</div>
    </div>
  );
}; 