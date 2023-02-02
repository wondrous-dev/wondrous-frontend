import styled from 'styled-components';

import palette from 'theme/palette';

export const MediaUploadButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;

  &:hover {
    background: ${palette.black92};
    border-radius: 4px;
  }
`;

export const VerticalDivider = styled.div`
  border-right: 1px solid ${palette.grey75};
  height: 28px;
`;

export const Strikethrough = styled.span`
  text-decoration: line-through;
`;

export const BulletedList = styled.ul`
  margin: 0;
  padding: 0 24px;

  li {
    margin: 0;
    padding: 0;
  }
`;

export const NumberedList = styled.ol`
  margin: 0;
  padding: 0 24px;

  li {
    margin: 0;
    padding: 0;
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
`;

export const CheckboxLabel = styled.label`
  text-decoration: ${({ isChecked }) => (isChecked ? 'line-through' : 'none')};
  opacity: ${({ isChecked }) => (isChecked ? 0.6 : 1)};
`;

export const Blockquote = styled.blockquote`
  margin: 0.5rem 0 0.5rem 0;
  border-left: 2px solid ${palette.grey200};
  padding: 10px 20px 10px 16px;
`;

export const RichTextStyled = styled.div`
  font-size: 15px;
  line-height: 24px;

  a {
    color: rgb(0, 186, 255);
    text-decoration: none;

    &:hover {
      color: rgb(138, 223, 255);
    }
  }

  p {
    margin: 0;
  }
`;
