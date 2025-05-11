import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '../lib/providers'

export const metadata: Metadata = {
  title: 'SME.AI - Subject Matter Expert AI Assistant',
  description: 'AI-powered assistance for industrial professionals in various engineering fields',
  keywords: 'AI assistant, engineering, SME, industrial, electrical engineering, mechanical engineering, process engineering',
  authors: [{ name: 'SME.AI Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Add inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get initial theme from localStorage or default to light
                  const theme = localStorage.getItem('theme') || 'light';
                  
                  // Determine the effective theme
                  const isDark = 
                    theme === 'dark' || 
                    (theme === 'system' && 
                     window.matchMedia('(prefers-color-scheme: dark)').matches);
                  
                  // Apply appropriate class to html element
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(isDark ? 'dark' : 'light');
                } catch (e) {
                  console.error('Error in theme init script:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
