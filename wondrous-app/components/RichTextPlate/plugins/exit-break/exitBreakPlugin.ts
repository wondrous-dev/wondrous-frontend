import { ExitBreakPlugin, KEYS_HEADING } from '@udecode/plate';
import { CustomPlatePlugin } from '../../typescript/plateTypes';

export const exitBreakPlugin: Partial<CustomPlatePlugin<ExitBreakPlugin>> = {
  options: {
    rules: [
      {
        hotkey: 'mod+enter',
      },
      {
        hotkey: 'mod+shift+enter',
        before: true,
      },
      {
        hotkey: 'enter',
        query: {
          start: true,
          end: true,
          allow: KEYS_HEADING,
        },
        relative: true,
        level: 1,
      },
    ],
  },
};
