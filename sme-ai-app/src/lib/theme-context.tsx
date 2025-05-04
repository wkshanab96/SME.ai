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
  const [isMounted, setIsMounted] = useState(false);
  
  // Mark the component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Initialize theme from localStorage on first render only
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const root = window.document.documentElement;
      
      // Remove any existing theme classes
      root.classList.remove('light', 'dark');
      
      // Get stored theme or default to light
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      } else {
        // If no stored theme, default to light
        setThemeState('light');
        localStorage.setItem('theme', 'light');
        root.classList.add('light');
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
  }, [isMounted]);
  
  // Set up system theme change detection and handle theme application
  useEffect(() => {
    if (!isMounted) return;
    
    // Apply theme
    updateTheme(theme);
    
    // Set up system theme change detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isMounted]);
  
  const updateTheme = (newTheme: Theme) => {
    if (!isMounted) return;
    
    try {
      const root = window.document.documentElement;
      
      // Calculate the effective theme (light or dark)
      let effective: 'light' | 'dark';
      if (newTheme === 'system') {
        effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        effective = newTheme;
      }
      
      // Store in localStorage
      localStorage.setItem('theme', newTheme);
      
      // Update DOM by removing both classes first, then adding the correct one
      root.classList.remove('light', 'dark');
      root.classList.add(effective);
      
      console.log(`Theme updated to ${newTheme} (effective: ${effective})`);
      
      setResolvedTheme(effective);
    } catch (e) {
      console.error("Error updating theme:", e);
    }
  };
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'light' || (prev === 'system' && resolvedTheme === 'light') 
        ? 'dark' 
        : 'light';
      console.log(`Toggling theme from ${prev} (resolved: ${resolvedTheme}) to ${newTheme}`);
      return newTheme;
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