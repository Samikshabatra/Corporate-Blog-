'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEditor } from '@/hooks/useEditor';
import { draftLogger } from '@/lib/draftLogger';
import { Post } from '@/types/post.types';
import { BlockType } from '@/types/block.types';
import { SEOPanelState } from '@/types/editor.types';

export function useEditorWithLogging(initialPost?: Post) {
  const editor = useEditor(initialPost);
  const { user } = useAuth();
  const { state } = editor;

  function logCtx(meta?: Record<string, unknown>) {
    return { postId: state.postId, postTitle: state.title, userId: user?.sub || 'unknown', userRole: user?.role || 'unknown', meta };
  }

  const setTitle = useCallback((title: string) => { editor.setTitle(title); }, [editor]);

  const addBlock = useCallback((afterId: string | null, blockType: BlockType) => {
    editor.addBlock(afterId, blockType);
    draftLogger?.log('BLOCK_ADD', logCtx({ blockType, afterId }));
  }, [editor, state]);

  const deleteBlock = useCallback((id: string) => {
    const block = state.document.blocks.find((b) => b.id === id);
    editor.deleteBlock(id);
    draftLogger?.log('BLOCK_DELETE', logCtx({ blockId: id, blockType: block?.type }));
  }, [editor, state]);

  const moveBlockUp = useCallback((id: string) => {
    editor.moveBlockUp(id);
    draftLogger?.log('BLOCK_MOVE', logCtx({ blockId: id, direction: 'up' }));
  }, [editor, state]);

  const moveBlockDown = useCallback((id: string) => {
    editor.moveBlockDown(id);
    draftLogger?.log('BLOCK_MOVE', logCtx({ blockId: id, direction: 'down' }));
  }, [editor, state]);

  const setSlug = useCallback((slug: string) => {
    editor.setSlug(slug);
    draftLogger?.log('SLUG_CHANGE', logCtx({ slug }));
  }, [editor, state]);

  const setSeoField = useCallback((payload: { field: keyof SEOPanelState; value: string }) => {
    editor.setSeoField(payload);
    draftLogger?.log('SEO_UPDATE', logCtx({ field: payload.field }));
  }, [editor, state]);

  const toggleCategory = useCallback((id: string) => {
    editor.toggleCategory(id);
    draftLogger?.log('CATEGORY_CHANGE', logCtx({ categoryId: id }));
  }, [editor, state]);

  const save = useCallback(async () => {
    const start = Date.now();
    const isNew = !state.postId;
    await editor.save();
    draftLogger?.log(isNew ? 'CREATE_DRAFT' : 'MANUAL_SAVE', logCtx({ duration: Date.now() - start }));
  }, [editor, state]);

  const setStatus = useCallback((status: Parameters<typeof editor.setStatus>[0]) => {
    const opMap: Record<string, string> = { PUBLISHED: 'PUBLISH', DRAFT: 'UNPUBLISH', ARCHIVED: 'ARCHIVE' };
    editor.setStatus(status);
    draftLogger?.log((opMap[status] || 'UPDATE_DRAFT') as Parameters<typeof draftLogger.log>[0], logCtx({ from: state.status, to: status }));
  }, [editor, state]);

  return { ...editor, setTitle, addBlock, deleteBlock, moveBlockUp, moveBlockDown, setSlug, setSeoField, toggleCategory, save, setStatus };
}
