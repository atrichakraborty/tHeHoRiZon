import React from 'react';
import { Sparkles, Command } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AppLogo: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30 ${sizeClasses[size]} ${className}`}>
      <Sparkles className={`text-white absolute ${iconSizes[size]}`} strokeWidth={2.5} />
      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl -z-10 blur opacity-40"></div>
    </div>
  );
};