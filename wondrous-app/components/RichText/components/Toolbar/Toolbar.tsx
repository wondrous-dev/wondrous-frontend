import isUrl from 'is-url';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { useSlate } from 'slate-react';
import React, { useEffect, useState } from 'react';
import { BaseRange, Editor, Range } from 'slate';

import { Button as CommonButton } from 'components/Common/button';
import EditorHelpers from 'components/RichText/helpers';
import { CustomEditor, MarkType, TogglabaleBlock } from 'components/RichText/types';
import BoldIcon from 'components/RichText/icons/BoldIcon';
import ItalicIcon from 'components/RichText/icons/ItalicIcon';
import UnderlineIcon from 'components/RichText/icons/UnderlineIcon';
import StrikethroughIcon from 'components/RichText/icons/StrikethroughIcon';
import BulletedListIcon from 'components/RichText/icons/BulletedListIcon';
import NumberedListIcon from 'components/RichText/icons/NumberedListIcon';
import H1Icon from 'components/RichText/icons/H1Icon';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import CodeIcon from 'components/RichText/icons/CodeIcon';
import { LinkModal, LinkModalInput, LinkModalTitle, ToolbarButton, ToolbarContainer } from './styles';

const InsertLinkModal: React.FC<{
  editor: CustomEditor;
  open: boolean;
  selectionOverride?: BaseRange;
  initialLinkText: string;
  onClose: () => void;
}> = ({ editor, open, selectionOverride, initialLinkText, onClose }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkUrlError, setLinkUrlError] = useState('Error');
  const [linkText, setLinkText] = useState(initialLinkText);
  const [linkTextError, setLinkTextError] = useState('Error');

  useEffect(() => {
    const onEscPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onEscPress);

    return () => document.removeEventListener('keydown', onEscPress);
  }, [onClose]);

  useEffect(() => setLinkUrlError(''), [linkUrl]);
  useEffect(() => setLinkTextError(''), [linkText]);

  const submitLink = () => {
    let error = false;

    if (!linkText.trim()) {
      error = true;
      setLinkTextError('Please enter link text');
    }

    if (!isUrl(linkUrl)) {
      error = true;
      setLinkUrlError('Please enter valid URL');
    }

    if (!error) {
      EditorHelpers.wrapLink(editor, linkUrl, linkText, selectionOverride);

      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onBackdropClick={onClose}
    >
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
              onClose();
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
          disabled={Boolean(selectionOverride)}
          onChange={(e) => setLinkText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
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
          <CommonButton onClick={onClose}>Cancel</CommonButton>
        </Box>
      </LinkModal>
    </Modal>
  );
};

const MarkButton: React.FC<{
  type: MarkType;
  icon: React.ReactNode;
}> = ({ type, icon }) => {
  const editor = useSlate();

  return (
    <ToolbarButton
      $active={EditorHelpers.isMarkActive(editor, type)}
      onMouseDown={(event) => {
        event.preventDefault();

        EditorHelpers.toggleMark(editor, type);
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

const BlockButton: React.FC<{
  type: TogglabaleBlock['type'];
  icon: React.ReactNode;
}> = ({ type, icon }) => {
  const editor = useSlate();

  return (
    <ToolbarButton
      $active={EditorHelpers.isBlockActive(editor, type)}
      onClick={(event) => {
        event.preventDefault();
        EditorHelpers.toggleBlock(editor, type);
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

function Toolbar() {
  const editor = useSlate();
  const [selectionOverride, setSelectionOverride] = useState<BaseRange | null>(null);
  const [initialLinkText, setInitialLinkText] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleInsertLink = () => {
    if (EditorHelpers.isBlockActive(editor, 'link')) {
      EditorHelpers.unwrapLink(editor);

      return;
    }

    if (Range.isCollapsed(editor.selection)) {
      setSelectionOverride(null);
    } else {
      setSelectionOverride(editor.selection);
      setInitialLinkText(Editor.string(editor, editor.selection));
    }
    setIsLinkModalOpen(true);
  };

  return (
    <ToolbarContainer>
      <BlockButton type="h1" icon={<H1Icon />} />
      <BlockButton type="h2" icon={<H1Icon />} />
      <MarkButton type="bold" icon={<BoldIcon />} />
      <MarkButton type="italic" icon={<ItalicIcon />} />
      <MarkButton type="underline" icon={<UnderlineIcon />} />
      <MarkButton type="strikethrough" icon={<StrikethroughIcon />} />
      <MarkButton type="code" icon={<CodeIcon />} />
      <BlockButton type="bulleted-list" icon={<BulletedListIcon />} />
      <BlockButton type="numbered-list" icon={<NumberedListIcon />} />
      <ToolbarButton $active={EditorHelpers.isBlockActive(editor, 'link')} onClick={handleInsertLink}>
        <LinkIcon />
      </ToolbarButton>
      <InsertLinkModal
        key={isLinkModalOpen ? 'open' : 'closed'}
        editor={editor}
        open={isLinkModalOpen}
        initialLinkText={initialLinkText}
        selectionOverride={selectionOverride}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </ToolbarContainer>
  );
}

export default Toolbar;
