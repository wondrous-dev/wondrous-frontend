import { Range } from 'slate';
import { ReactEditor } from 'slate-react';

import { CustomEditor } from '../types';

/**
 * Get bounding client rect by slate range
 */
export const getRangeBoundingClientRect = (editor: CustomEditor, at: Range | null) => {
  if (!at) return;

  const domRange = ReactEditor.toDOMRange(editor, at);
  if (!domRange) return;

  return domRange.getBoundingClientRect();
};
