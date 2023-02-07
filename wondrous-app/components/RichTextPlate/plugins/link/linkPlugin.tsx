import { PlateFloatingLink } from 'components/RichTextPlate/customPlugins/ui/link';
import { RenderAfterEditable } from '@udecode/plate';
import { LinkPlugin } from 'components/RichTextPlate/customPlugins/CustomLink';
import { CustomPlatePlugin, TextEditorValue } from '../../typescript/plateTypes';

export const linkPlugin: Partial<CustomPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as RenderAfterEditable<TextEditorValue>,
};
