import React from 'react';
import { EmojiToolbarDropdown, KEY_EMOJI } from '@udecode/plate';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

import { ListToolbarButtons } from 'components/RichTextPlate/plugins/list/ListToolbarButtons';
import { BasicMarkToolbarButtons } from 'components/RichTextPlate/plugins/basic-marks/BasicMarkToolbarButtons';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import AddImageIcon from 'components/RichTextPlate/icons/AddImageIcon';
import { BlockQuoteElementToolbarButtons } from 'components/RichTextPlate/plugins/basic-elements/BlockQuoteElementToolbarButtons';
import { MediaUploadButton, VerticalDivider } from 'components/RichTextPlate/styles';
import { LinkToolbarButton } from 'components/RichTextPlate/customPlugins/ui/link';
import { BasicElementToolbarButtons } from './plugins/basic-elements/BasicElementToolbarButtons';

export const ToolbarButtons = ({ mediaUploads }) => (
  <>
    <BasicElementToolbarButtons />
    <VerticalDivider />
    <BasicMarkToolbarButtons />
    <VerticalDivider />
    <ListToolbarButtons />
    <VerticalDivider />
    <LinkToolbarButton icon={<LinkIcon />} />
    <MediaUploadButton onClick={mediaUploads}>
      <AddImageIcon />
    </MediaUploadButton>
    <VerticalDivider />
    <BlockQuoteElementToolbarButtons />
    <EmojiToolbarDropdown pluginKey={KEY_EMOJI} icon={<EmojiEmotionsOutlinedIcon />} />
  </>
);
