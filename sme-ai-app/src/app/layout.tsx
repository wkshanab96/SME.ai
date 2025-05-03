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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
