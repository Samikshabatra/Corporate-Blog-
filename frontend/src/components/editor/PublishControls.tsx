'use client';
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { canPublishPost, canArchivePost, getAllowedTransitions, hasPermission, PERMISSIONS } from '@/lib/permissions';
import { apiUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Globe, Lock, Archive, AlertTriangle, ChevronDown, Loader2, Calendar, Clock } from 'lucide-react';
import { PublishModal } from './PublishModal';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface PublishValidationError {
  field: string;
  message: string;
}

export function PublishControls({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const { user } = useAuth();
  const { state, setStatus, save } = editor;
  const { status, postId } = state;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<PublishValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const role = user?.role;
  const allowed = getAllowedTransitions(role, status);
  const canPublish = canPublishPost(role);
  const canArchive = canArchivePost(role);
  const isWriter = role === 'WRITER';

  // ── Validate before showing publish modal ───
  const openPublishModal = useCallback(async () => {
    if (!postId) {
      toast.error('Save the post first before publishing.');
      return;
    }

    setShowPublishModal(true);
    setIsValidating(true);

    try {
      const token = Cookies.get('accessToken');
      const res = await fetch(apiUrl(`/api/v1/posts/${postId}/validate-publish`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setValidationErrors(data.data?.errors || []);
    } catch {
      setValidationErrors([{ field: 'unknown', message: 'Could not validate — try again' }]);
    } finally {
      setIsValidating(false);
    }
  }, [postId]);

  // ── Publish via dedicated endpoint ──────────
  const handlePublish = useCallback(async (scheduledAt?: string) => {
    if (!postId) return;

    const token = Cookies.get('accessToken');
    const start = Date.now();

    try {
      // Save latest changes first
      await save();

      const res = await fetch(apiUrl(`/api/v1/posts/${postId}/publish`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ publishedAt: scheduledAt || null }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Publish failed');
      }

      const data = await res.json();
      const latencyMs = Date.now() - start;

      if (data.data.isScheduled) {
        toast.success(`Post scheduled for publishing! (${latencyMs}ms)`);
        setStatus('DRAFT'); // Keep as draft until scheduled time
      } else {
        toast.success(`Post published! 🎉 (${latencyMs}ms)`);
        setStatus('PUBLISHED');
      }

      setShowPublishModal(false);
    } catch (err) {
      toast.error((err as Error).message || 'Publish failed. Please try again.');
    }
  }, [postId, save, setStatus]);

  // ── Unpublish ───────────────────────────────
  async function handleUnpublish() {
    if (!postId) return;
    setLoading(true);
    try {
      const token = Cookies.get('accessToken');
      const res = await fetch(apiUrl(`/api/v1/posts/${postId}/unpublish`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unpublish failed');
      setStatus('DRAFT');
      toast.success('Post moved to drafts.');
    } catch {
      toast.error('Could not unpublish. Try again.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  // ── Archive ─────────────────────────────────
  async function handleArchive() {
    setLoading(true);
    try {
      setStatus('ARCHIVED');
      await save();
      toast.success('Post archived.');
    } catch {
      setStatus(status);
      toast.error('Archive failed.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  // ── No CMS access ──────────────────────────
  if (!hasPermission(role, PERMISSIONS.post.create)) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500">
        <AlertTriangle size={12} />No CMS access
      </div>
    );
  }

  // ── Writer: Submit for review only ──────────
  if (isWriter && status === 'DRAFT') {
    return (
      <button
        onClick={async () => {
          setLoading(true);
          try { await save(); toast.success('Draft saved!'); }
          catch { toast.error('Could not save.'); }
          finally { setLoading(false); }
        }}
        disabled={loading}
        className="btn-secondary text-sm"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : null}
        Submit for Review
      </button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* ── Status badge ─────────────────────── */}
        {status === 'PUBLISHED' && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
            <Globe size={14} />Live
          </span>
        )}
        {status === 'DRAFT' && state.publishedAt && (
          <span className="flex items-center gap-1.5 text-xs text-amber-500">
            <Clock size={12} />Previously published
          </span>
        )}
        {/* Scheduled indicator */}
        {status === 'DRAFT' && (state as { scheduledAt?: string }).scheduledAt && (
          <span className="flex items-center gap-1.5 text-xs text-blue-500">
            <Calendar size={12} />Scheduled
          </span>
        )}

        {/* ── Publish button (Editor+ only) ────── */}
        {status === 'DRAFT' && canPublish && (
          <button onClick={openPublishModal} disabled={loading} className="btn-primary text-sm">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            Publish
          </button>
        )}

        {/* ── Dropdown for additional actions ──── */}
        {(canPublish || canArchive) && allowed.length > 1 && (
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="btn-secondary px-2 text-sm">
              <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-surface-border bg-surface shadow-card-lg dark:border-dark-border dark:bg-dark-muted">
                <div className="p-1">
                  {status !== 'DRAFT' && allowed.includes('DRAFT') && (
                    <button onClick={handleUnpublish} disabled={loading} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-700 hover:bg-surface-subtle dark:text-slate-200 dark:hover:bg-dark-subtle">
                      <Lock size={15} />
                      <div><p className="text-sm font-medium">Move to Draft</p><p className="text-xs opacity-60">Unpublish post</p></div>
                    </button>
                  )}
                  {status !== 'PUBLISHED' && allowed.includes('PUBLISHED') && canPublish && (
                    <button onClick={openPublishModal} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-950">
                      <Globe size={15} />
                      <div><p className="text-sm font-medium">Publish</p><p className="text-xs opacity-60">Make it live</p></div>
                    </button>
                  )}
                  {status !== 'ARCHIVED' && allowed.includes('ARCHIVED') && canArchive && (
                    <button onClick={handleArchive} disabled={loading} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950">
                      <Archive size={15} />
                      <div><p className="text-sm font-medium">Archive</p><p className="text-xs opacity-60">Hide from public</p></div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Publish confirmation modal ────────── */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublish}
        postTitle={state.title}
        postSlug={state.slug.value}
        validationErrors={validationErrors}
        isValidating={isValidating}
      />
    </>
  );
}
