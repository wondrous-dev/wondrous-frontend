import React from 'react';
import {
  TEditableProps,
  FloatingLink,
  LaunchIcon,
  LinkOffIcon,
  useFloatingLinkSelectors,
  floatingRowCss,
  FloatingVerticalDivider,
} from '@udecode/plate';

import InsertLinkModal from 'components/RichTextPlate/customPlugins/PlateFloatingLink/InsertLinkModal';
import { FloatingRow } from 'components/RichTextPlate/customPlugins/PlateFloatingLink/styles';

export const PlateFloatingLink = ({ readOnly }: TEditableProps) => {
  const isEditing = useFloatingLinkSelectors().isEditing();

  if (readOnly) return null;

  const editContent = !isEditing && (
    <FloatingRow css={floatingRowCss}>
      <FloatingLink.EditButton type="button">Edit link</FloatingLink.EditButton>

      <FloatingVerticalDivider />

      <FloatingLink.OpenLinkButton>
        <LaunchIcon width={18} />
      </FloatingLink.OpenLinkButton>

      <FloatingVerticalDivider />

      <FloatingLink.UnlinkButton type="button">
        <LinkOffIcon width={18} />
      </FloatingLink.UnlinkButton>
    </FloatingRow>
  );

  return (
    <>
      <InsertLinkModal />
      <FloatingLink.EditRoot>{editContent}</FloatingLink.EditRoot>
    </>
  );
};
