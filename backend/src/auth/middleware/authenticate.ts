import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.service';
import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Try Authorization header first (API clients)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to cookie (browser clients)
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or deactivated', 401);
    }

    req.user = {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};
