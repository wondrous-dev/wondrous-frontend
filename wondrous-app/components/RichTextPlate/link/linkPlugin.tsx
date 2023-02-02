import { PlateFloatingLink } from 'components/RichTextPlate/custom-components/ui/nodes/link';
import { RenderAfterEditable } from '@udecode/plate';
import { LinkPlugin } from 'components/RichTextPlate/custom-components/CustomLink';
import { MyPlatePlugin, MyValue } from '../typescript/plateTypes';

export const linkPlugin: Partial<MyPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as RenderAfterEditable<MyValue>,
};
