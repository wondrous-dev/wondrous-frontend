import React from 'react';
import { TEditableProps } from '@udecode/plate-core';
import { FloatingVerticalDivider } from '@udecode/plate-ui-toolbar';

import { useFloatingLinkSelectors } from 'components/RichTextPlate/customPlugins/CustomLink';
import LinkIcon from 'components/RichTextPlate/icons/LinkIcon';
import {
  FloatingHorizontalDivider,
  FloatingIconWrapper,
  FloatingInputWrapper,
  FloatingLinkEditButton,
  FloatingLinkEditRoot,
  FloatingLinkEditWrapper,
  FloatingLinkInsertRoot,
  FloatingLinkOpenLinkButton,
  FloatingLinkTextInput,
  FloatingLinkUnlinkButton,
  FloatingLinkUrlInput,
  FloatingMainWrapper,
} from 'components/RichTextPlate/customPlugins/ui/link/styles';
import { ShortTextIcon } from 'components/RichTextPlate/icons/ShortTextIcon';
import { LaunchIcon } from 'components/RichTextPlate/icons/LaunchIcon';
import { LinkOffIcon } from 'components/RichTextPlate/icons/LinkOffIcon';

export const PlateFloatingLink = ({ readOnly }: TEditableProps) => {
  const isEditing = useFloatingLinkSelectors().isEditing();

  if (readOnly) return null;

  const input = (
    <FloatingMainWrapper>
      <FloatingInputWrapper>
        <FloatingIconWrapper>
          <LinkIcon style={{ width: '18px', height: '18px' }} />
        </FloatingIconWrapper>

        <FloatingLinkUrlInput placeholder="Paste link" />
      </FloatingInputWrapper>

      <FloatingHorizontalDivider />

      <FloatingInputWrapper>
        <FloatingIconWrapper>
          <ShortTextIcon width={18} />
        </FloatingIconWrapper>
        <FloatingLinkTextInput placeholder="Text to display" />
      </FloatingInputWrapper>
    </FloatingMainWrapper>
  );

  const editContent = !isEditing ? (
    <FloatingLinkEditWrapper>
      <FloatingLinkEditButton>Edit link</FloatingLinkEditButton>

      <FloatingVerticalDivider />

      <FloatingLinkOpenLinkButton>
        <LaunchIcon width={18} />
      </FloatingLinkOpenLinkButton>

      <FloatingVerticalDivider />

      <FloatingLinkUnlinkButton type="button">
        <LinkOffIcon width={18} />
      </FloatingLinkUnlinkButton>
    </FloatingLinkEditWrapper>
  ) : (
    input
  );

  return (
    <>
      <FloatingLinkInsertRoot>{input}</FloatingLinkInsertRoot>

      <FloatingLinkEditRoot>{editContent}</FloatingLinkEditRoot>
    </>
  );
};
