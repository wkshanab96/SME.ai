'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'purple' | 'green' | 'amber' | 'rose'; // Color scheme options

interface ThemePreferences {
  autoSwitch: boolean; // Auto switch between light/dark based on time
  startHour: number; // Hour to switch to light mode (0-23)
  endHour: number; // Hour to switch to dark mode (0-23)
  colorScheme: ColorScheme; // Accent color scheme
  animations: boolean; // Whether to show animations
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  preferences: ThemePreferences;
  updatePreferences: (prefs: Partial<ThemePreferences>) => void;
  colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');
  const [preferences, setPreferences] = useState<ThemePreferences>({
    autoSwitch: false,
    startHour: 6, // 6 AM - switch to light mode
    endHour: 18, // 6 PM - switch to dark mode
    colorScheme: 'blue',
    animations: true
  });
  
  // Mark the component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);
    // Initialize theme and preferences from localStorage on first render only
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
      
      // Get stored preferences
      const storedPrefs = localStorage.getItem('themePreferences');
      if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs) as ThemePreferences;
        setPreferences(parsedPrefs);
        setColorScheme(parsedPrefs.colorScheme);
        
        // Apply color scheme
        root.dataset.colorScheme = parsedPrefs.colorScheme;
        
        // Apply animation settings
        if (!parsedPrefs.animations) {
          root.classList.add('no-animations');
        } else {
          root.classList.remove('no-animations');
        }
      } else {
        // Set default preferences
        localStorage.setItem('themePreferences', JSON.stringify(preferences));
        root.dataset.colorScheme = preferences.colorScheme;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, [isMounted, preferences.colorScheme]);
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
  
  // Time-based auto theme switching
  useEffect(() => {
    if (!isMounted || !preferences.autoSwitch) return;
    
    const checkTime = () => {
      const currentHour = new Date().getHours();
      let newTheme: Theme = 'light';
      
      // Check if current time is within dark mode hours
      if (preferences.startHour < preferences.endHour) {
        // Simple case - e.g., dark from 18:00 to 06:00
        if (currentHour < preferences.startHour || currentHour >= preferences.endHour) {
          newTheme = 'dark';
        }
      } else {
        // Inverted case - e.g., dark from 22:00 to 07:00
        if (currentHour >= preferences.startHour || currentHour < preferences.endHour) {
          newTheme = 'dark';
        }
      }
      
      if (theme !== newTheme) {
        setThemeState(newTheme);
      }
    };
    
    // Check time immediately and then every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, [isMounted, preferences.autoSwitch, preferences.startHour, preferences.endHour, theme]);
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
      
      // Add transition class for smooth theme change
      root.classList.add('theme-transition');
      
      // Update DOM by removing both classes first, then adding the correct one
      root.classList.remove('light', 'dark');
      root.classList.add(effective);
      
      // Remove transition class after animation completes
      window.setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 300);
      
      console.log(`Theme updated to ${newTheme} (effective: ${effective})`);
      
      setResolvedTheme(effective);
    } catch (e) {
      console.error('Error updating theme:', e);
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
  
  const updatePreferences = (prefs: Partial<ThemePreferences>) => {
    const newPrefs = { ...preferences, ...prefs };
    setPreferences(newPrefs);
    setColorScheme(newPrefs.colorScheme);
    
    // Store updated preferences
    try {
      localStorage.setItem('themePreferences', JSON.stringify(newPrefs));
      
      // Apply color scheme right away
      if (prefs.colorScheme) {
        const root = window.document.documentElement;
        root.dataset.colorScheme = prefs.colorScheme;
      }
      
      // Apply animation setting right away
      if (prefs.animations !== undefined) {
        const root = window.document.documentElement;
        if (!prefs.animations) {
          root.classList.add('no-animations');
        } else {
          root.classList.remove('no-animations');
        }
      }
    } catch (e) {
      console.error('Error storing theme preferences:', e);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      setTheme, 
      toggleTheme, 
      preferences,
      updatePreferences,
      colorScheme
    }}>
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