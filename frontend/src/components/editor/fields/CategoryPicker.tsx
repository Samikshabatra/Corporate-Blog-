'use client';
import { useEffect, useState } from 'react';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { apiUrl, cn } from '@/lib/utils';
import { Check } from 'lucide-react';
interface Category { id: string; name: string; slug: string; }
export function CategoryPicker({ editor }: { editor: ReturnType<typeof useEditorWithLogging> }) {
  const { state, toggleCategory } = editor;
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { fetch(apiUrl('/api/v1/categories')).then((r) => r.json()).then((d) => setCategories(d.data || [])).catch(() => {}); }, []);
  if (!categories.length) return <p className="text-xs text-slate-400">No categories yet.</p>;
  return (
    <div className="space-y-1">
      {categories.map((cat) => {
        const selected = state.selectedCategoryIds.includes(cat.id);
        return (
          <button key={cat.id} onClick={() => toggleCategory(cat.id)} className={cn('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors', selected ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300' : 'text-slate-600 hover:bg-surface-subtle dark:text-slate-400 dark:hover:bg-dark-subtle')}>
            <div className={cn('flex h-4 w-4 items-center justify-center rounded border transition-colors', selected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 dark:border-dark-subtle')}>
              {selected && <Check size={10} className="text-white" />}
            </div>
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
