import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ToasterConfig } from '@/lib/toast';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EmotiBuild - Build resilience, one emotion at a time',
  description: 'A Base MiniApp that helps users track their emotions and build resilience through guided journaling and coping mechanisms.',
  keywords: ['emotion tracking', 'mental health', 'resilience', 'journaling', 'coping mechanisms', 'Base', 'MiniApp', 'Farcaster', 'Web3'],
  authors: [{ name: 'EmotiBuild Team' }],
  creator: 'EmotiBuild',
  publisher: 'EmotiBuild',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://emotibuild.app'),
  openGraph: {
    title: 'EmotiBuild - Build resilience, one emotion at a time',
    description: 'Track your emotions and build resilience through guided journaling and coping mechanisms.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://emotibuild.app',
    siteName: 'EmotiBuild',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EmotiBuild - Build resilience, one emotion at a time',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmotiBuild - Build resilience, one emotion at a time',
    description: 'Track your emotions and build resilience through guided journaling and coping mechanisms.',
    creator: '@emotibuild',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="https://api.supabase.co" />
        <link rel="dns-prefetch" href="https://auth.privy.io" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`${inter.className} h-full font-sans antialiased`}>
        <Providers>
          <div id="root" className="min-h-full">
            {children}
          </div>
          <ToasterConfig />
        </Providers>
      </body>
    </html>
  );
}
