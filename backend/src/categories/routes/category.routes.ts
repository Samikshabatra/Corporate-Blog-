import { Router } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import { handleGetPostsByCategorySlug } from '../../posts/controllers/post.controller';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();

// Public
router.get('/', listCategories);
router.get('/:slug/posts', handleGetPostsByCategorySlug);

// Protected (Editor+)
router.post('/', authenticate, authorize('EDITOR', 'ADMIN'), createCategory);
router.put('/:id', authenticate, authorize('EDITOR', 'ADMIN'), updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

export default router;
