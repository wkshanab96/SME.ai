'use client';

import { AuthProvider } from './auth-context';
import { ThemeProvider } from './theme-context';
import { AnimationProvider } from './animation-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}