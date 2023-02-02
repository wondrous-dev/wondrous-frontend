import { useRouter } from 'next/router';
import { memo } from 'react';
import { Text, Node } from 'slate';
import Typography from '@mui/material/Typography';

import { renderMentionString } from 'utils/common';
import { NoUnderlineLink } from 'components/Common/Link/links';
import Leaf from 'components/RichTextPlate/Leaf';
import {
  Blockquote,
  BulletedList,
  CheckboxLabel,
  CheckboxWrapper,
  NumberedList,
  RichTextStyled,
} from 'components/RichTextPlate/styles';
import { isRichText } from './utils';
import palette from '../../theme/palette';

const renderNodes = (nodes) =>
  nodes.map((node, i) => {
    if (Text.isText(node)) {
      return (
        <Leaf key={i} leaf={node}>
          {node.text}
        </Leaf>
      );
    }
    let mentionable = '';

    if (node.type === 'mention' && node.value) {
      mentionable = node.value.substring(1);
    }

    const children = renderNodes(node.children);

    const isChecked = !!node.checked;
    const checkboxId = `checkbox-${i}`;

    switch (node.type) {
      case 'p':
      case 'paragraph':
        if (children[0]?.props?.children) {
          return <p key={i}>{children}</p>;
        }
        return (
          <>
            <br />
            <p key={i}>{children}</p>
          </>
        );
      case 'h1':
        return (
          <Typography variant="h1" fontSize="28px" sx={{ color: palette.grey250 }}>
            {children}
          </Typography>
        );
      case 'h2':
        return (
          <Typography variant="h2" fontSize="22px" sx={{ color: palette.grey250 }}>
            {children}
          </Typography>
        );
      case 'h3':
        return (
          <Typography variant="h3" fontSize="16px" sx={{ color: palette.grey250 }}>
            {children}
          </Typography>
        );
      case 'li':
        return <li>{children}</li>;
      case 'ol':
        return <NumberedList>{children}</NumberedList>;
      case 'ul':
        return <BulletedList>{children}</BulletedList>;
      case 'blockquote':
        return <Blockquote>{children}</Blockquote>;
      case 'a':
        return (
          <NoUnderlineLink key={i} href={node.url} target="_blank" rel="noopener noreferrer">
            {node.children[0]?.text}
          </NoUnderlineLink>
        );
      case 'hr':
        return <hr />;
      case 'action_item':
        return (
          <CheckboxWrapper>
            <input type="checkbox" id={checkboxId} name={checkboxId} checked={isChecked} />
            <CheckboxLabel htmlFor={checkboxId} isChecked={isChecked}>
              {children}
            </CheckboxLabel>
          </CheckboxWrapper>
        );
      case 'mention':
        return (
          <NoUnderlineLink key={i} href={`/profile/${mentionable}/about`}>
            @{mentionable}
          </NoUnderlineLink>
        );
      default:
        return children;
    }
  });

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');

const RichTextViewer: React.FC<{ text?: string; asText?: boolean }> = ({ text, asText = '' }) => {
  const router = useRouter();

  if (!text) {
    return null;
  }

  if (asText) {
    return (
      <Typography fontFamily="inherit" color="inherit" fontSize="inherit">
        {serialize(JSON.parse(text))}
      </Typography>
    );
  }

  return isRichText(text) ? (
    <RichTextStyled>{renderNodes(JSON.parse(text))}</RichTextStyled>
  ) : (
    <>
      {renderMentionString({
        content: text,
        router,
      })}
    </>
  );
};

export default memo(RichTextViewer);
