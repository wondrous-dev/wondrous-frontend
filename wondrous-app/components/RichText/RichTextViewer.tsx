import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { Descendant, Text } from 'slate';

import { renderMentionString } from 'utils/common';

import { FormattedText } from './types';
import { isRichText } from './utils';
import { BulletedList, NumberedList, RichTextStyled, Strikethrough } from './styles';
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
          <Link key={i} href={`/profile/${node.mentionable}/about`} passHref legacyBehavior>
            @{node.mentionable}
          </Link>
        );
      case 'link':
        return (
          <Link key={i} href={node.href} passHref target="_blank" rel="noopener noreferrer" legacyBehavior>
            {node.children[0]?.text}
          </Link>
        );
      case 'bulleted-list':
        return <BulletedList>{children}</BulletedList>;
      case 'numbered-list':
        return <NumberedList>{children}</NumberedList>;
      case 'list-item':
        return <li>{children}</li>;
      default:
        return children;
    }
  });

const RichTextViewer: React.FC<{ text?: string }> = ({ text }) => {
  const router = useRouter();

  if (!text) {
    return <div />;
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
