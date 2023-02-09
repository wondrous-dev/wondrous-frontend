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
import { ElementTypes } from 'components/RichTextPlate/types';
import palette from '../../theme/palette';
import { isRichText } from './utils';

const renderNodes = (nodes) =>
  nodes.map((node, i) => {
    if (Text.isText(node)) {
      return (
        <Leaf key={i} leaf={node}>
          {node.text}
        </Leaf>
      );
    }

    const children = renderNodes(node.children);

    const isChecked = !!node.checked;
    const checkboxId = `checkbox-${i}`;

    switch (node.type) {
      case ElementTypes.ELEMENT_DEFAULT:
      case ElementTypes.ELEMENT_PARAGRAPH:
        if (children[0]?.props?.children) {
          return <p key={i}>{children}</p>;
        }
        return (
          <>
            <br />
            <p key={i}>{children}</p>
          </>
        );
      case ElementTypes.ELEMENT_H1:
        return (
          <Typography variant="h1" fontSize="28px" sx={{ color: palette.grey250 }}>
            {children}
          </Typography>
        );
      case ElementTypes.ELEMENT_H2:
        return (
          <Typography variant="h2" fontSize="22px" sx={{ color: palette.grey250 }}>
            {children}
          </Typography>
        );
      case ElementTypes.ELEMENT_H3:
        return (
          <Typography variant="h3" fontSize="16px" sx={{ color: palette.grey250 }}>
            {children}
          </Typography>
        );
      case ElementTypes.ELEMENT_LI:
        return <li>{children}</li>;
      case ElementTypes.ELEMENT_OL:
        return <NumberedList>{children}</NumberedList>;
      case ElementTypes.ELEMENT_UL:
        return <BulletedList>{children}</BulletedList>;
      case ElementTypes.ELEMENT_BLOCKQUOTE:
        return <Blockquote>{children}</Blockquote>;
      case ElementTypes.ELEMENT_LINK:
        return (
          <NoUnderlineLink key={i} href={node.url} target="_blank" rel="noopener noreferrer">
            {node.children[0]?.text}
          </NoUnderlineLink>
        );
      case ElementTypes.ELEMENT_HR:
        return <hr />;
      case ElementTypes.ELEMENT_TODO_LI:
        return (
          <CheckboxWrapper>
            <input type="checkbox" id={checkboxId} name={checkboxId} checked={isChecked} />
            <CheckboxLabel htmlFor={checkboxId} isChecked={isChecked}>
              {children}
            </CheckboxLabel>
          </CheckboxWrapper>
        );
      case ElementTypes.ELEMENT_MENTION:
        return (
          <NoUnderlineLink key={i} href={`/profile/${node.value}/about`}>
            @{node.value}
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
