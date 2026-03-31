import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';

const router = Router();

router.post(
  '/draft',
  authenticate,
  authorize('WRITER', 'EDITOR', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { entries } = req.body as { entries: Array<Record<string, unknown>> };
      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        res.status(400).json({ status: 'error', message: 'No entries provided' });
        return;
      }
      const batch = entries.slice(0, 50);
      for (const entry of batch) {
        console.log(JSON.stringify({ type: 'DRAFT_LOG', ...entry }));
      }
      res.status(200).json({ status: 'success', data: { received: batch.length } });
    } catch (err) { next(err); }
  },
);

export default router;
