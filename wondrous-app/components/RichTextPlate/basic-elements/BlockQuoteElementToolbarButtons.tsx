import React from 'react';
import { BlockToolbarButton, ELEMENT_BLOCKQUOTE, getPluginType, useEventPlateId } from '@udecode/plate';

import AddQuoteIcon from 'components/RichTextPlate/icons/AddQuoteIcon';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

export const BlockQuoteElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef(useEventPlateId());

  return <BlockToolbarButton type={getPluginType(editor, ELEMENT_BLOCKQUOTE)} icon={<AddQuoteIcon />} />;
};
