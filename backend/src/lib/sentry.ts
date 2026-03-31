// ─────────────────────────────────────────────
// Sentry — Single initialization point
// ─────────────────────────────────────────────

let sentryInstance: typeof import('@sentry/node') | null = null;
let initialized = false;

export async function initSentry(): Promise<boolean> {
  if (initialized) return !!sentryInstance;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.log('[Sentry] DSN not set — using console logging');
    initialized = true;
    return false;
  }

  try {
    const Sentry = await import('@sentry/node');
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      integrations: [],
    });
    sentryInstance = Sentry;
    initialized = true;
    console.log('[Sentry] ✅ Initialized');
    return true;
  } catch {
    console.warn('[Sentry] @sentry/node not installed — using console logging');
    initialized = true;
    return false;
  }
}

export function captureException(error: Error, extra?: Record<string, unknown>): void {
  if (sentryInstance) {
    sentryInstance.captureException(error, { extra });
  }
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): void {
  if (sentryInstance) {
    sentryInstance.captureMessage(message, level);
  }
}

export function getSentryInstance() {
  return sentryInstance;
}
