import { SEO_CONFIG } from '@/lib/seo.config';
import Link from 'next/link';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted dark:bg-dark">
      <header className="flex h-16 items-center border-b border-surface-border bg-surface px-8 dark:border-dark-border dark:bg-dark-muted">
        <Link href="/" className="font-serif text-lg font-bold text-slate-900 dark:text-white">{SEO_CONFIG.siteName}</Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16">{children}</main>
      <footer className="py-6 text-center text-sm text-slate-400">© {new Date().getFullYear()} {SEO_CONFIG.siteName}</footer>
    </div>
  );
}
