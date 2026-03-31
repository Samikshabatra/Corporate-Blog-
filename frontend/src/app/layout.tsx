import type { Metadata, Viewport } from 'next';
import { inter, merriweather, jetbrainsMono } from '@/lib/fonts';
import { SEO_CONFIG } from '@/lib/seo.config';
import { Providers } from '@/components/providers/Providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: { default: SEO_CONFIG.siteName, template: `%s | ${SEO_CONFIG.siteName}` },
  description: SEO_CONFIG.description,
  applicationName: SEO_CONFIG.siteName,
  keywords: ['business', 'technology', 'blog', 'corporate'],
  authors: [{ name: SEO_CONFIG.siteName }],
  creator: SEO_CONFIG.siteName,
  publisher: SEO_CONFIG.siteName,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: { type: 'website', locale: SEO_CONFIG.locale, url: SEO_CONFIG.siteUrl, siteName: SEO_CONFIG.siteName, title: SEO_CONFIG.siteName, description: SEO_CONFIG.description, images: [{ url: SEO_CONFIG.defaultOgImage, width: 1200, height: 630, alt: SEO_CONFIG.siteName }] },
  twitter: { card: 'summary_large_image', site: SEO_CONFIG.twitterHandle, creator: SEO_CONFIG.twitterHandle },
  icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#0f172a' }],
  width: 'device-width', initialScale: 1, maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-surface font-sans text-slate-900 antialiased dark:bg-dark dark:text-slate-100">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
