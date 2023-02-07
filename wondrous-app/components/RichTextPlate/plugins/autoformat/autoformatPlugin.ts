import { AutoformatPlugin } from '@udecode/plate';

import { CustomEditor, CustomPlatePlugin, TextEditorValue } from '../../typescript/plateTypes';
import { autoformatRules } from './autoformatRules';

export const autoformatPlugin: Partial<CustomPlatePlugin<AutoformatPlugin<TextEditorValue, CustomEditor>>> = {
  options: {
    rules: autoformatRules as any,
    enableUndoOnDelete: true,
  },
};
