import React from 'react';
import { BlockToolbarButton, getPluginType, useEventPlateId } from '@udecode/plate';

import AddQuoteIcon from 'components/RichTextPlate/icons/AddQuoteIcon';
import { ElementTypes, useMyPlateEditorRef } from '../../typescript/plateTypes';

export const BlockQuoteElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef(useEventPlateId());

  return <BlockToolbarButton type={getPluginType(editor, ElementTypes.ELEMENT_BLOCKQUOTE)} icon={<AddQuoteIcon />} />;
};
