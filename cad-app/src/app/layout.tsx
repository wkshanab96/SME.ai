import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Engineering CAD - Professional Drawing Application',
  description: 'Professional engineering CAD application for technical drawings, P&ID diagrams, electrical schematics, and mechanical designs.',
  keywords: 'CAD, engineering, P&ID, electrical, mechanical, technical drawings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
