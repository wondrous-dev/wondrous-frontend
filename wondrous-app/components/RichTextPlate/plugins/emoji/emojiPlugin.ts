import { EmojiCombobox, EmojiPlugin, RenderAfterEditable } from '@udecode/plate';
import { CustomPlatePlugin, TextEditorValue } from '../../types';

export const emojiPlugin: Partial<CustomPlatePlugin<EmojiPlugin>> = {
  renderAfterEditable: EmojiCombobox as RenderAfterEditable<TextEditorValue>,
};
