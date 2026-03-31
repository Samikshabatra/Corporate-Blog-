import { SEO_CONFIG } from '@/lib/seo.config';
import { Post } from '@/types/post.types';
import { FAQBlock } from '@/types/block.types';

const SITE_URL = SEO_CONFIG.siteUrl;
const SITE_NAME = SEO_CONFIG.siteName;
const LOGO_URL = `${SITE_URL}/images/logo.png`;

export function ArticleJsonLd({ post }: { post: Post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': post.schemaType || 'Article',
    headline: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || '',
    image: [post.ogImage || `${SITE_URL}/images/og-default.jpg`],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE_URL}/blog/author/${post.author.slug}`,
      ...(post.author.avatarUrl && { image: post.author.avatarUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    ...(post.categories.length > 0 && {
      articleSection: post.categories[0].name,
      keywords: post.categories.map((c) => c.name),
    }),
    ...(post.readingTimeMin && { wordCount: post.readingTimeMin * 225 }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem { name: string; url: string; }

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function AuthorJsonLd({ name, slug, bio, avatarUrl }: { name: string; slug: string; bio?: string | null; avatarUrl?: string | null }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: `${SITE_URL}/blog/author/${slug}`,
    ...(bio && { description: bio }),
    ...(avatarUrl && { image: avatarUrl }),
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ JSON-LD — Google rich results ke liye FAQPage schema
// Kyu: FAQ block se Google search mein expandable Q&A dikhta hai
// Kya hoga: Google search pe post ke neeche FAQ answers directly dikhenge
export function FAQJsonLd({ faqs }: { faqs: FAQBlock['items'] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}