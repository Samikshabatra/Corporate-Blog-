import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const handleDashboardStats = async (
  req: Request, res: Response, next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const userRole = req.user!.role;
    const isEditor = userRole === 'EDITOR' || userRole === 'ADMIN';
    const authorFilter = isEditor ? {} : { authorId: userId };

    const [totalPosts, publishedPosts, draftPosts, totalViews] = await Promise.all([
      prisma.post.count({ where: authorFilter }),
      prisma.post.count({ where: { ...authorFilter, status: 'PUBLISHED' } }),
      prisma.post.count({ where: { ...authorFilter, status: 'DRAFT' } }),
      prisma.post.aggregate({ where: authorFilter, _sum: { viewCount: true } }),
    ]);

    res.status(200).json({
      status: 'success',
      data: { totalPosts, publishedPosts, draftPosts, totalViews: totalViews._sum.viewCount || 0 },
    });
  } catch (err) { next(err); }
};
