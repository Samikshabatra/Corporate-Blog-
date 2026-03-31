'use client';

import { useReducer, useCallback, useRef, useEffect } from 'react';
import { editorReducer, initialEditorState } from '@/store/editorReducer';
import { EditorState, SaveStatus } from '@/types/editor.types';
import { Block, BlockType } from '@/types/block.types';
import { Post } from '@/types/post.types';
import { validateSlugClient } from '@/lib/slugUtils';
import { apiUrl } from '@/lib/utils';
import Cookies from 'js-cookie';

const AUTO_SAVE_DELAY = 3000;

export function useEditor(initialPost?: Post) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState());
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<EditorState>(state);
  stateRef.current = state;

  useEffect(() => {
    if (initialPost) dispatch({ type: 'LOAD_POST', payload: initialPost });
  }, [initialPost]);

  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => void performSave('auto'), AUTO_SAVE_DELAY);
  }, []);

  useEffect(() => {
    if (state.autoSave.status === 'unsaved') triggerAutoSave();
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [state.autoSave.status, triggerAutoSave]);

  const performSave = useCallback(async (mode: 'auto' | 'manual' = 'manual') => {
    const s = stateRef.current;
    if (!s.title.trim()) return;
    dispatch({ type: 'SET_SAVE_STATUS', payload: 'saving' });
    const token = Cookies.get('accessToken');
    const payload = {
      title: s.title, content: JSON.stringify(s.document),
      excerpt: s.seo.metaDesc || undefined, slug: s.slug.value || undefined,
      categoryIds: s.selectedCategoryIds,
      metaTitle: s.seo.metaTitle || undefined, metaDesc: s.seo.metaDesc || undefined,
      ogTitle: s.seo.ogTitle || undefined, ogDesc: s.seo.ogDesc || undefined, ogImage: s.seo.ogImage || undefined,
      twitterTitle: s.seo.twitterTitle || undefined, twitterDesc: s.seo.twitterDesc || undefined, twitterImage: s.seo.twitterImage || undefined,
      schemaType: s.seo.schemaType, status: s.status,
    };
    try {
      const isNew = !s.postId;
      const res = await fetch(apiUrl(isNew ? '/api/v1/posts' : `/api/v1/posts/${s.postId}`), {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
    } catch (err) {
      dispatch({ type: 'SET_SAVE_ERROR', payload: (err as Error).message });
      if (mode === 'manual') throw err;
    }
  }, []);

  const slugCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkSlugUniqueness = useCallback(async (slug: string, postId?: string) => {
    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    const { valid, error } = validateSlugClient(slug);
    if (!valid) { dispatch({ type: 'SET_SLUG_ERROR', payload: error }); return; }
    dispatch({ type: 'SET_SLUG_CHECKING', payload: true });
    slugCheckTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ slug });
        if (postId) params.set('excludeId', postId);
        const res = await fetch(apiUrl(`/api/v1/posts/check-slug?${params}`));
        const data = await res.json();
        dispatch({ type: data.unique ? 'SET_SLUG_UNIQUE' : 'SET_SLUG_ERROR', payload: data.unique ? true : 'This slug is already taken' });
      } catch {
        dispatch({ type: 'SET_SLUG_ERROR', payload: 'Could not verify slug' });
      } finally {
        dispatch({ type: 'SET_SLUG_CHECKING', payload: false });
      }
    }, 500);
  }, []);

  return {
    state, dispatch,
    setTitle: (title: string) => dispatch({ type: 'SET_TITLE', payload: title }),
    addBlock: (afterId: string | null, blockType: BlockType) => dispatch({ type: 'ADD_BLOCK', payload: { afterId, blockType } }),
    updateBlock: (id: string, block: Partial<Block>) => dispatch({ type: 'UPDATE_BLOCK', payload: { id, block } }),
    deleteBlock: (id: string) => dispatch({ type: 'DELETE_BLOCK', payload: { id } }),
    moveBlockUp: (id: string) => dispatch({ type: 'MOVE_BLOCK_UP', payload: { id } }),
    moveBlockDown: (id: string) => dispatch({ type: 'MOVE_BLOCK_DOWN', payload: { id } }),
    duplicateBlock: (id: string) => dispatch({ type: 'DUPLICATE_BLOCK', payload: { id } }),
    setMode: (mode: EditorState['mode']) => dispatch({ type: 'SET_MODE', payload: mode }),
    setSlug: (slug: string) => { dispatch({ type: 'SET_SLUG_MANUAL', payload: slug }); void checkSlugUniqueness(slug, state.postId || undefined); },
    setSeoField: (payload: { field: keyof import('@/types/editor.types').SEOPanelState; value: string }) => dispatch({ type: 'SET_SEO_FIELD', payload }),
    toggleCategory: (id: string) => dispatch({ type: 'TOGGLE_CATEGORY', payload: id }),
    save: () => performSave('manual'),
    setStatus: (status: EditorState['status']) => dispatch({ type: 'SET_STATUS', payload: status }),
  };
}
