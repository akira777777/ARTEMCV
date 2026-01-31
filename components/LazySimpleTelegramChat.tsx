import React, { lazy, Suspense } from 'react';

const SimpleTelegramChat = lazy(() => import('./SimpleTelegramChat'));

interface LazySimpleTelegramChatProps {
  fallback?: React.ReactNode;
}

const LazySimpleTelegramChat: React.FC<LazySimpleTelegramChatProps> = ({ 
  fallback = null
}) => {
  return (
    <Suspense fallback={fallback}>
      <SimpleTelegramChat />
    </Suspense>
  );
};

export default LazySimpleTelegramChat;