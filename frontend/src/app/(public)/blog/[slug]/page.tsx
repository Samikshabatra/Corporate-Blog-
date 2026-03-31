import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getAllPublishedSlugs, getRelatedPosts } from '@/lib/api';
import { SEO_CONFIG } from '@/lib/seo.config';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/blog/JsonLd';
import {
  DocumentRenderer,
  TableOfContents,
  generateTableOfContents,
} from '@/components/blog/ContentRenderer';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { ScrollDepthTracker } from '@/components/blog/ScrollDepthTracker';
import { SponsoredBanner } from '@/components/blog/SponsoredBanner';
import { BlockDocument, FAQBlock } from '@/types/block.types';

export const revalidate = 900;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Post Not Found' };

  const title = post.metaTitle || post.title;
  const description = post.metaDesc || post.excerpt || '';
  const url = `${SEO_CONFIG.siteUrl}/blog/${post.slug}`;
  const image = post.ogImage || SEO_CONFIG.defaultOgImage;
  const fullImage = image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`;

  return {
    title: `${title} | ${SEO_CONFIG.siteName}`,
    description,
    authors: [{ name: post.author.name }],
    keywords: post.categories.map((c) => c.name),
    alternates: { canonical: post.canonicalUrl || url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
    openGraph: {
      title: post.ogTitle || title, description: post.ogDesc || description, url,
      siteName: SEO_CONFIG.siteName, locale: SEO_CONFIG.locale, type: 'article',
      publishedTime: post.publishedAt || undefined, modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: fullImage, width: 1200, height: 630, alt: post.ogTitle || title }],
    },
    twitter: {
      card: 'summary_large_image', title: post.twitterTitle || title,
      description: post.twitterDesc || description,
      images: [post.twitterImage || fullImage],
      site: SEO_CONFIG.twitterHandle, creator: `@${post.author.slug}`,
    },
  };
}

function extractFAQItems(document: BlockDocument | null): FAQBlock['items'] {
  if (!document) return [];
  const faqBlocks = document.blocks.filter(
    (b): b is FAQBlock => b.type === 'faq'
  );
  return faqBlocks.flatMap((block) => block.items).filter(
    (item) => item.question.trim() && item.answer.trim()
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Parse content
  let document: BlockDocument | null = null;
  try { document = JSON.parse(post.content) as BlockDocument; } catch { document = null; }

  const tocItems = document ? generateTableOfContents(document) : [];
  const faqItems = extractFAQItems(document);
  const relatedPosts = await getRelatedPosts(post.id, 4);

  const breadcrumbs = [
    { name: 'Home', url: SEO_CONFIG.siteUrl },
    { name: 'Blog', url: `${SEO_CONFIG.siteUrl}/blog` },
    ...(post.categories.length > 0
      ? [{ name: post.categories[0].name, url: `${SEO_CONFIG.siteUrl}/blog/category/${post.categories[0].slug}` }]
      : []),
    { name: post.title, url: `${SEO_CONFIG.siteUrl}/blog/${post.slug}` },
  ];

  return (
    <>
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      {faqItems.length > 0 && <FAQJsonLd faqs={faqItems} />}

      {/* View + scroll tracking (client components) */}
      <ViewTracker postId={post.id} />
      <ScrollDepthTracker postSlug={post.slug} />

      <article className="container-content py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-slate-600 dark:hover:text-slate-300">Blog</Link></li>
            {post.categories.length > 0 && (
              <>
                <li aria-hidden="true">/</li>
                <li><Link href={`/blog/category/${post.categories[0].slug}`} className="hover:text-slate-600 dark:hover:text-slate-300">{post.categories[0].name}</Link></li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {/* Sponsored disclosure */}
        <SponsoredBanner isSponsored={(post as any).isSponsored} />

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <Link key={cat.id} href={`/blog/category/${cat.slug}`} className="badge bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300">
                {cat.name}
              </Link>
            ))}
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight text-slate-900 dark:text-white text-balance md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-xl text-slate-500 dark:text-slate-400 leading-relaxed">{post.excerpt}</p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <Link href={`/blog/author/${post.author.slug}`} className="flex items-center gap-3 group">
              {post.author.avatarUrl && (
                <Image src={post.author.avatarUrl} alt={post.author.name} width={44} height={44} className="rounded-full" loading="lazy" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">{post.author.name}</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
                  {post.readingTimeMin && (<><span aria-hidden="true">·</span><span>{formatReadingTime(post.readingTimeMin)}</span></>)}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Featured image — LCP */}
        {post.ogImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl">
            <Image src={post.ogImage} alt={post.ogTitle || post.title} fill sizes="(max-width: 680px) 100vw, 680px" className="object-cover" priority fetchPriority="high" />
          </div>
        )}

        {/* Table of Contents */}
        <TableOfContents items={tocItems} />

        {/* Content */}
        {document ? (
          <DocumentRenderer document={document} />
        ) : (
          <div className="prose-blog"><p>{post.content}</p></div>
        )}

        {/* Author footer */}
        <footer className="mt-16 border-t border-surface-border pt-8 dark:border-dark-border">
          <Link href={`/blog/author/${post.author.slug}`} className="flex items-center gap-4 group">
            {post.author.avatarUrl && (
              <Image src={post.author.avatarUrl} alt={post.author.name} width={56} height={56} className="rounded-full" loading="lazy" />
            )}
            <div>
              <p className="text-sm text-slate-400 dark:text-slate-500">Written by</p>
              <p className="font-medium text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">{post.author.name}</p>
            </div>
          </Link>
        </footer>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  );
}
