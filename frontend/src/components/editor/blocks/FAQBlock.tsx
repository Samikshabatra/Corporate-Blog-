'use client';

import { useState } from 'react';
import { FAQBlock as FAQBlockType } from '@/types/block.types';
import { useEditorWithLogging } from '@/hooks/useEditorWithLogging';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQBlockProps {
  block: FAQBlockType;
  editor: ReturnType<typeof useEditorWithLogging>;
}

export function FAQBlock({ block, editor }: FAQBlockProps) {
  const { dispatch } = editor;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function updateItem(index: number, field: 'question' | 'answer', value: string) {
    const newItems = block.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: { id: block.id, data: { items: newItems } },
    });
  }

  function addItem() {
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: {
        id: block.id,
        data: { items: [...block.items, { question: '', answer: '' }] },
      },
    });
    setOpenIndex(block.items.length);
  }

  function removeItem(index: number) {
    if (block.items.length === 1) return;
    const newItems = block.items.filter((_, i) => i !== index);
    dispatch({
      type: 'UPDATE_BLOCK',
      payload: { id: block.id, data: { items: newItems } },
    });
  }

  return (
    <div className="my-4 rounded-lg border border-surface-border dark:border-dark-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-2 dark:border-dark-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          FAQ Block
        </span>
        <span className="text-xs text-slate-400">{block.items.length} question{block.items.length !== 1 ? 's' : ''}</span>
      </div>

      {/* FAQ Items */}
      <div className="divide-y divide-surface-border dark:divide-dark-border">
        {block.items.map((item, index) => (
          <div key={index} className="p-4">
            {/* Question */}
            <div className="flex items-start gap-2">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="mt-2 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {openIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateItem(index, 'question', e.target.value)}
                  placeholder="Question..."
                  className="input text-sm font-medium"
                />
              </div>
              <button
                onClick={() => removeItem(index)}
                disabled={block.items.length === 1}
                className="mt-2 shrink-0 text-slate-300 hover:text-red-500 disabled:opacity-30 dark:text-slate-600"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Answer */}
            {openIndex === index && (
              <div className="mt-2 pl-6">
                <textarea
                  value={item.answer}
                  onChange={(e) => updateItem(index, 'answer', e.target.value)}
                  placeholder="Answer..."
                  rows={3}
                  className="input resize-none text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Question */}
      <div className="border-t border-surface-border p-3 dark:border-dark-border">
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <Plus size={14} /> Add question
        </button>
      </div>
    </div>
  );
}