'use client';

import { useAuth } from '@/context/AuthContext';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { CMSAccessGate } from './CMSAccessGate';
import { PublishControls } from './PublishControls';
import { Post } from '@/types/post.types';
import { EditorTopBar } from './EditorTopBar';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { EditorSEOPanel } from './EditorSEOPanel';
import { EditorPreview } from './EditorPreview';
import { cn } from '@/lib/utils';

export function PostEditor({ initialPost }: { initialPost?: Post }) {
  const { isAdmin, canPublish } = useAuth();
  const editor = useEditorWithLogging(initialPost);
  const { state } = editor;

  return (
    <CMSAccessGate requiredRole="WRITER" action="access the editor">
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-surface dark:bg-dark">
        <EditorTopBar editor={editor} canPublish={canPublish()} isAdmin={isAdmin()} publishControls={<PublishControls editor={editor} />} />
        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar editor={editor} />
          <main className={cn('flex flex-1 overflow-y-auto', state.mode === 'split' && 'border-r border-surface-border dark:border-dark-border')}>
            {state.mode === 'preview' ? <EditorPreview state={state} /> : <EditorCanvas editor={editor} />}
          </main>
          {(state.mode === 'split' || state.mode === 'seo') && (
            <aside className="w-80 overflow-y-auto border-l border-surface-border dark:border-dark-border xl:w-96">
              {state.mode === 'split' ? <EditorPreview state={state} compact /> : <EditorSEOPanel editor={editor} />}
            </aside>
          )}
        </div>
      </div>
    </CMSAccessGate>
  );
}
