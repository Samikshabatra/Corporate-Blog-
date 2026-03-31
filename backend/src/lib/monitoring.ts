import { Request, Response, NextFunction } from 'express';
import { initSentry, captureException as sentryCapture, captureMessage as sentryMessage } from './sentry';

let sentryInitialized = false;

export async function initErrorMonitoring(): Promise<void> {
  sentryInitialized = await initSentry();
}

export function captureError(error: Error, extra?: Record<string, unknown>): void {
  if (sentryInitialized) {
    sentryCapture(error, extra);
  }
  console.error('[Error]', error.message, extra || '');
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
): void {
  if (sentryInitialized) {
    sentryMessage(message, level);
  }
  console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](
    `[Monitor] ${message}`,
  );
}

interface ErrorReport extends Record<string, unknown> {
  message: string;
  stack?: string;
  path: string;
  method: string;
  statusCode: number;
  userId?: string;
  timestamp: string;
}

export const errorMonitoringMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const report: ErrorReport = {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode: res.statusCode || 500,
    userId: req.user?.sub,
    timestamp: new Date().toISOString(),
  };

  captureError(err, report);
  next(err);
};
