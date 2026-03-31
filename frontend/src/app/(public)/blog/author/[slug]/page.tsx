import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostsByAuthorSlug, getAllAuthorSlugs } from '@/lib/api';
import { SEO_CONFIG } from '@/lib/seo.config';
import { PostCard } from '@/components/blog/PostCard';
import { Pagination } from '@/components/blog/Pagination';
import { BreadcrumbJsonLd, AuthorJsonLd } from '@/components/blog/JsonLd';

export const revalidate = 900;

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostsByAuthorSlug(slug, 1, 1);

  if (!data) return { title: 'Author Not Found' };

  const { author } = data;
  const title = `${author.name} — Author`;
  const description = author.bio || `Read all articles by ${author.name} on ${SEO_CONFIG.siteName}`;
  const url = `${SEO_CONFIG.siteUrl}/blog/author/${author.slug}`;
  const image = author.avatarUrl || SEO_CONFIG.defaultOgImage;

  return {
    title: `${title} | ${SEO_CONFIG.siteName}`,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title, description, url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: 'profile',
      images: [{ url: image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`, width: 400, height: 400, alt: author.name }],
    },
    twitter: {
      card: 'summary',
      title, description,
      images: [image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`],
      site: SEO_CONFIG.twitterHandle,
      creator: `@${author.slug}`,
    },
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || '1', 10);

  const data = await getPostsByAuthorSlug(slug, page, 12);
  if (!data) notFound();

  const { author, posts, total, totalPages } = data;

  const breadcrumbs = [
    { name: 'Home', url: SEO_CONFIG.siteUrl },
    { name: 'Blog', url: `${SEO_CONFIG.siteUrl}/blog` },
    { name: author.name, url: `${SEO_CONFIG.siteUrl}/blog/author/${author.slug}` },
  ];

  return (
    <>
      <AuthorJsonLd name={author.name} slug={author.slug} bio={author.bio} avatarUrl={author.avatarUrl} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="container-blog py-16">
        {/* ── Author header ───────────────────── */}
        <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-6">
          {author.avatarUrl && (
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={96}
              height={96}
              className="rounded-full mb-4 md:mb-0"
            />
          )}
          <div>
            <nav aria-label="Breadcrumb" className="mb-2">
              <ol className="flex items-center gap-1.5 text-sm text-slate-400 justify-center md:justify-start">
                <li><a href="/" className="hover:text-slate-600 dark:hover:text-slate-300">Home</a></li>
                <li aria-hidden="true">/</li>
                <li><a href="/blog" className="hover:text-slate-600 dark:hover:text-slate-300">Blog</a></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-600 dark:text-slate-300">{author.name}</li>
              </ol>
            </nav>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {author.name}
            </h1>
            {author.bio && (
              <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
                {author.bio}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-400">
              {total} article{total !== 1 ? 's' : ''} published
            </p>
          </div>
        </div>

        {/* ── Posts grid ──────────────────────── */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath={`/blog/author/${slug}`} />
          </>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No articles published by this author yet.
          </p>
        )}
      </section>
    </>
  );
}
