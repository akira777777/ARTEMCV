import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const EnhancedGradientShaderCard = lazy(() => import('./EnhancedGradientShaderCard'));

interface LazyEnhancedGradientShaderCardProps {
  fallback?: React.ReactNode;
  className?: string;
}

const LazyEnhancedGradientShaderCard: React.FC<LazyEnhancedGradientShaderCardProps> = ({ 
  fallback = (
    <div className="w-full h-[360px] lg:h-[440px] rounded-[2.7rem] overflow-hidden relative bg-[#0f172a] flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  ),
  className
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        <EnhancedGradientShaderCard />
      </Suspense>
    </div>
  );
};

export default LazyEnhancedGradientShaderCard;