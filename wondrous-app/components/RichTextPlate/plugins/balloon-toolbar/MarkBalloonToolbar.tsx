import React, { ReactNode } from 'react';
import { TippyProps } from '@tippyjs/react';
import { BalloonToolbar, getPluginType, MarkToolbarButton } from '@udecode/plate';

import BoldIcon from 'components/RichTextPlate/icons/BoldIcon';
import ItalicIcon from 'components/RichTextPlate/icons/ItalicIcon';
import UnderlineIcon from 'components/RichTextPlate/icons/UnderlineIcon';
import StrikethroughIcon from 'components/RichTextPlate/icons/StrikethroughIcon';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import { ElementTypes, useMyPlateEditorRef } from '../../types';

export const markTooltip: TippyProps = {
  arrow: true,
  delay: 0,
  duration: [200, 0],
  hideOnClick: false,
  offset: [0, 17],
  placement: 'top',
  className: 'plate-tooltip',
};

export const MarkBalloonToolbar = ({ children }: { children?: ReactNode }) => {
  const editor = useMyPlateEditorRef();

  const arrow = false;
  const theme = 'dark';

  const boldTooltip: TippyProps = { content: 'Bold (⌘+B)', ...markTooltip };
  const italicTooltip: TippyProps = { content: 'Italic (⌘+I)', ...markTooltip };
  const underlineTooltip: TippyProps = {
    content: 'Underline (⌘+U)',
    ...markTooltip,
  };
  const linkTooltip: TippyProps = { content: 'Add Link (⌘+K)', ...markTooltip };

  return (
    <BalloonToolbar theme={theme} arrow={arrow}>
      <MarkToolbarButton
        type={getPluginType(editor, ElementTypes.MARK_BOLD)}
        icon={<BoldIcon />}
        tooltip={boldTooltip}
      />
      <MarkToolbarButton
        type={getPluginType(editor, ElementTypes.MARK_ITALIC)}
        icon={<ItalicIcon />}
        tooltip={italicTooltip}
      />
      <MarkToolbarButton
        type={getPluginType(editor, ElementTypes.MARK_UNDERLINE)}
        icon={<UnderlineIcon />}
        tooltip={underlineTooltip}
      />
      <MarkToolbarButton type={getPluginType(editor, ElementTypes.MARK_STRIKETHROUGH)} icon={<StrikethroughIcon />} />
      <MarkToolbarButton
        type={getPluginType(editor, ElementTypes.ELEMENT_LINK)}
        icon={<LinkIcon />}
        tooltip={linkTooltip}
      />
    </BalloonToolbar>
  );
};
