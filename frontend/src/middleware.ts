import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/cms'];
const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard/users': ['ADMIN'],
  '/dashboard/settings': ['ADMIN'],
  '/dashboard/posts/publish': ['EDITOR', 'ADMIN'],
};
const AUTH_ROUTES = ['/auth/login', '/auth/register'];

// Routes that should NEVER be statically generated or cached
const NO_CACHE_PREFIXES = ['/dashboard', '/cms', '/api', '/auth'];

function decodeJwtEdge(token: string): { sub: string; email: string; role: string; exp: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload;
  } catch { return null; }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('accessToken')?.value;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isNoCacheRoute = NO_CACHE_PREFIXES.some((p) => pathname.startsWith(p));

  // ── Ensure admin routes are never cached ────
  const response = NextResponse.next();

  if (isNoCacheRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // ── Search pages: noindex ───────────────────
  if (pathname.startsWith('/search')) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  // ── Protected route redirect ────────────────
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // ── Redirect authenticated users from auth pages ──
  if (isAuthRoute && token) {
    const payload = decodeJwtEdge(token);
    if (payload && payload.exp * 1000 > Date.now()) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // ── Role-based access control ───────────────
  if (token) {
    const payload = decodeJwtEdge(token);
    if (payload) {
      const requiredRoles = Object.entries(ROLE_ROUTES).find(([route]) => pathname.startsWith(route))?.[1];
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }
  }

  // ── Security: strip sensitive query params from public pages ──
  if (!isProtected && !isAuthRoute) {
    const sensitiveParams = ['token', 'accessToken', 'refreshToken', 'secret'];
    const url = req.nextUrl.clone();
    let modified = false;
    for (const param of sensitiveParams) {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        modified = true;
      }
    }
    if (modified) {
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cms/:path*',
    '/auth/:path*',
    '/search',
    '/search/:path*',
    // Note: /blog and other public routes are NOT matched —
    // they remain fully static/ISR, never run through middleware
  ],
};
