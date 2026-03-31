'use client';
import { ListBlock as T } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { Plus, X } from 'lucide-react';
export function ListBlock({ block, editor }: { block: T; editor: ReturnType<typeof useEditorWithLogging> }) {
  const { updateBlock } = editor;
  function updateItem(index: number, text: string) { updateBlock(block.id, { items: block.items.map((item, i) => i === index ? [{ text }] : item) }); }
  function addItem() { updateBlock(block.id, { items: [...block.items, [{ text: '' }]] }); }
  function removeItem(index: number) { if (block.items.length === 1) return; updateBlock(block.id, { items: block.items.filter((_, i) => i !== index) }); }
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <select value={block.variant} onChange={(e) => updateBlock(block.id, { variant: e.target.value as T['variant'] })} className="bg-transparent text-xs text-slate-400 outline-none">
          <option value="unordered">Bullet list</option>
          <option value="ordered">Numbered list</option>
        </select>
      </div>
      <ul className="space-y-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-center text-slate-400">{block.variant === 'ordered' ? `${i+1}.` : '•'}</span>
            <input type="text" value={item.map((n) => n.text).join('')} onChange={(e) => updateItem(i, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } if (e.key === 'Backspace' && !item[0].text) removeItem(i); }} placeholder="List item" className="flex-1 bg-transparent text-slate-800 placeholder-slate-300 outline-none dark:text-slate-200" />
            <button onClick={() => removeItem(i)} className="text-slate-200 hover:text-red-400"><X size={12} /></button>
          </li>
        ))}
      </ul>
      <button onClick={addItem} className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><Plus size={12} /> Add item</button>
    </div>
  );
}
