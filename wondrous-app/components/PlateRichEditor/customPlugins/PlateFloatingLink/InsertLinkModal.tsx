import React, { useEffect, useState } from 'react';
import { useFloatingLinkSelectors, floatingLinkActions, submitFloatingLink, useEditorRef } from '@udecode/plate';
import isUrl from 'is-url';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { Button as CommonButton } from 'components/Common/button';
import { LinkModal, LinkModalInput, LinkModalTitle } from './styles';

const InsertLinkModal: React.FC<{
  initialLinkText?: string;
}> = ({ initialLinkText }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkUrlError, setLinkUrlError] = useState('');
  const [linkText, setLinkText] = useState(initialLinkText);
  const [linkTextError, setLinkTextError] = useState('');
  const selectors = useFloatingLinkSelectors();
  const editor = useEditorRef();
  const mode = selectors.mode();
  const isEditing = selectors.isEditing();
  const url = selectors.url();
  const text = selectors.text();
  const open = (mode === 'edit' && isEditing) || mode === 'insert';

  useEffect(() => {
    setLinkUrl(url);
    setLinkText(text);
  }, [mode, url, text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let invalid = false;

    if (!linkText?.trim()) {
      invalid = true;
      setLinkTextError('Please enter link text');
    }

    if (!isUrl(linkUrl)) {
      invalid = true;
      setLinkUrlError('Please enter valid URL');
    }

    if (!invalid) {
      floatingLinkActions.url(linkUrl);
      floatingLinkActions.text(linkText.trim());

      submitFloatingLink(editor);

      setLinkUrl('');
      setLinkText('');
      floatingLinkActions.hide();
    }
  };

  return (
    <Modal open={open}>
      <form onSubmit={handleSubmit}>
        <LinkModal>
          <LinkModalTitle>Link settings</LinkModalTitle>
          <LinkModalInput
            placeholder="URL"
            error={!!linkUrlError}
            helperText={linkUrlError}
            value={linkUrl}
            onChange={(e) => {
              setLinkUrlError('');
              setLinkUrl(e.target.value);
            }}
            autoFocus
          />
          <LinkModalInput
            placeholder="Link text"
            error={!!linkTextError}
            helperText={linkTextError}
            value={linkText}
            onChange={(e) => {
              setLinkTextError('');
              setLinkText(e.target.value);
            }}
          />

          <Box
            sx={{
              display: 'grid',
              gridGap: '8px',
              gridAutoFlow: 'column',
            }}
          >
            <CommonButton type="submit" highlighted>
              Save
            </CommonButton>
            <CommonButton onClick={() => floatingLinkActions.hide()}>Cancel</CommonButton>
          </Box>
        </LinkModal>
      </form>
    </Modal>
  );
};

export default InsertLinkModal;
