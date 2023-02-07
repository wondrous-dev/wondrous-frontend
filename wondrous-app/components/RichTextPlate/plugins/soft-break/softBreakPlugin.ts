import { ELEMENT_TD, SoftBreakPlugin } from '@udecode/plate';

import { ElementTypes, CustomPlatePlugin } from '../../typescript/plateTypes';

export const softBreakPlugin: Partial<CustomPlatePlugin<SoftBreakPlugin>> = {
  options: {
    rules: [
      { hotkey: 'shift+enter' },
      {
        hotkey: 'enter',
        query: {
          allow: [ElementTypes.ELEMENT_BLOCKQUOTE, ELEMENT_TD],
        },
      },
    ],
  },
};
