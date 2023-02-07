import { EmojiCombobox, EmojiPlugin, RenderAfterEditable } from '@udecode/plate';
import { CustomPlatePlugin, TextEditorValue } from '../../typescript/plateTypes';

export const emojiPlugin: Partial<CustomPlatePlugin<EmojiPlugin>> = {
  renderAfterEditable: EmojiCombobox as RenderAfterEditable<TextEditorValue>,
};
