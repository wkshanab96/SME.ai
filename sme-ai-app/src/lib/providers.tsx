'use client';

import { AuthProvider } from './auth-context';
import { ThemeProvider } from './theme-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}