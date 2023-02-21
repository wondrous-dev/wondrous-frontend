import { getPluginType, PlateEditor, TNode, Value } from '@udecode/plate-core';

import { ElementTypes } from 'components/PlateRichEditor/types';
import { TMentionInputElement } from '../types';

export const isNodeMentionInput = <V extends Value>(
  editor: PlateEditor<V>,
  node: TNode
): node is TMentionInputElement => node.type === getPluginType(editor, ElementTypes.ELEMENT_MENTION_INPUT);
