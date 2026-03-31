export type DraftOpType =
  | 'CREATE_DRAFT' | 'UPDATE_DRAFT' | 'AUTO_SAVE' | 'MANUAL_SAVE'
  | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'RESTORE' | 'DELETE'
  | 'BLOCK_ADD' | 'BLOCK_DELETE' | 'BLOCK_MOVE'
  | 'SLUG_CHANGE' | 'SEO_UPDATE' | 'CATEGORY_CHANGE' | 'IMAGE_UPLOAD';

export interface DraftLogEntry {
  id: string; type: DraftOpType; postId: string | null;
  postTitle: string; userId: string; userRole: string;
  timestamp: string; meta?: Record<string, unknown>; duration?: number;
}

const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000;

class DraftLogger {
  private queue: DraftLogEntry[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private apiBase: string;

  constructor() {
    this.apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    this.startFlushTimer();
  }

  log(type: DraftOpType, context: {
    postId?: string | null; postTitle?: string;
    userId: string; userRole: string;
    meta?: Record<string, unknown>; duration?: number;
  }): void {
    const entry: DraftLogEntry = {
      id: crypto.randomUUID(), type,
      postId: context.postId ?? null,
      postTitle: context.postTitle || 'Untitled',
      userId: context.userId, userRole: context.userRole,
      timestamp: new Date().toISOString(),
      meta: context.meta, duration: context.duration,
    };
    this.queue.push(entry);
    const critical: DraftOpType[] = ['PUBLISH', 'UNPUBLISH', 'DELETE', 'ARCHIVE'];
    if (critical.includes(type) || this.queue.length >= BATCH_SIZE) void this.flush();
    if (process.env.NODE_ENV === 'development') console.log(`[DraftLog] ${type}`, entry);
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    const batch = [...this.queue];
    this.queue = [];
    try {
      const { default: Cookies } = await import('js-cookie');
      const token = Cookies.get('accessToken');
      await fetch(`${this.apiBase}/api/v1/logs/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ entries: batch }),
      });
    } catch {
      if (typeof document !== 'undefined' && document.visibilityState !== 'hidden') {
        this.queue = [...batch, ...this.queue];
      }
    }
  }

  private startFlushTimer(): void {
    if (typeof window === 'undefined') return;
    this.timer = setInterval(() => void this.flush(), FLUSH_INTERVAL);
    window.addEventListener('beforeunload', () => void this.flush());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') void this.flush();
    });
  }
}

export const draftLogger = typeof window !== 'undefined' ? new DraftLogger() : null;
