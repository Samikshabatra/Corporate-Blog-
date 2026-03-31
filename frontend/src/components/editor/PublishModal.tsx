'use client';

import { useState } from 'react';
import { AlertTriangle, Calendar, Globe, Loader2, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEO_CONFIG } from '@/lib/seo.config';

interface PublishValidationError {
  field: string;
  message: string;
}

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scheduledAt?: string) => Promise<void>;
  postTitle: string;
  postSlug: string;
  validationErrors: PublishValidationError[];
  isValidating: boolean;
}

export function PublishModal({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  postSlug,
  validationErrors,
  isValidating,
}: PublishModalProps) {
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const hasErrors = validationErrors.length > 0;
  const finalUrl = `${SEO_CONFIG.siteUrl}/blog/${postSlug}`;

  async function handleConfirm() {
    setLoading(true);
    try {
      let scheduledAt: string | undefined;
      if (mode === 'schedule' && scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }
      await onConfirm(scheduledAt);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-card-lg dark:border-dark-border dark:bg-dark-muted">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Publish Post
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate max-w-sm">
              {postTitle}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 -mr-1.5 -mt-1.5">
            <X size={18} />
          </button>
        </div>

        {/* Validation errors */}
        {isValidating ? (
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 size={14} className="animate-spin" />
            Checking publish requirements...
          </div>
        ) : hasErrors ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Cannot publish — fix these issues:
              </span>
            </div>
            <ul className="space-y-1 ml-6">
              {validationErrors.map((err, i) => (
                <li key={i} className="text-sm text-red-600 dark:text-red-400 list-disc">
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <p className="text-sm text-green-700 dark:text-green-300">
              All publish requirements met. Ready to go live.
            </p>
          </div>
        )}

        {/* Final URL preview */}
        <div className="mb-6">
          <label className="label">Final URL</label>
          <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-2 dark:border-dark-border dark:bg-dark-subtle">
            <ExternalLink size={14} className="text-slate-400 shrink-0" />
            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{finalUrl}</span>
          </div>
        </div>

        {/* Publish mode */}
        {!hasErrors && (
          <div className="mb-6">
            <label className="label">When to publish</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('now')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                  mode === 'now'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-300'
                    : 'border-surface-border text-slate-600 hover:bg-surface-subtle dark:border-dark-border dark:text-slate-400',
                )}
              >
                <Globe size={14} />
                Publish Now
              </button>
              <button
                onClick={() => setMode('schedule')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                  mode === 'schedule'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-300'
                    : 'border-surface-border text-slate-600 hover:bg-surface-subtle dark:border-dark-border dark:text-slate-400',
                )}
              >
                <Calendar size={14} />
                Schedule
              </button>
            </div>

            {mode === 'schedule' && (
              <div className="mt-3 flex gap-2">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input flex-1"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="input w-32"
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || hasErrors || isValidating || (mode === 'schedule' && (!scheduledDate || !scheduledTime))}
            className="btn-primary text-sm"
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Publishing...</>
            ) : mode === 'schedule' ? (
              <><Calendar size={14} /> Schedule</>
            ) : (
              <><Globe size={14} /> Publish Now</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
