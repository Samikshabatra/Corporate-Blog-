import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategorySlug, getAllCategorySlugs } from '@/lib/api';
import { SEO_CONFIG } from '@/lib/seo.config';
import { PostCard } from '@/components/blog/PostCard';
import { Pagination } from '@/components/blog/Pagination';
import { BreadcrumbJsonLd } from '@/components/blog/JsonLd';

export const revalidate = 900;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostsByCategorySlug(slug, 1, 1);

  if (!data) return { title: 'Category Not Found' };

  const cat = data.category;
  const title = cat.metaTitle || `${cat.name} Articles`;
  const description = cat.metaDesc || cat.description || `Browse all ${cat.name} articles on ${SEO_CONFIG.siteName}`;
  const url = `${SEO_CONFIG.siteUrl}/blog/category/${cat.slug}`;
  const image = cat.ogImage || SEO_CONFIG.defaultOgImage;

  return {
    title: `${title} | ${SEO_CONFIG.siteName}`,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title, description, url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: 'website',
      images: [{ url: image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: [image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`],
      site: SEO_CONFIG.twitterHandle,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || '1', 10);

  const data = await getPostsByCategorySlug(slug, page, 12);
  if (!data) notFound();

  const { category, posts, totalPages } = data;

  const breadcrumbs = [
    { name: 'Home', url: SEO_CONFIG.siteUrl },
    { name: 'Blog', url: `${SEO_CONFIG.siteUrl}/blog` },
    { name: category.name, url: `${SEO_CONFIG.siteUrl}/blog/category/${category.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <section className="container-blog py-16">
        <div className="mb-12">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-sm text-slate-400">
              <li><a href="/" className="hover:text-slate-600 dark:hover:text-slate-300">Home</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="/blog" className="hover:text-slate-600 dark:hover:text-slate-300">Blog</a></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-600 dark:text-slate-300">{category.name}</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              {category.description}
            </p>
          )}
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath={`/blog/category/${slug}`} />
          </>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No articles in this category yet.
          </p>
        )}
      </section>
    </>
  );
}
