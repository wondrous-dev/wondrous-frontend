import React from 'react';
import { getPluginType, MarkToolbarButton } from '@udecode/plate';

import BoldIcon from 'components/PlateRichEditor/icons/BoldIcon';
import ItalicIcon from 'components/PlateRichEditor/icons/ItalicIcon';
import UnderlineIcon from 'components/PlateRichEditor/icons/UnderlineIcon';
import StrikethroughIcon from 'components/PlateRichEditor/icons/StrikethroughIcon';
import { ElementTypes, useMyPlateEditorRef } from '../types';

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
