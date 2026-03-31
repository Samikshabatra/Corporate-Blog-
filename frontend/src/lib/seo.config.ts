export const SEO_CONFIG = {
  siteName: 'The Corporate Blog',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thecorporateblog.com',
  description: 'Insights, strategies, and stories from the world of business and technology.',
  twitterHandle: '@TheCorporateBlog',
  locale: 'en_US',
  type: 'website',
  defaultOgImage: '/images/og-default.jpg',
  logoUrl: '/images/logo.png',
} as const;

export interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  keywords?: string[];
}

export function buildMetadata(props: PageSEOProps) {
  const { title, description, path, ogImage, ogType = 'website', noIndex = false, publishedAt, modifiedAt, authorName, keywords } = props;
  const url = `${SEO_CONFIG.siteUrl}${path}`;
  const image = ogImage || SEO_CONFIG.defaultOgImage;
  const fullImage = image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`;
  const fullTitle = `${title} | ${SEO_CONFIG.siteName}`;
  return {
    title: fullTitle,
    description,
    keywords,
    authors: authorName ? [{ name: authorName }] : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
    openGraph: {
      title: fullTitle, description, url,
      siteName: SEO_CONFIG.siteName, locale: SEO_CONFIG.locale, type: ogType,
      images: [{ url: fullImage, width: 1200, height: 630, alt: title }],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(modifiedAt && { modifiedTime: modifiedAt }),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: fullTitle, description, images: [fullImage],
      site: SEO_CONFIG.twitterHandle, creator: SEO_CONFIG.twitterHandle,
    },
  };
}
