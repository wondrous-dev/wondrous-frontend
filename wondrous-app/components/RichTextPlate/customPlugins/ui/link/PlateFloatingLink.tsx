import React from 'react';
import { TEditableProps, useEditorRef } from '@udecode/plate-core';
import { FloatingVerticalDivider } from '@udecode/plate-ui-toolbar';
import { Box } from '@mui/system';

import {
  floatingLinkActions,
  floatingLinkSelectors,
  submitFloatingLink,
  useFloatingLinkSelectors,
} from 'components/RichTextPlate/customPlugins/CustomLink';
import LinkIcon from 'components/RichTextPlate/icons/LinkIcon';
import {
  ErrorMessage,
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
  InputContainer,
} from 'components/RichTextPlate/customPlugins/ui/link/styles';
import { ShortTextIcon } from 'components/RichTextPlate/icons/ShortTextIcon';
import { LaunchIcon } from 'components/RichTextPlate/icons/LaunchIcon';
import { LinkOffIcon } from 'components/RichTextPlate/icons/LinkOffIcon';
import { Button as CommonButton } from 'components/Common/button';

export const PlateFloatingLink = ({ readOnly }: TEditableProps) => {
  const isEditing = useFloatingLinkSelectors().isEditing();

  const editor = useEditorRef();

  const errorUrl = floatingLinkSelectors.errorMessageUrl();
  const errorText = floatingLinkSelectors.errorMessageText();

  if (readOnly) return null;

  const buttonStyle = {
    height: '32px',
    minHeight: '32px',
  };

  const buttonInnerStyle = {
    fontSize: '14px',
  };

  const input = (
    <FloatingMainWrapper>
      <InputContainer>
        <FloatingInputWrapper>
          <FloatingIconWrapper>
            <LinkIcon style={{ width: '18px', height: '18px', padding: '3px' }} />
          </FloatingIconWrapper>

          <FloatingLinkUrlInput placeholder="URL" />
        </FloatingInputWrapper>
        {errorUrl ? <ErrorMessage>Please enter valid URL</ErrorMessage> : null}
      </InputContainer>

      <InputContainer>
        <FloatingInputWrapper>
          <FloatingIconWrapper>
            <ShortTextIcon width={18} />
          </FloatingIconWrapper>
          <FloatingLinkTextInput placeholder="Link text" />
        </FloatingInputWrapper>
        {errorText ? <ErrorMessage>Please enter link text</ErrorMessage> : null}
      </InputContainer>

      <Box
        sx={{
          display: 'grid',
          gridGap: '8px',
          gridAutoFlow: 'column',
          padding: '10px 10px 5px 10px',
        }}
      >
        <CommonButton
          highlighted
          type="button"
          onClick={() => submitFloatingLink(editor)}
          style={buttonStyle}
          buttonInnerStyle={buttonInnerStyle}
        >
          Save
        </CommonButton>
        <CommonButton
          type="button"
          onClick={() => floatingLinkActions.hide()}
          style={buttonStyle}
          buttonInnerStyle={buttonInnerStyle}
        >
          Cancel
        </CommonButton>
      </Box>
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
