'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import { motion } from 'framer-motion';

interface EnhancedThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EnhancedThemeToggle: React.FC<EnhancedThemeToggleProps> = ({
  size = 'md',
  className = '',
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only render the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className={className} style={{ width: size === 'sm' ? '40px' : size === 'md' ? '56px' : '72px', height: size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px' }} />;
  }
  
  const isDark = resolvedTheme === 'dark';
  
  // Determine dimensions based on size
  const width = size === 'sm' ? 40 : size === 'md' ? 56 : 72;
  const height = size === 'sm' ? 24 : size === 'md' ? 32 : 40;
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const padding = size === 'sm' ? 3 : size === 'md' ? 4 : 5;

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      style={{ width, height }}
      onClick={toggleTheme}
      role="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <motion.div
        className="w-full h-full rounded-full flex items-center justify-between px-2"
        style={{
          backgroundColor: isDark ? '#374151' : '#E5E7EB',
          padding: `${padding}px`,
        }}
      >
        {/* Sun Icon */}
        <motion.div
          animate={{
            scale: isDark ? 0.7 : 1,
            opacity: isDark ? 0.5 : 1,
          }}
          className="z-10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isDark ? '#9CA3AF' : '#F59E0B'} 
            className="z-10"
            style={{ width: iconSize, height: iconSize }}
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </motion.div>
        
        {/* Moon Icon */}
        <motion.div
          animate={{
            scale: isDark ? 1 : 0.7,
            opacity: isDark ? 1 : 0.5,
          }}
          className="z-10"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isDark ? '#94A3B8' : '#64748B'} 
            className="z-10"
            style={{ width: iconSize, height: iconSize }}
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        </motion.div>
        
        {/* Toggle Circle */}
        <motion.div
          className="absolute rounded-full bg-white shadow-md z-20"
          style={{
            width: height - padding * 2,
            height: height - padding * 2,
          }}
          animate={{
            x: isDark ? width - height + padding : padding,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
        />
      </motion.div>
    </div>
  );
};
