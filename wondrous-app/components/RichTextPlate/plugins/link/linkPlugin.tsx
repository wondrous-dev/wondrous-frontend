import { RenderAfterEditable, LinkPlugin } from '@udecode/plate';

import { PlateFloatingLink } from 'components/RichTextPlate/customPlugins/PlateFloatingLink';
import { CustomPlatePlugin, TextEditorValue } from '../../types';

export const linkPlugin: Partial<CustomPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as RenderAfterEditable<TextEditorValue>,
};
