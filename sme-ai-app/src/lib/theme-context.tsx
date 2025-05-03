'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize theme from localStorage and set up media query
  useEffect(() => {
    // Get stored theme or default to system
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    }
    
    // Apply theme
    updateTheme(storedTheme || 'system');
    
    // Set up system theme change detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Update theme whenever it changes
  useEffect(() => {
    updateTheme(theme);
  }, [theme]);
  
  const updateTheme = (newTheme: Theme) => {
    // Store in localStorage
    localStorage.setItem('theme', newTheme);
    
    // Calculate the effective theme (light or dark)
    let effective: 'light' | 'dark';
    if (newTheme === 'system') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      effective = newTheme;
    }
    
    // Update DOM
    if (effective === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setResolvedTheme(effective);
  };
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const toggleTheme = () => {
    setThemeState(prev => {
      // If system, switch to the opposite of the resolved theme
      if (prev === 'system') {
        return resolvedTheme === 'light' ? 'dark' : 'light';
      }
      // Otherwise just toggle
      return prev === 'light' ? 'dark' : 'light';
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}