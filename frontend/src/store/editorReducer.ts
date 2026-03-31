import { EditorState, EditorAction, SEOPanelState, SlugState } from '@/types/editor.types';
import { createBlock, createEmptyDocument } from '@/types/block.types';
import { generateSlugClient } from '@/lib/slugUtils';
import { SEO_CONFIG } from '@/lib/seo.config';

function initialSEO(): SEOPanelState {
  return { metaTitle: '', metaDesc: '', ogTitle: '', ogDesc: '', ogImage: '', twitterTitle: '', twitterDesc: '', twitterImage: '', schemaType: 'Article', canonicalUrl: '', metaTitleLength: 0, metaDescLength: 0, isValid: false };
}

function initialSlug(): SlugState {
  return { value: '', isManual: false, isChecking: false, isUnique: true, error: null, preview: `${SEO_CONFIG.siteUrl}/blog/` };
}

export function initialEditorState(overrides?: Partial<EditorState>): EditorState {
  return {
    postId: null, title: '', status: 'DRAFT', publishedAt: null,
    document: createEmptyDocument(), selectedCategoryIds: [],
    mode: 'write', selection: { blockId: null, blockIndex: null },
    toolbar: { isVisible: false, blockId: null, position: null },
    insertMenu: { isOpen: false, afterBlockId: null, query: '' },
    slug: initialSlug(), seo: initialSEO(),
    autoSave: { status: 'idle', lastSaved: null, errorMessage: null },
    canPublish: false, isOwner: true, ...overrides,
  };
}

function validateSEO(seo: SEOPanelState): SEOPanelState {
  const metaTitleLength = seo.metaTitle.length;
  const metaDescLength = seo.metaDesc.length;
  const isValid = metaTitleLength >= 10 && metaTitleLength <= 60 && metaDescLength >= 50 && metaDescLength <= 160;
  return { ...seo, metaTitleLength, metaDescLength, isValid };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_TITLE': {
      const title = action.payload;
      const slug = state.slug.isManual ? state.slug : { ...state.slug, value: generateSlugClient(title), preview: `${SEO_CONFIG.siteUrl}/blog/${generateSlugClient(title)}` };
      const seo = state.seo.metaTitle ? state.seo : validateSEO({ ...state.seo, metaTitle: title.slice(0, 60) });
      return { ...state, title, slug, seo, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'SET_DOCUMENT':
      return { ...state, document: action.payload, autoSave: { ...state.autoSave, status: 'unsaved' } };
    case 'ADD_BLOCK': {
      const { afterId, blockType } = action.payload;
      const newBlock = createBlock(blockType);
      const blocks = [...state.document.blocks];
      if (afterId === null) blocks.push(newBlock);
      else { const idx = blocks.findIndex((b) => b.id === afterId); blocks.splice(idx + 1, 0, newBlock); }
      return { ...state, document: { ...state.document, blocks, updatedAt: new Date().toISOString() }, selection: { blockId: newBlock.id, blockIndex: blocks.indexOf(newBlock) }, insertMenu: { isOpen: false, afterBlockId: null, query: '' }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'UPDATE_BLOCK': {
      const blocks = state.document.blocks.map((b) => b.id === action.payload.id ? { ...b, ...(action.payload.block || action.payload.data) } : b);
      return { ...state, document: { ...state.document, blocks, updatedAt: new Date().toISOString() }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'DELETE_BLOCK': {
      if (state.document.blocks.length === 1) return state;
      const blocks = state.document.blocks.filter((b) => b.id !== action.payload.id);
      return { ...state, document: { ...state.document, blocks, updatedAt: new Date().toISOString() }, selection: { blockId: null, blockIndex: null }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'MOVE_BLOCK_UP': {
      const blocks = [...state.document.blocks];
      const idx = blocks.findIndex((b) => b.id === action.payload.id);
      if (idx <= 0) return state;
      [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
      return { ...state, document: { ...state.document, blocks, updatedAt: new Date().toISOString() }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'MOVE_BLOCK_DOWN': {
      const blocks = [...state.document.blocks];
      const idx = blocks.findIndex((b) => b.id === action.payload.id);
      if (idx >= blocks.length - 1) return state;
      [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
      return { ...state, document: { ...state.document, blocks, updatedAt: new Date().toISOString() }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'DUPLICATE_BLOCK': {
      const blocks = [...state.document.blocks];
      const idx = blocks.findIndex((b) => b.id === action.payload.id);
      const cloned = { ...blocks[idx], id: crypto.randomUUID() };
      blocks.splice(idx + 1, 0, cloned);
      return { ...state, document: { ...state.document, blocks, updatedAt: new Date().toISOString() }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'SET_SELECTION': return { ...state, selection: action.payload };
    case 'SET_MODE': return { ...state, mode: action.payload };
    case 'SET_SLUG': return { ...state, slug: { ...state.slug, value: action.payload, preview: `${SEO_CONFIG.siteUrl}/blog/${action.payload}` } };
    case 'SET_SLUG_MANUAL': return { ...state, slug: { ...state.slug, value: action.payload, isManual: true, preview: `${SEO_CONFIG.siteUrl}/blog/${action.payload}` }, autoSave: { ...state.autoSave, status: 'unsaved' } };
    case 'SET_SLUG_CHECKING': return { ...state, slug: { ...state.slug, isChecking: action.payload } };
    case 'SET_SLUG_UNIQUE': return { ...state, slug: { ...state.slug, isUnique: action.payload, error: null } };
    case 'SET_SLUG_ERROR': return { ...state, slug: { ...state.slug, error: action.payload, isUnique: false } };
    case 'SET_SEO_FIELD': {
      const updated = { ...state.seo, [action.payload.field]: action.payload.value };
      return { ...state, seo: validateSEO(updated), autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'TOGGLE_CATEGORY': {
      const id = action.payload;
      const ids = state.selectedCategoryIds.includes(id) ? state.selectedCategoryIds.filter((c) => c !== id) : [...state.selectedCategoryIds, id];
      return { ...state, selectedCategoryIds: ids, autoSave: { ...state.autoSave, status: 'unsaved' } };
    }
    case 'SHOW_TOOLBAR': return { ...state, toolbar: action.payload };
    case 'HIDE_TOOLBAR': return { ...state, toolbar: { isVisible: false, blockId: null, position: null } };
    case 'OPEN_INSERT_MENU': return { ...state, insertMenu: { isOpen: true, afterBlockId: action.payload.afterBlockId, query: '' } };
    case 'CLOSE_INSERT_MENU': return { ...state, insertMenu: { isOpen: false, afterBlockId: null, query: '' } };
    case 'SET_INSERT_QUERY': return { ...state, insertMenu: { ...state.insertMenu, query: action.payload } };
    case 'SET_SAVE_STATUS': return { ...state, autoSave: { ...state.autoSave, status: action.payload, errorMessage: null } };
    case 'SET_LAST_SAVED': return { ...state, autoSave: { ...state.autoSave, status: 'saved', lastSaved: action.payload, errorMessage: null } };
    case 'SET_SAVE_ERROR': return { ...state, autoSave: { ...state.autoSave, status: 'error', errorMessage: action.payload } };
    case 'SET_STATUS': return { ...state, status: action.payload };
    case 'LOAD_POST': {
      const post = action.payload;
      let document = createEmptyDocument();
      try { document = JSON.parse(post.content); } catch { document = createEmptyDocument(); }
      return {
        ...state, postId: post.id, title: post.title, status: post.status, publishedAt: post.publishedAt,
        document, selectedCategoryIds: post.categories.map((c) => c.id),
        slug: { value: post.slug, isManual: true, isChecking: false, isUnique: true, error: null, preview: `${SEO_CONFIG.siteUrl}/blog/${post.slug}` },
        seo: validateSEO({ metaTitle: post.metaTitle || post.title, metaDesc: post.metaDesc || post.excerpt || '', ogTitle: post.ogTitle || post.title, ogDesc: post.ogDesc || post.excerpt || '', ogImage: post.ogImage || '', twitterTitle: post.twitterTitle || post.title, twitterDesc: post.twitterDesc || post.excerpt || '', twitterImage: post.twitterImage || '', schemaType: (post.schemaType || 'Article') as 'Article' | 'BlogPosting', canonicalUrl: post.canonicalUrl || '', metaTitleLength: 0, metaDescLength: 0, isValid: false }),
        autoSave: { status: 'saved', lastSaved: new Date(post.updatedAt), errorMessage: null },
      };
    }
    default: return state;
  }
}
