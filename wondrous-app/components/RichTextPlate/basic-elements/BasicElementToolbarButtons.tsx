import React from 'react';

import { BlockToolbarButton, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, getPluginType, useEventPlateId } from '@udecode/plate';
import { HeaderIcon } from 'components/RichText/icons/HeaderIcon';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

export const BasicElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef(useEventPlateId());

  return (
    <>
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon={<HeaderIcon title="H1" />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon={<HeaderIcon title="H2" />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon={<HeaderIcon title="H3" />} />
    </>
  );
};
