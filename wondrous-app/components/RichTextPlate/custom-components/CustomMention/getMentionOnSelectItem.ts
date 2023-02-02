import {
  comboboxActions,
  ComboboxOnSelectItem,
  comboboxSelectors,
  Data,
  NoData,
  TComboboxItem,
} from '@udecode/plate-combobox';
import {
  getBlockAbove,
  getPlugin,
  insertNodes,
  insertText,
  isEndPoint,
  moveSelection,
  PlatePluginKey,
  removeNodes,
  select,
  TNodeProps,
  withoutMergingHistory,
  withoutNormalizing,
} from '@udecode/plate-core';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LINK,
  ELEMENT_OL,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  toggleList,
  toggleMark,
  toggleNodeType,
} from '@udecode/plate';

import { triggerFloatingLink } from 'components/RichTextPlate/custom-components/CustomLink';
import { CustomElements } from 'components/RichTextPlate/typescript/plateTypes';
import { ELEMENT_MENTION, ELEMENT_MENTION_INPUT } from './createMentionPlugin';
import { MentionPlugin, TMentionElement } from './types';

export interface CreateMentionNode<TData extends Data> {
  (item: TComboboxItem<TData>, meta: CreateMentionNodeMeta): TNodeProps<TMentionElement>;
}

export interface CreateMentionNodeMeta {
  search: string;
}

export const getMentionOnSelectItem =
  <TData extends Data = NoData>({ key = ELEMENT_MENTION }: PlatePluginKey = {}): ComboboxOnSelectItem<TData> =>
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
          match: (node) => node.type === ELEMENT_MENTION_INPUT,
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
        case ELEMENT_H1:
          toggleNodeType(editor, { activeType: ELEMENT_H1 });
          break;
        case ELEMENT_H2:
          toggleNodeType(editor, { activeType: ELEMENT_H2 });
          break;
        case ELEMENT_H3:
          toggleNodeType(editor, { activeType: ELEMENT_H3 });
          break;
        case MARK_BOLD:
          toggleMark(editor, { key: MARK_BOLD as any });
          break;
        case MARK_ITALIC:
          toggleMark(editor, { key: MARK_ITALIC as any });
          break;
        case MARK_UNDERLINE:
          toggleMark(editor, { key: MARK_UNDERLINE as any });
          break;
        case MARK_STRIKETHROUGH:
          toggleMark(editor, { key: MARK_STRIKETHROUGH as any });
          break;
        case ELEMENT_UL:
          toggleList(editor, { type: ELEMENT_UL });
          break;
        case ELEMENT_OL:
          toggleList(editor, { type: ELEMENT_OL });
          break;
        case ELEMENT_LINK:
          triggerFloatingLink(editor, { focused: true });
          break;
        case CustomElements.Image:
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) {
            input.click();
          }
          break;
        case ELEMENT_BLOCKQUOTE:
          toggleNodeType(editor, { activeType: ELEMENT_BLOCKQUOTE });
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
