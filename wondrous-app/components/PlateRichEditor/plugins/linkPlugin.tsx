import { RenderAfterEditable, LinkPlugin } from '@udecode/plate';

import { PlateFloatingLink } from 'components/PlateRichEditor/customPlugins/PlateFloatingLink';
import { CustomPlatePlugin, TextEditorValue } from '../types';

export const linkPlugin: Partial<CustomPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as RenderAfterEditable<TextEditorValue>,
};
