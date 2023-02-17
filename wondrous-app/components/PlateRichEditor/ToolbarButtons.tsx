import React from 'react';
import { KEY_EMOJI, LinkToolbarButton, setNodes, TTodoListItemElement } from '@udecode/plate';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import { usePlateEditorRef } from '@udecode/plate-core';

import { ListToolbarButtons } from 'components/PlateRichEditor/plugins/ListToolbarButtons';
import { BasicMarkToolbarButtons } from 'components/PlateRichEditor/plugins/BasicMarkToolbarButtons';
import LinkIcon from 'components/PlateRichEditor/icons/LinkIcon';
import AddImageIcon from 'components/PlateRichEditor/icons/AddImageIcon';
import { BlockQuoteElementToolbarButtons } from 'components/PlateRichEditor/plugins/basicElements/BlockQuoteElementToolbarButtons';
import { ToolbarButton, VerticalDivider } from 'components/PlateRichEditor/styles';
import { ElementTypes } from 'components/PlateRichEditor/types';
import TodoListIcon from 'components/PlateRichEditor/icons/TodoListIcon';
import { BasicElementToolbarButtons } from './plugins/basicElements/BasicElementToolbarButtons';

export const ToolbarButtons = ({ mediaUploads }) => {
  const editor = usePlateEditorRef();

  return (
    <>
      <BasicElementToolbarButtons />
      <VerticalDivider />
      <BasicMarkToolbarButtons />
      <VerticalDivider />
      <ListToolbarButtons />
      <ToolbarButton
        type="button"
        onClick={() => setNodes<TTodoListItemElement>(editor, { type: ElementTypes.ELEMENT_TODO_LI })}
      >
        <TodoListIcon />
      </ToolbarButton>
      <VerticalDivider />
      <LinkToolbarButton icon={<LinkIcon />} />
      <ToolbarButton type="button" onClick={mediaUploads}>
        <AddImageIcon />
      </ToolbarButton>
      <VerticalDivider />
      <BlockQuoteElementToolbarButtons />
      {/*<EmojiToolbarDropdown pluginKey={KEY_EMOJI} icon={<EmojiEmotionsOutlinedIcon />} />*/}
    </>
  );
};
