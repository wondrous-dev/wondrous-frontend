import { getPluginType, PlateEditor, TText, Value } from '@udecode/plate-core';

import { ElementTypes } from 'components/RichTextPlate/typescript/plateTypes';
import { TLinkElement } from '../types';

export interface CreateLinkNodeOptions {
  url: string;
  text?: string;
  target?: string;
  children?: TText[];
}

export const createLinkNode = <V extends Value>(
  editor: PlateEditor<V>,
  { url, text = '', target, children }: CreateLinkNodeOptions
): TLinkElement => {
  const type = getPluginType(editor, ElementTypes.ELEMENT_LINK);

  return {
    type,
    url,
    target,
    children: children ?? [{ text }],
  };
};
