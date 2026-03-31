'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Page view track karne ka function
// Kyu: Next.js mein page change pe GA ko manually batana padta hai
export function trackPageView(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  if (!(window as any).gtag) return;
  (window as any).gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}

// Custom event track karne ka function
// Kyu: Publish, search jaise events track kar sakte hain
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  if (!(window as any).gtag) return;
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// Route change pe page view track karo
function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!GA_MEASUREMENT_ID) {
    return <>{children}</>;
  }

  return (
    <>
      {/* GA4 Script — defer loading, page speed affect nahi hogi */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
      <AnalyticsPageTracker />
      {children}
    </>
  );
}