import { Block, BlockDocument, BlockType } from './block.types';
import { Post, PostStatus } from './post.types';

export type EditorMode = 'write' | 'preview' | 'split' | 'seo';

export interface EditorSelection { blockId: string | null; blockIndex: number | null; offset?: number; }

export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error';

export interface AutoSaveState { status: SaveStatus; lastSaved: Date | null; errorMessage: string | null; }

export interface SEOPanelState {
  metaTitle: string; metaDesc: string; ogTitle: string; ogDesc: string; ogImage: string;
  twitterTitle: string; twitterDesc: string; twitterImage: string;
  schemaType: 'Article' | 'BlogPosting'; canonicalUrl: string;
  metaTitleLength: number; metaDescLength: number; isValid: boolean;
}

export interface SlugState {
  value: string; isManual: boolean; isChecking: boolean;
  isUnique: boolean; error: string | null; preview: string;
}

export interface BlockToolbarState { isVisible: boolean; blockId: string | null; position: { top: number; left: number } | null; }
export interface BlockInsertMenuState { isOpen: boolean; afterBlockId: string | null; query: string; }

export interface EditorState {
  postId: string | null; title: string; status: PostStatus; publishedAt: string | null;
  document: BlockDocument; selectedCategoryIds: string[];
  mode: EditorMode; selection: EditorSelection;
  toolbar: BlockToolbarState; insertMenu: BlockInsertMenuState;
  slug: SlugState; seo: SEOPanelState; autoSave: AutoSaveState;
  canPublish: boolean; isOwner: boolean;
}

export type EditorAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_DOCUMENT'; payload: BlockDocument }
  | { type: 'ADD_BLOCK'; payload: { afterId: string | null; blockType: BlockType } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; block?: Partial<Block>; data?: Partial<Block> } }
  | { type: 'DELETE_BLOCK'; payload: { id: string } }
  | { type: 'MOVE_BLOCK_UP'; payload: { id: string } }
  | { type: 'MOVE_BLOCK_DOWN'; payload: { id: string } }
  | { type: 'DUPLICATE_BLOCK'; payload: { id: string } }
  | { type: 'SET_SELECTION'; payload: EditorSelection }
  | { type: 'SET_MODE'; payload: EditorMode }
  | { type: 'SET_SLUG'; payload: string }
  | { type: 'SET_SLUG_MANUAL'; payload: string }
  | { type: 'SET_SLUG_CHECKING'; payload: boolean }
  | { type: 'SET_SLUG_UNIQUE'; payload: boolean }
  | { type: 'SET_SLUG_ERROR'; payload: string | null }
  | { type: 'SET_SEO_FIELD'; payload: { field: keyof SEOPanelState; value: string } }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'SHOW_TOOLBAR'; payload: BlockToolbarState }
  | { type: 'HIDE_TOOLBAR' }
  | { type: 'OPEN_INSERT_MENU'; payload: { afterBlockId: string | null } }
  | { type: 'CLOSE_INSERT_MENU' }
  | { type: 'SET_INSERT_QUERY'; payload: string }
  | { type: 'SET_SAVE_STATUS'; payload: SaveStatus }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'SET_SAVE_ERROR'; payload: string }
  | { type: 'SET_STATUS'; payload: PostStatus }
  | { type: 'LOAD_POST'; payload: Post };
