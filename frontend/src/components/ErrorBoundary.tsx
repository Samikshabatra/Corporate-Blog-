'use client';

import React from 'react';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

let SentryModule: typeof import('@sentry/react') | null = null;

if (SENTRY_DSN && typeof window !== 'undefined') {
  import('@sentry/react').then((mod) => {
    mod.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    });
    SentryModule = mod;
  }).catch(() => {});
}

interface ErrorBoundaryProps { children: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Frontend Error:', error);
    if (SentryModule) {
      SentryModule.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">An unexpected error occurred. Please try refreshing the page.</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }} className="btn-primary text-sm">Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}
