# The Corporate Blog (TCB)

A production-grade, SEO-first, full-stack blogging platform built for scale. Features a block-based CMS editor, role-based access control, full-text search, scheduled publishing, monetization infrastructure, and comprehensive SEO tooling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (NeonDB), Prisma ORM |
| Auth | JWT + Refresh Token Rotation, Google OAuth 2.0 |
| Images | Cloudinary (auto WebP/AVIF) |
| Hosting | Vercel (frontend), Render (backend) |
| Search | PostgreSQL Full-Text Search (tsvector + GIN) |
| Monitoring | Sentry, Google Analytics 4, Structured Logging |

---

## Features

### Content Management
- Block-based editor with 11 block types: Paragraph, Heading (H1–H6), Image, Quote, Code (syntax highlighted), Callout, List, Divider, Embed (YouTube), Table, FAQ
- Auto-save with 3-second debounce
- Live word count and reading time
- Draft operation logging
- Scheduled publishing with date/time picker
- Pre-publish validation (OG image, meta description, alt text, content length)

### SEO
- Dynamic meta tags (title, description, canonical, OG, Twitter Cards) on every page
- JSON-LD structured data: Article, Breadcrumb, WebSite, Person, FAQPage
- Dynamic XML sitemap and robots.txt
- SEO panel in editor with 5-point checklist and character counters
- Clean slug-based URLs with uniqueness validation
- Lighthouse CI integration (desktop + mobile)

### Authentication & Authorization
- JWT access tokens (15-min expiry) + opaque refresh token rotation
- Google OAuth 2.0 via Passport.js
- Role hierarchy: ADMIN > EDITOR > WRITER
- Route protection via Next.js Edge Middleware
- httpOnly cookies for refresh tokens

### Search
- PostgreSQL full-text search with weighted ranking (title > excerpt > meta)
- Trigram similarity indexes for fuzzy matching
- ILIKE fallback if tsvector fails
- Search query analytics and logging

### Monetization
- Ad slot components (banner + inline)
- Affiliate link redirect tracking with click analytics
- Sponsored post flag with disclosure banner
- Premium content toggle (feature-ready)

### Performance
- ISR (Incremental Static Regeneration) with 15-min revalidation
- On-demand ISR revalidation on publish/unpublish
- In-memory cache with Redis-ready abstraction layer
- Cloudinary auto WebP/AVIF with lazy loading
- Response time metrics with P95 tracking
- Load tested for 2000+ concurrent users

---

## Project Structure

```
corporate-blog/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── affiliate/          # Affiliate link tracking
│   │   ├── auth/               # JWT, OAuth, middleware
│   │   ├── authors/            # Author routes
│   │   ├── categories/         # Category CRUD
│   │   ├── dashboard/          # Dashboard stats API
│   │   ├── images/             # Cloudinary upload service
│   │   ├── lib/                # Prisma, cache, Sentry, ISR
│   │   ├── logs/               # Draft operation logging
│   │   ├── middleware/         # Error handler, rate limit, auth
│   │   ├── posts/              # Post CRUD, publish, views
│   │   ├── search/             # Full-text search engine
│   │   ├── seo/                # Sitemap, robots, meta builders
│   │   ├── users/              # User management (admin)
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── scripts/                # DB monitor, load test, admin tools
│   └── package.json
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, Register, OAuth callback
│   │   │   ├── (dashboard)/    # CMS dashboard, editor, media
│   │   │   ├── (public)/       # Blog, search, category, author pages
│   │   │   └── api/            # ISR revalidation endpoint
│   │   ├── components/
│   │   │   ├── blog/           # PostCard, ContentRenderer, JsonLd
│   │   │   ├── dashboard/      # Shell, Overview, PostsList
│   │   │   ├── editor/         # Block editor, SEO panel, publish
│   │   │   └── layout/         # Navbar, Footer
│   │   ├── context/            # AuthContext (JWT + cookies)
│   │   ├── hooks/              # useEditor, usePostAccess
│   │   ├── lib/                # API client, permissions, sanitizer
│   │   ├── store/              # Editor reducer
│   │   └── types/              # TypeScript definitions
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL database (or [NeonDB](https://neon.tech) free tier)
- Cloudinary account (optional, dev fallback available)
- Google OAuth credentials (optional)

### Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT secrets, etc.

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Start development server
npx tsx watch src/index.ts
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install

# Environment is pre-configured for localhost in .env.local
npm run dev
# App runs on http://localhost:3000
```

### First-Time Setup

1. Register an account at `http://localhost:3000/auth/register`
2. Upgrade yourself to ADMIN:
   ```bash
   cd backend
   npx tsx scripts/make-admin.ts your@email.com
   ```
3. Log out and log back in
4. Access the full dashboard at `http://localhost:3000/dashboard`

---

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
SITE_URL=https://thecorporateblog.com
SITE_NAME=The Corporate Blog

# PostgreSQL (NeonDB)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# JWT
JWT_SECRET=your-64-char-secret
JWT_REFRESH_SECRET=your-64-char-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Cloudinary (optional — dev fallback available)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Sentry (optional)
SENTRY_DSN=

# ISR Revalidation
REVALIDATION_SECRET=your-secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Register new user |
| POST | `/api/v1/auth/login` | — | Login with email/password |
| POST | `/api/v1/auth/refresh` | Cookie | Rotate refresh token |
| POST | `/api/v1/auth/logout` | Cookie | Revoke refresh token |
| GET | `/api/v1/auth/google` | — | Google OAuth redirect |

### Posts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/posts/published` | — | List published posts (public) |
| GET | `/api/v1/posts/slug/:slug` | — | Get post by slug (public) |
| GET | `/api/v1/posts/popular` | — | Popular posts by view count |
| GET | `/api/v1/posts/check-slug` | — | Check slug uniqueness |
| GET | `/api/v1/posts` | WRITER+ | List all posts (admin) |
| POST | `/api/v1/posts` | WRITER+ | Create new post |
| PUT | `/api/v1/posts/:id` | WRITER+ | Update post |
| DELETE | `/api/v1/posts/:id` | ADMIN | Delete post |
| PUT | `/api/v1/posts/:id/publish` | EDITOR+ | Publish or schedule post |
| PUT | `/api/v1/posts/:id/unpublish` | EDITOR+ | Unpublish post |
| POST | `/api/v1/posts/:id/view` | — | Track page view |
| GET | `/api/v1/posts/:id/related` | — | Related posts |

### Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/categories` | — | List all categories |
| POST | `/api/v1/categories` | EDITOR+ | Create category |
| DELETE | `/api/v1/categories/:id` | ADMIN | Delete category |

### Search
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/search?q=` | — | Full-text search |
| GET | `/api/v1/search/analytics` | ADMIN | Search query analytics |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users` | ADMIN | List all users |
| PUT | `/api/v1/users/:id/role` | ADMIN | Change user role |
| PUT | `/api/v1/users/:id/status` | ADMIN | Activate/deactivate user |

### Images
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/images/upload` | WRITER+ | Upload image |
| GET | `/api/v1/images/post/:postId` | WRITER+ | Get post images |
| DELETE | `/api/v1/images/:id` | WRITER+ | Delete image |

### Other
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check with DB status |
| GET | `/uptime` | Server uptime |
| GET | `/sitemap.xml` | Dynamic XML sitemap |
| GET | `/robots.txt` | Robots directives |
| GET | `/r/:slug` | Affiliate redirect |

---

## Database Schema

```
users ──────────── posts ──────────── post_categories ──── categories
  │                  │
  │                  ├── images
  │                  ├── post_views
  │                  └── publish_audit_logs
  │
  └── refresh_tokens

affiliate_links ──── affiliate_clicks
search_query_logs
```

**Key tables:** users, posts, categories, post_categories, images, post_views, publish_audit_logs, refresh_tokens, affiliate_links, affiliate_clicks, search_query_logs

---

## Deployment

### Backend (Render)

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && node node_modules/.bin/prisma generate && npx tsc`
   - **Start Command:** `npm run start`
4. Add all environment variables from `.env`

### Frontend (Vercel)

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variables from `.env.production`
4. Deploy — Vercel auto-detects Next.js

---

## Scripts

### Backend
```bash
npm run dev              # Development server (tsx watch)
npm run build            # TypeScript compilation
npm run start            # Production server
npm run lint             # ESLint
npm run format           # Prettier
npm run load-test        # Load test (100 concurrent, 500 total)
npm run load-test:heavy  # Heavy load test (500 concurrent, 2000 total)
npm run db:monitor       # Database connection monitor
npm run scheduler        # Run scheduled post publisher
```

### Frontend
```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run format           # Prettier
npm run analyze          # Bundle analyzer
npm run lighthouse       # Lighthouse CI
```

---

## Security

- Helmet security headers (HSTS, CSP, X-Frame-Options, CORP, COOP)
- Rate limiting (100 req/15min API, 20 req/15min auth)
- Zod request validation on all inputs
- bcrypt password hashing (12 rounds)
- httpOnly cookies for refresh tokens
- CORS restricted to frontend origin
- SQL injection prevention via Prisma parameterized queries
- XSS prevention via React JSX escaping + content sanitizer
- Admin/API/draft routes blocked from search engine indexing
- Source maps disabled in production

---

## Architecture Highlights

- **ISR-first:** 99% of public traffic served from CDN edge cache
- **Stateless API:** Horizontal scaling ready, no server-side sessions
- **Redis-ready:** Cache abstraction layer with in-memory fallback
- **No N+1 queries:** All Prisma queries use explicit select with includes
- **Atomic publishing:** Post status changes wrapped in database transactions with audit logging
- **Defense-in-depth security:** Sanitization at input, storage, and render layers

---

## License

MIT

---

## Author

Built by [Samiksha Batra](https://github.com/Samikshabatra)
