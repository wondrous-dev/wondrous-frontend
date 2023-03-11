import {
  comboboxActions,
  ComboboxOnSelectItem,
  comboboxSelectors,
  Data,
  getBlockAbove,
  getPlugin,
  insertNodes,
  insertText,
  isEndPoint,
  moveSelection,
  NoData,
  PlatePluginKey,
  removeNodes,
  select,
  setNodes,
  TComboboxItem,
  TNodeProps,
  toggleList,
  toggleMark,
  toggleNodeType,
  triggerFloatingLink,
  TTodoListItemElement,
  withoutMergingHistory,
  withoutNormalizing,
} from '@udecode/plate';

import { ElementTypes } from 'components/PlateRichEditor/types';
import { MentionPlugin, TMentionElement } from './types';

export interface CreateMentionNode<TData extends Data> {
  (item: TComboboxItem<TData>, meta: CreateMentionNodeMeta): TNodeProps<TMentionElement>;
}

export interface CreateMentionNodeMeta {
  search: string;
}

export const getMentionOnSelectItem =
  <TData extends Data = NoData>({
    key = ElementTypes.ELEMENT_MENTION,
  }: PlatePluginKey = {}): ComboboxOnSelectItem<TData> =>
  (editor, item) => {
    const targetRange = comboboxSelectors.targetRange();
    if (!targetRange) return;

    const {
      type,
      options: { insertSpaceAfterMention, createMentionNode },
    } = getPlugin<MentionPlugin>(editor as any, key);

    const pathAbove = getBlockAbove(editor)?.[1];
    const isBlockEnd = () => editor.selection && pathAbove && isEndPoint(editor, editor.selection.anchor, pathAbove);

    withoutNormalizing(editor, () => {
      // Selectors are sensitive to operations, it's better to create everything
      // before the editor state is changed. For example, asking for text after
      // removeNodes below will return null.
      const props = createMentionNode!(item, {
        search: comboboxSelectors.text() ?? '',
      });

      select(editor, targetRange);

      withoutMergingHistory(editor, () =>
        removeNodes(editor, {
          match: (node) => node.type === ElementTypes.ELEMENT_MENTION_INPUT,
        })
      );

      insertNodes<TMentionElement>(editor, {
        type,
        children: [{ text: '' }],
        id: item.key,
        ...props,
      } as TMentionElement);

      // move the selection after the element
      moveSelection(editor, { unit: 'offset' });

      switch (item.key) {
        case ElementTypes.ELEMENT_H1:
          toggleNodeType(editor, { activeType: ElementTypes.ELEMENT_H1 });
          break;
        case ElementTypes.ELEMENT_H2:
          toggleNodeType(editor, { activeType: ElementTypes.ELEMENT_H2 });
          break;
        case ElementTypes.ELEMENT_H3:
          toggleNodeType(editor, { activeType: ElementTypes.ELEMENT_H3 });
          break;
        case ElementTypes.MARK_BOLD:
          toggleMark(editor, { key: ElementTypes.MARK_BOLD as any });
          break;
        case ElementTypes.MARK_ITALIC:
          toggleMark(editor, { key: ElementTypes.MARK_ITALIC as any });
          break;
        case ElementTypes.MARK_UNDERLINE:
          toggleMark(editor, { key: ElementTypes.MARK_UNDERLINE as any });
          break;
        case ElementTypes.MARK_STRIKETHROUGH:
          toggleMark(editor, { key: ElementTypes.MARK_STRIKETHROUGH as any });
          break;
        case ElementTypes.MARK_CODE:
          toggleMark(editor, { key: ElementTypes.MARK_CODE as any });
          break;
        case ElementTypes.ELEMENT_UL:
          toggleList(editor, { type: ElementTypes.ELEMENT_UL });
          break;
        case ElementTypes.ELEMENT_OL:
          toggleList(editor, { type: ElementTypes.ELEMENT_OL });
          break;
        case ElementTypes.ELEMENT_TODO_LI:
          setNodes<TTodoListItemElement>(editor, { type: ElementTypes.ELEMENT_TODO_LI });
          break;
        case ElementTypes.ELEMENT_LINK:
          triggerFloatingLink(editor, { focused: true });
          break;
        case ElementTypes.ELEMENT_IMAGE:
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) {
            input.click();
          }
          break;
        case ElementTypes.ELEMENT_BLOCKQUOTE:
          toggleNodeType(editor, { activeType: ElementTypes.ELEMENT_BLOCKQUOTE });
          break;
        default:
          break;
      }

      if (isBlockEnd() && insertSpaceAfterMention) {
        insertText(editor, ' ');
      }
    });

    return comboboxActions.reset();
  };
