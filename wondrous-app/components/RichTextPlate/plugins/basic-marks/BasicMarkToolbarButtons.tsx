import React from 'react';
import { getPluginType, MarkToolbarButton } from '@udecode/plate';

import BoldIcon from 'components/RichTextPlate/icons/BoldIcon';
import ItalicIcon from 'components/RichTextPlate/icons/ItalicIcon';
import UnderlineIcon from 'components/RichTextPlate/icons/UnderlineIcon';
import StrikethroughIcon from 'components/RichTextPlate/icons/StrikethroughIcon';
import { ElementTypes, useMyPlateEditorRef } from '../../types';

export const BasicMarkToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <MarkToolbarButton type={getPluginType(editor, ElementTypes.MARK_BOLD)} icon={<BoldIcon />} />
      <MarkToolbarButton type={getPluginType(editor, ElementTypes.MARK_ITALIC)} icon={<ItalicIcon />} />
      <MarkToolbarButton type={getPluginType(editor, ElementTypes.MARK_UNDERLINE)} icon={<UnderlineIcon />} />
      <MarkToolbarButton type={getPluginType(editor, ElementTypes.MARK_STRIKETHROUGH)} icon={<StrikethroughIcon />} />
    </>
  );
};
