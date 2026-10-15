import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { PwaRegister } from '@/components/pwa-register';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LocalBiz AI — Chat with your business documents',
    template: '%s · LocalBiz AI',
  },
  description:
    'Multi-tenant AI Q&A platform for small businesses. Upload PDFs, chat with cited answers, and share Q&A links with customers.',
  keywords: [
    'AI document chat',
    'RAG',
    'PDF Q&A',
    'small business AI',
    'customer support AI',
    'LocalBiz AI',
  ],
  authors: [{ name: 'LocalBiz AI' }],
  creator: 'LocalBiz AI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LocalBiz AI',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'LocalBiz AI',
    title: 'LocalBiz AI — Chat with your business documents',
    description:
      'Multi-tenant AI Q&A platform for small businesses. Upload PDFs, chat with cited answers, share Q&A links.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'LocalBiz AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocalBiz AI — Chat with your business documents',
    description: 'Multi-tenant AI Q&A platform for small businesses.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <PwaRegister />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
