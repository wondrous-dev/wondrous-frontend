import { isBlock, setNodes, TTodoListItemElement } from '@udecode/plate';

import { ElementTypes, CustomAutoformatRule } from '../../typescript/plateTypes';
import { formatList, preFormat } from './autoformatUtils';

export const autoformatLists: CustomAutoformatRule[] = [
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_LI,
    match: ['* ', '- '],
    preFormat,
    format: (editor) => formatList(editor, ElementTypes.ELEMENT_UL),
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_LI,
    match: ['1. ', '1) '],
    preFormat,
    format: (editor) => formatList(editor, ElementTypes.ELEMENT_OL),
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_TODO_LI,
    match: '[] ',
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_TODO_LI,
    match: '[x] ',
    format: (editor) =>
      setNodes<TTodoListItemElement>(
        editor,
        { type: ElementTypes.ELEMENT_TODO_LI, checked: true },
        {
          match: (n) => isBlock(editor, n),
        }
      ),
  },
];
