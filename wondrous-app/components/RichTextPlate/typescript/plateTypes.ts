import {
  AutoformatRule,
  createPlateEditor,
  CreatePlateEditorOptions,
  createPluginFactory,
  createPlugins,
  createTEditor,
  Decorate,
  DecorateEntry,
  DOMHandler,
  EDescendant,
  EElement,
  EElementEntry,
  EElementOrText,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION_INPUT,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TR,
  EMarks,
  ENode,
  ENodeEntry,
  EText,
  ETextEntry,
  getTEditor,
  InjectComponent,
  InjectProps,
  KeyboardHandler,
  NoInfer,
  OnChange,
  OverrideByKey,
  PlateEditor,
  PlateId,
  PlatePlugin,
  PlatePluginComponent,
  PlatePluginInsertData,
  PlatePluginProps,
  PlateProps,
  PluginOptions,
  SerializeHtml,
  TCommentText,
  TElement,
  TLinkElement,
  TMediaEmbedElement,
  TMentionElement,
  TMentionInputElement,
  TNodeEntry,
  TReactEditor,
  TTableElement,
  TText,
  TTodoListItemElement,
  useEditorRef,
  useEditorState,
  usePlateActions,
  usePlateEditorRef,
  usePlateEditorState,
  usePlateSelectors,
  usePlateStates,
  WithOverride,
} from '@udecode/plate';
import { CSSProperties } from 'styled-components';

export enum ElementTypes {
  ELEMENT_P = 'p',
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

export interface MyLinkElement extends TLinkElement {
  type: typeof ElementTypes.ELEMENT_LINK;
  children: RichText[];
}

export interface MyMentionInputElement extends TMentionInputElement {
  type: typeof ELEMENT_MENTION_INPUT;
  children: [PlainText];
}

export interface MyMentionElement extends TMentionElement {
  type: typeof ElementTypes.ELEMENT_MENTION;
  children: [EmptyText];
}

export type MyInlineElement = MyLinkElement | MyMentionElement | MyMentionInputElement;
export type MyInlineDescendant = MyInlineElement | RichText;
export type MyInlineChildren = MyInlineDescendant[];

/**
 * Block props
 */

export interface MyIndentProps {
  indent?: number;
}

export interface MyIndentListProps extends MyIndentProps {
  listStart?: number;
  listRestart?: number;
  listStyleType?: string;
}

export interface MyLineHeightProps {
  lineHeight?: CSSProperties['lineHeight'];
}

export interface MyAlignProps {
  align?: CSSProperties['textAlign'];
}

export interface MyBlockElement extends TElement, MyIndentListProps, MyLineHeightProps {
  id?: PlateId;
}

/**
 * Blocks
 */

export interface MyParagraphElement extends MyBlockElement {
  // type: typeof ELEMENT_PARAGRAPH;
  type: typeof ElementTypes.ELEMENT_P;
  children: MyInlineChildren;
}

export interface MyH1Element extends MyBlockElement {
  type: typeof ElementTypes.ELEMENT_H1;
  children: MyInlineChildren;
}

export interface MyH2Element extends MyBlockElement {
  type: typeof ElementTypes.ELEMENT_H2;
  children: MyInlineChildren;
}

export interface MyH3Element extends MyBlockElement {
  type: typeof ElementTypes.ELEMENT_H3;
  children: MyInlineChildren;
}

export interface MyBlockquoteElement extends MyBlockElement {
  type: typeof ElementTypes.ELEMENT_BLOCKQUOTE;
  children: MyInlineChildren;
}

export interface MyCodeBlockElement extends MyBlockElement {
  type: typeof ELEMENT_CODE_BLOCK;
  children: MyCodeLineElement[];
}

export interface MyCodeLineElement extends TElement {
  type: typeof ELEMENT_CODE_LINE;
  children: PlainText[];
}

export interface MyTableElement extends TTableElement, MyBlockElement {
  type: typeof ELEMENT_TABLE;
  children: MyTableRowElement[];
}

export interface MyTableRowElement extends TElement {
  type: typeof ELEMENT_TR;
  children: MyTableCellElement[];
}

export interface MyTableCellElement extends TElement {
  type: typeof ELEMENT_TD;
  children: MyNestableBlock[];
}

export interface MyBulletedListElement extends TElement, MyBlockElement {
  type: typeof ElementTypes.ELEMENT_UL;
  children: MyListItemElement[];
}

export interface MyNumberedListElement extends TElement, MyBlockElement {
  type: typeof ElementTypes.ELEMENT_OL;
  children: MyListItemElement[];
}

export interface MyListItemElement extends TElement, MyBlockElement {
  type: typeof ElementTypes.ELEMENT_LI;
  children: MyInlineChildren;
}

export interface MyTodoListElement extends TTodoListItemElement, MyBlockElement {
  type: typeof ElementTypes.ELEMENT_TODO_LI;
  children: MyInlineChildren;
}

export interface MyMediaEmbedElement extends TMediaEmbedElement, MyBlockElement {
  type: typeof ELEMENT_MEDIA_EMBED;
  children: [EmptyText];
}

export interface MyHrElement extends MyBlockElement {
  type: typeof ElementTypes.ELEMENT_HR;
  children: [EmptyText];
}

export type MyNestableBlock = MyParagraphElement;

export type MyBlock = Exclude<MyElement, MyInlineElement>;
export type MyBlockEntry = TNodeEntry<MyBlock>;

export type MyRootBlock =
  | MyParagraphElement
  | MyH1Element
  | MyH2Element
  | MyH3Element
  | MyBlockquoteElement
  | MyCodeBlockElement
  | MyTableElement
  | MyBulletedListElement
  | MyNumberedListElement
  | MyTodoListElement
  | MyMediaEmbedElement
  | MyHrElement;

export type MyValue = MyRootBlock[];

/**
 * Editor types
 */

export type MyEditor = PlateEditor<MyValue> & { isDragging?: boolean };
export type MyReactEditor = TReactEditor<MyValue>;
export type MyNode = ENode<MyValue>;
export type MyNodeEntry = ENodeEntry<MyValue>;
export type MyElement = EElement<MyValue>;
export type MyElementEntry = EElementEntry<MyValue>;
export type MyText = EText<MyValue>;
export type MyTextEntry = ETextEntry<MyValue>;
export type MyElementOrText = EElementOrText<MyValue>;
export type MyDescendant = EDescendant<MyValue>;
export type MyMarks = EMarks<MyValue>;
export type MyMark = keyof MyMarks;

/**
 * Plate types
 */

export type MyDecorate<P = PluginOptions> = Decorate<P, MyValue, MyEditor>;
export type MyDecorateEntry = DecorateEntry<MyValue>;
export type MyDOMHandler<P = PluginOptions> = DOMHandler<P, MyValue, MyEditor>;
export type MyInjectComponent = InjectComponent<MyValue>;
export type MyInjectProps = InjectProps<MyValue>;
export type MyKeyboardHandler<P = PluginOptions> = KeyboardHandler<P, MyValue, MyEditor>;
export type MyOnChange<P = PluginOptions> = OnChange<P, MyValue, MyEditor>;
export type MyOverrideByKey = OverrideByKey<MyValue, MyEditor>;
export type MyPlatePlugin<P = PluginOptions> = PlatePlugin<P, MyValue, MyEditor>;
export type MyPlatePluginInsertData = PlatePluginInsertData<MyValue>;
export type MyPlatePluginProps = PlatePluginProps<MyValue>;
export type MyPlateProps = PlateProps<MyValue, MyEditor>;
export type MySerializeHtml = SerializeHtml<MyValue>;
export type MyWithOverride<P = PluginOptions> = WithOverride<P, MyValue, MyEditor>;

/**
 * Plate store, Slate context
 */

export const getMyEditor = (editor: MyEditor) => getTEditor<MyValue, MyEditor>(editor);
export const useMyEditorRef = () => useEditorRef<MyValue, MyEditor>();
export const useMyEditorState = () => useEditorState<MyValue, MyEditor>();
export const useMyPlateEditorRef = (id?: PlateId) => usePlateEditorRef<MyValue, MyEditor>(id);
export const useMyPlateEditorState = (id?: PlateId) => usePlateEditorState<MyValue, MyEditor>(id);
export const useMyPlateSelectors = (id?: PlateId) => usePlateSelectors<MyValue, MyEditor>(id);
export const useMyPlateActions = (id?: PlateId) => usePlateActions<MyValue, MyEditor>(id);
export const useMyPlateStates = (id?: PlateId) => usePlateStates<MyValue, MyEditor>(id);

/**
 * Utils
 */
export const createMyEditor = () => createTEditor() as MyEditor;
export const createMyPlateEditor = (options: CreatePlateEditorOptions<MyValue, MyEditor> = {}) =>
  createPlateEditor<MyValue, MyEditor>(options);
export const createMyPluginFactory = <P = PluginOptions>(defaultPlugin: PlatePlugin<NoInfer<P>, MyValue, MyEditor>) =>
  createPluginFactory(defaultPlugin);
export const createMyPlugins = (
  plugins: MyPlatePlugin[],
  options?: {
    components?: Record<string, PlatePluginComponent>;
    overrideByKey?: MyOverrideByKey;
  }
) => createPlugins<MyValue, MyEditor>(plugins, options);

export type MyAutoformatRule = AutoformatRule<MyValue, MyEditor>;
