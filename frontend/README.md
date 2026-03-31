# TCB Frontend — The Corporate Blog

## Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** + @tailwindcss/typography + @tailwindcss/forms
- **next-themes** — dark mode
- **js-cookie** — token storage
- **react-hot-toast** — notifications
- **lucide-react** — icons
- **@next/bundle-analyzer** — bundle analysis

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Project Structure
```
src/
├── app/
│   ├── (auth)/           — Login, Register, OAuth callback
│   ├── (dashboard)/      — Protected dashboard + editor
│   ├── (public)/
│   │   ├── blog/         — Blog home, post, category, author pages
│   │   └── search/       — Search results page
│   ├── api/revalidate/   — On-demand ISR revalidation
│   └── sitemap.ts        — Dynamic sitemap
├── components/
│   ├── auth/             — LoginForm, RegisterForm
│   ├── blog/             — ContentRenderer, PostCard, RelatedArticles,
│   │                       TrendingPosts, SearchInput, Pagination,
│   │                       JsonLd, FAQJsonLd
│   ├── dashboard/        — Shell, Overview, PostsList
│   ├── editor/           — Full block editor
│   │   ├── blocks/       — 10 block types (incl. FAQ)
│   │   └── fields/       — Title, Slug, Categories
│   ├── layout/           — Navbar, Footer
│   ├── providers/        — Theme + Auth + Analytics providers
│   └── ui/               — RoleGuard components
├── context/              — AuthContext (JWT, cookies, roles)
├── hooks/                — useEditor, useEditorWithLogging, usePostAccess
├── lib/                  — utils, seo.config, permissions, slugUtils,
│                           blockValidation, draftLogger, sanitizer
├── middleware.ts          — Next.js Edge route protection
├── store/                — editorReducer
└── types/                — block.types, editor.types, post.types
```

## Key Features

- Role-based auth: ADMIN > EDITOR > WRITER
- Block editor with 10 block types (incl. FAQ with schema)
- Auto-save with 3s debounce
- Live slug preview + uniqueness check
- SEO panel with 5-point score
- Word count + reading time live
- Related articles — internal linking
- Trending posts widget
- Google Analytics 4 — deferred, no render blocking
- Dynamic sitemap
- FAQ JSON-LD — Google rich results
- Draft operation logging
- Dark mode
- Route protection via Next.js middleware

## Scripts
```bash
npm run dev        # Development
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run format     # Prettier
npm run analyze    # Bundle analyzer
npm run lighthouse # Lighthouse CI
```