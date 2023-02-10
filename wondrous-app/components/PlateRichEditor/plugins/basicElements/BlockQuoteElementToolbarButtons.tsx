import React from 'react';
import { BlockToolbarButton, getPluginType, useEventPlateId } from '@udecode/plate';

import AddQuoteIcon from 'components/PlateRichEditor/icons/AddQuoteIcon';
import { ElementTypes, useMyPlateEditorRef } from '../../types';

export const BlockQuoteElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef(useEventPlateId());

  return <BlockToolbarButton type={getPluginType(editor, ElementTypes.ELEMENT_BLOCKQUOTE)} icon={<AddQuoteIcon />} />;
};
