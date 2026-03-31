import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { captureException } from '../lib/sentry';

interface RequestWithMeta extends Request {
  requestId?: string;
}

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: RequestWithMeta,
  res: Response,
  _next: NextFunction,
): void => {
  // Send to Sentry (non-blocking)
  captureException(err);

  let statusCode = 500;
  let errorType = 'Server Error';
  const message = err.message || 'Internal server error';

  if (err instanceof ZodError) {
    statusCode = 422;
    errorType = 'Validation Error';
    res.status(statusCode).json({
      requestId: req.requestId,
      errorType,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorType = statusCode >= 500 ? 'Server Error' : 'Client Error';
    res.status(statusCode).json({ requestId: req.requestId, errorType, message: err.message });
    return;
  }

  if (err.name === 'UnauthorizedError') { statusCode = 401; errorType = 'Auth Error'; }
  if (err.status && err.status >= 400 && err.status < 500) { statusCode = err.status; errorType = 'Client Error'; }

  console.error('🔥 SERVER ERROR:', err);
  res.status(statusCode).json({
    requestId: req.requestId,
    errorType,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
  });
};
