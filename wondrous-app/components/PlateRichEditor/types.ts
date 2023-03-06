import {
  AutoformatRule,
  createPlugins,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TR,
  OverrideByKey,
  PlateEditor,
  PlateId,
  PlatePlugin,
  PlatePluginComponent,
  PluginOptions,
  TCommentText,
  TElement,
  TLinkElement,
  TMentionElement,
  TMentionInputElement,
  TTableElement,
  TText,
  TTodoListItemElement,
  usePlateEditorRef,
} from '@udecode/plate';
import { CSSProperties } from 'styled-components';

export enum ElementTypes {
  ELEMENT_DEFAULT = 'p',
  ELEMENT_PARAGRAPH = 'paragraph',
  ELEMENT_H1 = 'h1',
  ELEMENT_H2 = 'h2',
  ELEMENT_H3 = 'h3',
  ELEMENT_IMAGE = 'image',
  ELEMENT_BLOCKQUOTE = 'blockquote',
  ELEMENT_HR = 'hr',
  ELEMENT_LI = 'li',
  ELEMENT_OL = 'ol',
  ELEMENT_UL = 'ul',
  ELEMENT_TODO_LI = 'action_item',
  ELEMENT_MENTION = 'mention',
  ELEMENT_MENTION_INPUT = 'mention_input',
  ELEMENT_LINK = 'a',
  MARK_BOLD = 'bold',
  MARK_ITALIC = 'italic',
  MARK_UNDERLINE = 'underline',
  MARK_STRIKETHROUGH = 'strikethrough',
  MARK_CODE = 'code',
}

/**
 * Text
 */

export type EmptyText = {
  text: '';
};

export type PlainText = {
  text: string;
};

export interface RichText extends TText, TCommentText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  kbd?: boolean;
  subscript?: boolean;
  backgroundColor?: CSSProperties['backgroundColor'];
  fontFamily?: CSSProperties['fontFamily'];
  color?: CSSProperties['color'];
  fontSize?: CSSProperties['fontSize'];
  fontWeight?: CSSProperties['fontWeight'];
}

/**
 * Inline Elements
 */

export interface LinkElement extends TLinkElement {
  type: typeof ElementTypes.ELEMENT_LINK;
  children: RichText[];
}

export interface MentionInputElement extends TMentionInputElement {
  type: typeof ElementTypes.ELEMENT_MENTION_INPUT;
  children: [PlainText];
}

export interface MentionElement extends TMentionElement {
  type: typeof ElementTypes.ELEMENT_MENTION;
  children: [EmptyText];
  mentionable: string;
  id: string;
  value: string;
}

export type InlineElement = LinkElement | MentionElement | MentionInputElement;
export type InlineDescendant = InlineElement | RichText;
export type InlineChildren = InlineDescendant[];

/**
 * Block props
 */

export interface IndentProps {
  indent?: number;
}

export interface IndentListProps extends IndentProps {
  listStart?: number;
  listRestart?: number;
  listStyleType?: string;
}

export interface LineHeightProps {
  lineHeight?: CSSProperties['lineHeight'];
}

export interface BlockElement extends TElement, IndentListProps, LineHeightProps {
  id?: PlateId;
}

/**
 * Blocks
 */

export interface DefaultElement extends BlockElement {
  type: typeof ElementTypes.ELEMENT_DEFAULT;
  children: InlineChildren;
}

export interface H1Element extends BlockElement {
  type: typeof ElementTypes.ELEMENT_H1;
  children: InlineChildren;
}

export interface H2Element extends BlockElement {
  type: typeof ElementTypes.ELEMENT_H2;
  children: InlineChildren;
}

export interface H3Element extends BlockElement {
  type: typeof ElementTypes.ELEMENT_H3;
  children: InlineChildren;
}

export interface BlockquoteElement extends BlockElement {
  type: typeof ElementTypes.ELEMENT_BLOCKQUOTE;
  children: InlineChildren;
}

export interface TableElement extends TTableElement, BlockElement {
  type: typeof ELEMENT_TABLE;
  children: TableRowElement[];
}

export interface TableRowElement extends TElement {
  type: typeof ELEMENT_TR;
  children: TableCellElement[];
}

export interface TableCellElement extends TElement {
  type: typeof ELEMENT_TD;
  children: NestableBlock[];
}

export interface BulletedListElement extends TElement, BlockElement {
  type: typeof ElementTypes.ELEMENT_UL;
  children: ListItemElement[];
}

export interface NumberedListElement extends TElement, BlockElement {
  type: typeof ElementTypes.ELEMENT_OL;
  children: ListItemElement[];
}

export interface ListItemElement extends TElement, BlockElement {
  type: typeof ElementTypes.ELEMENT_LI;
  children: InlineChildren;
}

export interface TodoListElement extends TTodoListItemElement, BlockElement {
  type: typeof ElementTypes.ELEMENT_TODO_LI;
  children: InlineChildren;
}

export interface HrElement extends BlockElement {
  type: typeof ElementTypes.ELEMENT_HR;
  children: [EmptyText];
}

export type NestableBlock = DefaultElement;

export type RootBlock =
  | DefaultElement
  | H1Element
  | H2Element
  | H3Element
  | BlockquoteElement
  | TableElement
  | BulletedListElement
  | NumberedListElement
  | TodoListElement
  | HrElement;

export type TextEditorValue = RootBlock[];

/**
 * Editor types
 */

export type CustomEditor = PlateEditor<TextEditorValue> & { isDragging?: boolean };

/**
 * Plate types
 */

export type CustomOverrideByKey = OverrideByKey<TextEditorValue, CustomEditor>;
export type CustomPlatePlugin<P = PluginOptions> = PlatePlugin<P, TextEditorValue, CustomEditor>;

/**
 * Plate store, Slate context
 */

export const useMyPlateEditorRef = (id?: PlateId) => usePlateEditorRef<TextEditorValue, CustomEditor>(id);

/**
 * Utils
 */

export const createMyPlugins = (
  plugins: CustomPlatePlugin[],
  options?: {
    components?: Record<string, PlatePluginComponent>;
    overrideByKey?: CustomOverrideByKey;
  }
) => createPlugins<TextEditorValue, CustomEditor>(plugins, options);

export type CustomAutoformatRule = AutoformatRule<TextEditorValue, CustomEditor>;
