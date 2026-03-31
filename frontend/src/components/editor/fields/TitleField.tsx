'use client';
import { useRef, useEffect } from 'react';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
export function TitleField({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const { state, setTitle } = editor;
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }, [state.title]);
  return (<textarea ref={ref} value={state.title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..." rows={1} className="w-full resize-none overflow-hidden bg-transparent font-serif text-4xl font-bold text-slate-900 placeholder-slate-200 outline-none dark:text-white dark:placeholder-slate-700 xl:text-5xl" />);
}
