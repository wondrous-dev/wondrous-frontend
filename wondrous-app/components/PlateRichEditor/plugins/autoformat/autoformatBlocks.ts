import { insertNodes, setNodes } from '@udecode/plate';

import { ElementTypes, CustomAutoformatRule } from '../../types';
import { preFormat } from './autoformatUtils';

export const autoformatBlocks: CustomAutoformatRule[] = [
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_H1,
    match: '# ',
    preFormat,
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_H2,
    match: '## ',
    preFormat,
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_H3,
    match: '### ',
    preFormat,
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_BLOCKQUOTE,
    match: '> ',
    preFormat,
  },
  {
    mode: 'block',
    type: ElementTypes.ELEMENT_HR,
    match: ['---', '—-', '___ '],
    format: (editor) => {
      setNodes(editor, { type: ElementTypes.ELEMENT_HR });
      insertNodes(editor, {
        type: ElementTypes.ELEMENT_DEFAULT,
        children: [{ text: '' }],
      });
    },
  },
];
