'use client';

import { useMemo } from 'react';
import { EditorState } from '@/types/editor.types';
import { BlockDocument, ImageBlock } from '@/types/block.types';

export interface PublishValidationError {
  field: string;
  message: string;
}

const MAX_IMAGE_DIMENSION = 4096;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function usePublishValidation(state: EditorState) {
  const errors = useMemo<PublishValidationError[]>(() => {
    const errs: PublishValidationError[] = [];

    // Required: Title
    if (!state.title || state.title.trim().length < 5) {
      errs.push({ field: 'title', message: 'Title is required (min 5 characters)' });
    }

    // Required: Slug
    if (!state.slug.value || state.slug.value.trim().length < 3) {
      errs.push({ field: 'slug', message: 'Slug is required (min 3 characters)' });
    }

    // Required: Banner image (ogImage)
    if (!state.seo.ogImage) {
      errs.push({ field: 'ogImage', message: 'Banner image (OG image) is required' });
    }

    // Required: Meta description OR excerpt
    if (!state.seo.metaDesc && !state.seo.ogDesc) {
      errs.push({ field: 'metaDesc', message: 'Meta description or excerpt is required' });
    }

    // Content check
    const hasContent = state.document.blocks.some((b) => {
      if (b.type === 'paragraph') return b.content.some((n) => n.text.trim());
      if (b.type === 'heading') return b.content.some((n) => n.text.trim());
      return b.type !== 'divider';
    });
    if (!hasContent) {
      errs.push({ field: 'content', message: 'Post must have content' });
    }

    // Image block validations
    validateImageBlocks(state.document, errs);

    return errs;
  }, [state.title, state.slug.value, state.seo.ogImage, state.seo.metaDesc, state.seo.ogDesc, state.document]);

  return {
    errors,
    canPublish: errors.length === 0,
    hasErrors: errors.length > 0,
  };
}

function validateImageBlocks(document: BlockDocument, errors: PublishValidationError[]) {
  for (const block of document.blocks) {
    if (block.type !== 'image') continue;
    const img = block as ImageBlock;

    // Required: alt text
    if (!img.altText) {
      errors.push({
        field: `block:${block.id}:altText`,
        message: `Image missing alt text (block ${block.id.slice(0, 8)})`,
      });
    }

    // Oversized image check
    if (img.width && img.width > MAX_IMAGE_DIMENSION) {
      errors.push({
        field: `block:${block.id}:width`,
        message: `Image width exceeds ${MAX_IMAGE_DIMENSION}px`,
      });
    }

    if (img.height && img.height > MAX_IMAGE_DIMENSION) {
      errors.push({
        field: `block:${block.id}:height`,
        message: `Image height exceeds ${MAX_IMAGE_DIMENSION}px`,
      });
    }

    // Cloudinary WebP/AVIF enforcement check
    if (img.url && img.url.includes('res.cloudinary.com') && !img.url.includes('f_auto')) {
      errors.push({
        field: `block:${block.id}:format`,
        message: 'Image URL missing Cloudinary f_auto transform — WebP/AVIF not enforced',
      });
    }
  }
}
