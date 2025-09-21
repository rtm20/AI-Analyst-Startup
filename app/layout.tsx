import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Startup Analyst | Google Cloud AI Platform',
  description: 'AI-powered startup evaluation platform using Google Cloud AI technologies. Analyze pitch decks, detect risks, and generate investor-ready insights.',
  keywords: 'startup analysis, AI, venture capital, Google Cloud, Gemini, investment analysis',
  authors: [{ name: 'AI Startup Analyst Team' }],
  openGraph: {
    title: 'AI Startup Analyst | Google Cloud AI Platform',
    description: 'AI-powered startup evaluation platform using Google Cloud AI technologies.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Startup Analyst | Google Cloud AI Platform',
    description: 'AI-powered startup evaluation platform using Google Cloud AI technologies.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="font-sans bg-gray-50 antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
