import React from 'react';
import { getPluginType, ListToolbarButton } from '@udecode/plate';

import BulletedListIcon from 'components/RichTextPlate/icons/BulletedListIcon';
import NumberedListIcon from 'components/RichTextPlate/icons/NumberedListIcon';
import { ElementTypes, useMyPlateEditorRef } from '../../typescript/plateTypes';

export const ListToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <ListToolbarButton type={getPluginType(editor, ElementTypes.ELEMENT_UL)} icon={<BulletedListIcon />} />
      <ListToolbarButton type={getPluginType(editor, ElementTypes.ELEMENT_OL)} icon={<NumberedListIcon />} />
    </>
  );
};
