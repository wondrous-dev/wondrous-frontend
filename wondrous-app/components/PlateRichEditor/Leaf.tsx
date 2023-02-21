import { Typography } from '@mui/material';
import { Text } from 'slate';
import styled from 'styled-components';

export const Strikethrough = styled.span`
  text-decoration: line-through;
`;

const Leaf: React.FC<{
  children: any;
  leaf: Text;
  text?: Text;
  attributes?: {
    'data-slate-leaf': true;
  };
}> = ({ attributes = {}, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.headingOne) {
    children = (
      <Typography variant="h1" fontSize="28px" color="inherit" fontFamily="inherit">
        {children}
      </Typography>
    );
  }

  if (leaf.headingTwo) {
    children = (
      <Typography variant="h2" fontSize="22px" color="inherit" fontFamily="inherit">
        {children}
      </Typography>
    );
  }

  if (leaf.headingThree) {
    children = (
      <Typography variant="h3" fontSize="16px" color="inherit" fontFamily="inherit">
        {children}
      </Typography>
    );
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <Strikethrough>{children}</Strikethrough>;
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
