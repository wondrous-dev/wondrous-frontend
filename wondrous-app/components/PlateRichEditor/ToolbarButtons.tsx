import React from 'react';
import { EmojiToolbarDropdown, KEY_EMOJI, LinkToolbarButton } from '@udecode/plate';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

import { ListToolbarButtons } from 'components/PlateRichEditor/plugins/ListToolbarButtons';
import { BasicMarkToolbarButtons } from 'components/PlateRichEditor/plugins/BasicMarkToolbarButtons';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import AddImageIcon from 'components/PlateRichEditor/icons/AddImageIcon';
import { BlockQuoteElementToolbarButtons } from 'components/PlateRichEditor/plugins/basicElements/BlockQuoteElementToolbarButtons';
import { MediaUploadButton, VerticalDivider } from 'components/PlateRichEditor/styles';
import { BasicElementToolbarButtons } from './plugins/basicElements/BasicElementToolbarButtons';

export const ToolbarButtons = ({ mediaUploads }) => (
  <>
    <BasicElementToolbarButtons />
    <VerticalDivider />
    <BasicMarkToolbarButtons />
    <VerticalDivider />
    <ListToolbarButtons />
    <VerticalDivider />
    <LinkToolbarButton icon={<LinkIcon />} />
    <MediaUploadButton type="button" onClick={mediaUploads}>
      <AddImageIcon />
    </MediaUploadButton>
    <VerticalDivider />
    <BlockQuoteElementToolbarButtons />
    <EmojiToolbarDropdown pluginKey={KEY_EMOJI} icon={<EmojiEmotionsOutlinedIcon />} />
  </>
);
