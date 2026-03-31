import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

// GET /users — list all users (Admin only)
router.get('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, slug: true, isActive: true, avatarUrl: true, createdAt: true,
        _count: { select: { posts: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ status: 'success', data: users });
  } catch (err) { next(err); }
});

// PUT /users/:id/role — update user role (Admin only)
router.put('/:id/role', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    if (!['ADMIN', 'EDITOR', 'WRITER'].includes(role)) throw new AppError('Invalid role', 400);
    if (req.params.id === req.user!.sub) throw new AppError('Cannot change your own role', 400);
    await prisma.user.update({ where: { id: req.params.id }, data: { role } });
    res.json({ status: 'success', message: 'Role updated' });
  } catch (err) { next(err); }
});

// PUT /users/:id/status — activate/deactivate user (Admin only)
router.put('/:id/status', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    if (req.params.id === req.user!.sub) throw new AppError('Cannot deactivate yourself', 400);
    await prisma.user.update({ where: { id: req.params.id }, data: { isActive } });
    res.json({ status: 'success', message: isActive ? 'User activated' : 'User deactivated' });
  } catch (err) { next(err); }
});

export default router;
