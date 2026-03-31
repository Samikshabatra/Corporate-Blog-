import Link from 'next/link';
import { SEO_CONFIG } from '@/lib/seo.config';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-surface-border bg-surface-muted dark:border-dark-border dark:bg-dark-muted">
      <div className="container-blog py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-xl font-serif font-bold text-slate-900 dark:text-white">{SEO_CONFIG.siteName}</p>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{SEO_CONFIG.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Content</h3>
            <ul className="mt-4 space-y-2">
              {[{ href: '/blog', label: 'Blog' }, { href: '/category', label: 'Categories' }, { href: '/search', label: 'Search' }].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              {[{ href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }, { href: '/privacy', label: 'Privacy Policy' }].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-surface-border pt-8 dark:border-dark-border">
          <p className="text-sm text-slate-400">© {year} {SEO_CONFIG.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
