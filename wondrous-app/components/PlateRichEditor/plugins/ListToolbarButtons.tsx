import React from 'react';
import { getPluginType, ListToolbarButton } from '@udecode/plate';

import BulletedListIcon from 'components/PlateRichEditor/icons/BulletedListIcon';
import NumberedListIcon from 'components/PlateRichEditor/icons/NumberedListIcon';
import { ElementTypes, useMyPlateEditorRef } from '../types';

export const ListToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <ListToolbarButton type={getPluginType(editor, ElementTypes.ELEMENT_UL)} icon={<BulletedListIcon />} />
      <ListToolbarButton type={getPluginType(editor, ElementTypes.ELEMENT_OL)} icon={<NumberedListIcon />} />
    </>
  );
};
