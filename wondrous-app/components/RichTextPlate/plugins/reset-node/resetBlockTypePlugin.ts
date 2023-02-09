import { isBlockAboveEmpty, isSelectionAtBlockStart, ResetNodePlugin } from '@udecode/plate';
import { ElementTypes, CustomPlatePlugin } from '../../types';

const resetBlockTypesCommonRule = {
  types: [ElementTypes.ELEMENT_BLOCKQUOTE, ElementTypes.ELEMENT_TODO_LI],
  defaultType: ElementTypes.ELEMENT_DEFAULT,
};

export const resetBlockTypePlugin: Partial<CustomPlatePlugin<ResetNodePlugin>> = {
  options: {
    rules: [
      {
        ...resetBlockTypesCommonRule,
        hotkey: 'Enter',
        predicate: isBlockAboveEmpty,
      },
      {
        ...resetBlockTypesCommonRule,
        hotkey: 'Backspace',
        predicate: isSelectionAtBlockStart,
      },
    ],
  },
};
