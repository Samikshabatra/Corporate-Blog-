'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/components/providers/AnalyticsProvider';

export function ScrollDepthTracker({ postSlug }: { postSlug: string }) {
  const milestones = useRef(new Set<number>());

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      for (const t of thresholds) {
        if (pct >= t && !milestones.current.has(t)) {
          milestones.current.add(t);
          trackEvent('scroll_depth', 'engagement', `${t}%`, t);
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [postSlug]);

  return null;
}
