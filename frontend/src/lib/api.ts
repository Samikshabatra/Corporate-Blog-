import { Post } from '@/types/post.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SearchResults extends PaginatedPosts {
  query: string;
  durationMs: number;
}

export interface CategoryWithPosts extends PaginatedPosts {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    metaTitle: string | null;
    metaDesc: string | null;
    ogImage: string | null;
  };
}

export interface AuthorWithPosts extends PaginatedPosts {
  author: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    bio: string | null;
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    if (res.status === 404) return null as T;
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data as T;
}

// ── Published posts (public) ─────────────────

export async function getPublishedPosts(page: number = 1, limit: number = 12) {
  try {
    const res = await fetch(
      `/api/v1/posts/published?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return { posts: [], page: 1, totalPages: 1 };
    }

    const json = await res.json();

    return {
      posts: json?.data?.posts || [],
      page: json?.data?.page || 1,
      totalPages: json?.data?.totalPages || 1,
    };
  } catch (error) {
    console.error("API ERROR:", error);

    return {
      posts: [],
      page: 1,
      totalPages: 1,
    };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return apiFetch<Post | null>(`/api/v1/posts/slug/${slug}`);
}

export async function getPostsByCategorySlug(slug: string, page = 1, limit = 20): Promise<CategoryWithPosts | null> {
  return apiFetch<CategoryWithPosts | null>(`/api/v1/categories/${slug}/posts?page=${page}&limit=${limit}`);
}

export async function getPostsByAuthorSlug(slug: string, page = 1, limit = 20): Promise<AuthorWithPosts | null> {
  return apiFetch<AuthorWithPosts | null>(`/api/v1/authors/${slug}/posts?page=${page}&limit=${limit}`);
}

// ── Search ───────────────────────────────────

export async function searchPosts(query: string, page = 1, limit = 20): Promise<SearchResults | null> {
  if (!query || query.trim().length < 2) return null;
  const encoded = encodeURIComponent(query.trim());
  return apiFetch<SearchResults>(`/api/v1/search?q=${encoded}&page=${page}&limit=${limit}`);
}

// ── Related posts ────────────────────────────

export async function getRelatedPosts(postId: string, limit = 4): Promise<Post[]> {
  const result = await apiFetch<Post[]>(`/api/v1/posts/${postId}/related?limit=${limit}`);
  return result || [];
}

// ── Popular posts ────────────────────────────

export async function getPopularPosts(limit = 10): Promise<Post[]> {
  const result = await apiFetch<Post[]>(`/api/v1/posts/popular?limit=${limit}`);
  return result || [];
}

// ── For generateStaticParams ─────────────────

export async function getAllPublishedSlugs(): Promise<string[]> {
  const data = await apiFetch<PaginatedPosts>('/api/v1/posts/published?page=1&limit=1000');
  if (!data) return [];
  return data.posts.map((p) => p.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const res = await fetch(`${API_URL}/sitemap.xml`, { next: { revalidate: 900 } });
  if (!res.ok) return [];
  const xml = await res.text();
  const matches = xml.match(/\/blog\/category\/([^<]+)/g) || [];
  return matches.map((m) => m.replace(/.*\/blog\/category\//, ''));
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const res = await fetch(`${API_URL}/sitemap.xml`, { next: { revalidate: 900 } });
  if (!res.ok) return [];
  const xml = await res.text();
  const matches = xml.match(/\/blog\/author\/([^<]+)/g) || [];
  return matches.map((m) => m.replace(/.*\/blog\/author\//, ''));
}
