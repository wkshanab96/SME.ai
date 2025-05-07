import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnimationContextType {
  animationsEnabled: boolean;
  toggleAnimations: (enabled: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  animationsEnabled: true,
  toggleAnimations: () => {},
});

export const useAnimation = () => useContext(AnimationContext);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to true, but check localStorage for saved preference
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  
  // Load saved preference on mount
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem('animationsEnabled');
      if (savedPreference !== null) {
        setAnimationsEnabled(savedPreference === 'true');
      }
    } catch (error) {
      console.error('Failed to load animation preferences:', error);
    }
  }, []);
  
  // Save preference to localStorage when changed
  const toggleAnimations = (enabled: boolean) => {
    setAnimationsEnabled(enabled);
    try {
      localStorage.setItem('animationsEnabled', String(enabled));
      // Apply animation class to html element
      if (enabled) {
        document.documentElement.classList.remove('no-animations');
      } else {
        document.documentElement.classList.add('no-animations');
      }
    } catch (error) {
      console.error('Failed to save animation preferences:', error);
    }
  };
  
  // Apply animation class immediately when component mounts
  useEffect(() => {
    if (!animationsEnabled) {
      document.documentElement.classList.add('no-animations');
    } else {
      document.documentElement.classList.remove('no-animations');
    }
  }, [animationsEnabled]);

  return (
    <AnimationContext.Provider value={{ animationsEnabled, toggleAnimations }}>
      {children}
    </AnimationContext.Provider>
  );
};