import { RenderAfterEditable, LinkPlugin, PlateFloatingLink } from '@udecode/plate';
import { CustomPlatePlugin, TextEditorValue } from '../../types';

export const linkPlugin: Partial<CustomPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as RenderAfterEditable<TextEditorValue>,
};
