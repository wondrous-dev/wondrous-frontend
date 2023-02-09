import { findNode, FindNodeOptions, getPluginType, PlateEditor, Value } from '@udecode/plate-core';

import { ElementTypes } from 'components/RichTextPlate/types';
import { TMentionInputElement } from '../types';

export const findMentionInput = <V extends Value>(
  editor: PlateEditor<V>,
  options?: Omit<FindNodeOptions<V>, 'match'>
) =>
  findNode<TMentionInputElement>(editor, {
    ...options,
    match: { type: getPluginType(editor, ElementTypes.ELEMENT_MENTION_INPUT) },
  });
