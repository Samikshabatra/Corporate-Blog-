import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thecorporateblog.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Post {
  slug: string;
  updatedAt: string;
  publishedAt: string;
}

interface Category {
  slug: string;
  updatedAt: string;
}

interface Author {
  slug: string;
  updatedAt: string;
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/posts/published?limit=1000`, {
      next: { revalidate: 900 }, // 15 min ISR
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || data.data || [];
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/categories`, {
      next: { revalidate: 3600 }, // 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || data.data || [];
  } catch {
    return [];
  }
}

async function fetchAuthors(): Promise<Author[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/authors`, {
      next: { revalidate: 3600 }, // 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.authors || data.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
    fetchAuthors(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Blog post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/blog/category/${cat.slug}`,
    lastModified: new Date(cat.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Author pages
  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${BASE_URL}/blog/author/${author.slug}`,
    lastModified: new Date(author.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...postPages,
    ...categoryPages,
    ...authorPages,
  ];
}