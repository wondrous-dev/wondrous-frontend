import React from 'react';
import { TEditableProps } from '@udecode/plate-core';

import { FloatingVerticalDivider } from '@udecode/plate-ui-toolbar';
import {
  LaunchIcon,
  LinkOffIcon,
  ShortTextIcon,
  useFloatingLinkSelectors,
} from 'components/RichTextPlate/custom-components/CustomLink';
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
} from 'components/RichTextPlate/custom-components/ui/nodes/link/styles';

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
