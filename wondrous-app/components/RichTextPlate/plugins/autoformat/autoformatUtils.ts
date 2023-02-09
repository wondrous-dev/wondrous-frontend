import {
  AutoformatBlockRule,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  getParentNode,
  isElement,
  isType,
  toggleList,
  unwrapList,
} from '@udecode/plate';

import { CustomEditor, TextEditorValue } from '../../types';

export const preFormat: AutoformatBlockRule<TextEditorValue, CustomEditor>['preFormat'] = (editor) =>
  unwrapList(editor);

export const format = (editor: CustomEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParentNode(editor, editor.selection);
    if (!parentEntry) return;
    const [node] = parentEntry;
    if (isElement(node) && !isType(editor, node, ELEMENT_CODE_BLOCK) && !isType(editor, node, ELEMENT_CODE_LINE)) {
      customFormatting();
    }
  }
};

export const formatList = (editor: CustomEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    })
  );
};
