import { PlateFloatingLink } from 'components/RichTextPlate/customPlugins/ui/link';
import { RenderAfterEditable } from '@udecode/plate';
import { LinkPlugin } from 'components/RichTextPlate/customPlugins/CustomLink';
import { MyPlatePlugin, MyValue } from '../../typescript/plateTypes';

export const linkPlugin: Partial<MyPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as RenderAfterEditable<MyValue>,
};
