import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { Descendant, Text, Node } from 'slate';

import { renderMentionString } from 'utils/common';

import Typography from '@mui/material/Typography';

import { NoUnderlineLink } from 'components/Common/Link/links';
import { FormattedText } from './types';
import { isRichText } from './utils';
import { BulletedList, NumberedList, RichTextStyled } from './styles';
import { Leaf } from './elements';

const renderNodes = (nodes: Descendant[] | FormattedText[]) =>
  nodes.map((node: Descendant | FormattedText, i) => {
    if (Text.isText(node)) {
      return <Leaf leaf={node}>{node.text}</Leaf>;
    }

    const children = renderNodes(node.children);

    switch (node.type) {
      case 'paragraph':
        if (children && children[0] && children[0]?.props?.children) {
          return <p key={i}>{children}</p>;
        }
        return (
          <>
            <br />
            <p key={i}>{children}</p>
          </>
        );
      case 'mention':
        return (
          <NoUnderlineLink key={i} href={`/profile/${node.mentionable}/about`}>
            @{node.mentionable}
          </NoUnderlineLink>
        );
      case 'link':
        return (
          <NoUnderlineLink key={i} href={node.href} target="_blank" rel="noopener noreferrer">
            {node.children[0]?.text}
          </NoUnderlineLink>
        );
      case 'bulleted-list':
        return <BulletedList>{children}</BulletedList>;
      case 'headingOne':
        return (
          <Typography variant="h1" fontSize="28px">
            {children}
          </Typography>
        );
      case 'headingTwo':
        return (
          <Typography variant="h2" fontSize="22px">
            {children}
          </Typography>
        );
      case 'headingThree':
        return (
          <Typography variant="h3" fontSize="16px">
            {children}
          </Typography>
        );
      case 'numbered-list':
        return <NumberedList>{children}</NumberedList>;
      case 'list-item':
        return <li>{children}</li>;
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
