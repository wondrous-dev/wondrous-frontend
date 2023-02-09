import React, { useEffect, useState } from 'react';
import { useFloatingLinkSelectors, floatingLinkActions, submitFloatingLink, useEditorRef } from '@udecode/plate';
import isUrl from 'is-url';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { Button as CommonButton } from 'components/Common/button';
import { LinkModal, LinkModalInput, LinkModalTitle } from './styles';

const InsertLinkModal: React.FC<{
  initialLinkText: string;
}> = ({ initialLinkText }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkUrlError, setLinkUrlError] = useState('Error');
  const [linkText, setLinkText] = useState(initialLinkText);
  const [linkTextError, setLinkTextError] = useState('Error');
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

  useEffect(() => {
    const onEscPress = (e) => {
      if (e.key === 'Escape') {
        floatingLinkActions.hide();
      }
    };

    document.addEventListener('keydown', onEscPress);

    return () => document.removeEventListener('keydown', onEscPress);
  }, []);

  useEffect(() => setLinkUrlError(''), [linkUrl]);
  useEffect(() => setLinkTextError(''), [linkText]);

  const submitLink = () => {
    let error = false;

    if (!linkText?.trim()) {
      error = true;
      setLinkTextError('Please enter link text');
    }

    if (!isUrl(linkUrl)) {
      error = true;
      setLinkUrlError('Please enter valid URL');
    }

    if (!error) {
      floatingLinkActions.url(linkUrl);
      floatingLinkActions.text(linkText.trim());

      submitFloatingLink(editor);

      setLinkUrl('');
      setLinkText('');
      floatingLinkActions.hide();
    }
  };

  return (
    <Modal open={open} onBackdropClick={() => floatingLinkActions.hide()}>
      <LinkModal>
        <LinkModalTitle>Link settings</LinkModalTitle>
        <LinkModalInput
          placeholder="URL"
          error={!!linkUrlError}
          helperText={linkUrlError}
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              floatingLinkActions.hide();
            }

            if (e.key === 'Enter') {
              submitLink();
            }
          }}
          autoFocus
        />
        <LinkModalInput
          placeholder="Link text"
          error={!!linkTextError}
          helperText={linkTextError}
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              floatingLinkActions.hide();
            }

            if (e.key === 'Enter') {
              submitLink();
            }
          }}
        />

        <Box
          sx={{
            display: 'grid',
            gridGap: '8px',
            gridAutoFlow: 'column',
          }}
        >
          <CommonButton highlighted onClick={submitLink}>
            Save
          </CommonButton>
          <CommonButton onClick={() => floatingLinkActions.hide()}>Cancel</CommonButton>
        </Box>
      </LinkModal>
    </Modal>
  );
};

export default InsertLinkModal;
