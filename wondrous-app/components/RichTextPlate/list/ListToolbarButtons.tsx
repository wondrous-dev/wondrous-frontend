import React from 'react';
import { ELEMENT_OL, ELEMENT_UL, getPluginType, ListToolbarButton } from '@udecode/plate';

import BulletedListIcon from 'components/RichTextPlate/icons/BulletedListIcon';
import NumberedListIcon from 'components/RichTextPlate/icons/NumberedListIcon';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

export const ListToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <ListToolbarButton type={getPluginType(editor, ELEMENT_UL)} icon={<BulletedListIcon />} />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_OL)} icon={<NumberedListIcon />} />
    </>
  );
};
