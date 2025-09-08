import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EmotiBuild - Build Resilience, One Emotion at a Time',
  description: 'A Base MiniApp that helps users track their emotions and build resilience through guided journaling and coping mechanisms.',
  keywords: ['emotional wellness', 'resilience', 'mood tracking', 'mental health', 'Base', 'MiniApp'],
  authors: [{ name: 'EmotiBuild Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
