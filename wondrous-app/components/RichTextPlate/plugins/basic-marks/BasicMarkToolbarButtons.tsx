import React from 'react';
import {
  getPluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  MarkToolbarButton,
} from '@udecode/plate';
import BoldIcon from 'components/RichTextPlate/icons/BoldIcon';
import ItalicIcon from 'components/RichTextPlate/icons/ItalicIcon';
import UnderlineIcon from 'components/RichTextPlate/icons/UnderlineIcon';
import StrikethroughIcon from 'components/RichTextPlate/icons/StrikethroughIcon';
import { useMyPlateEditorRef } from '../../typescript/plateTypes';

export const BasicMarkToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <MarkToolbarButton type={getPluginType(editor, MARK_BOLD)} icon={<BoldIcon />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_ITALIC)} icon={<ItalicIcon />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_UNDERLINE)} icon={<UnderlineIcon />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_STRIKETHROUGH)} icon={<StrikethroughIcon />} />
      {/* <MarkToolbarButton type={getPluginType(editor, MARK_CODE)} icon={<CodeIcon />} /> */}
    </>
  );
};
