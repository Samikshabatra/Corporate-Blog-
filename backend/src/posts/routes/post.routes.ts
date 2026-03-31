import { Router } from 'express';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import { validate } from '../../middleware/validate';
import { createPostSchema, updatePostSchema, publishPostSchema } from '../validators/post.validators';
import {
  handleCreatePost, handleUpdatePost, handleGetPost, handleGetPostBySlug,
  handleListPosts, handleListPublishedPosts, handleDeletePost,
  handleGetPostsByCategorySlug, handleGetPostsByAuthorSlug, handleCheckSlug,
} from '../controllers/post.controller';
import {
  handlePublishPost, handleUnpublishPost, handleGetPublishHistory, handleValidatePublish,
} from '../controllers/publish.controller';
import { handleGetInternalSuggestions } from '../controllers/internal-suggestions.controller';
import { handleTrackView } from '../controllers/views.controller';
import { handleRelatedPosts, handlePopularPosts } from '../../search/routes/search.routes';

const router = Router();

// ── Public — MUST be before /:id to avoid shadowing ───
router.get('/published', handleListPublishedPosts);
router.get('/slug/:slug', handleGetPostBySlug);
router.get('/check-slug', handleCheckSlug);
router.get('/popular', handlePopularPosts);

// ── Parameterized public routes ───────────────────────
router.get('/:id/internal-suggestions', handleGetInternalSuggestions);
router.get('/:id/related', handleRelatedPosts);
router.post('/:id/view', handleTrackView);

// ── Protected (admin list — all statuses) ─────────────
router.get('/', authenticate, authorize('WRITER', 'EDITOR', 'ADMIN'), handleListPosts);
router.get('/:id', authenticate, authorize('WRITER', 'EDITOR', 'ADMIN'), handleGetPost);

// ── Publish workflow (Editor+ only) ───────────────────
router.put('/:id/publish', authenticate, authorize('EDITOR', 'ADMIN'), validate(publishPostSchema), handlePublishPost);
router.put('/:id/unpublish', authenticate, authorize('EDITOR', 'ADMIN'), handleUnpublishPost);
router.get('/:id/publish-history', authenticate, authorize('EDITOR', 'ADMIN'), handleGetPublishHistory);
router.post('/:id/validate-publish', authenticate, authorize('EDITOR', 'ADMIN'), handleValidatePublish);

// ── Create / Update / Delete ──────────────────────────
router.post('/', authenticate, authorize('WRITER', 'EDITOR', 'ADMIN'), validate(createPostSchema), handleCreatePost);
router.put('/:id', authenticate, authorize('WRITER', 'EDITOR', 'ADMIN'), validate(updatePostSchema), handleUpdatePost);
router.delete('/:id', authenticate, authorize('ADMIN'), handleDeletePost);

export default router;
