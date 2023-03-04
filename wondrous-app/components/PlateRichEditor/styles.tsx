import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import styled from 'styled-components';

import palette from 'theme/palette';

export const ToolbarButton = styled.button`
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
    color: ${palette.highlightBlue};
    text-decoration: none;

    &:hover {
      color: ${palette.blue30};
    }
  }

  p {
    margin: 0;
  }
`;

export const StickyTopSection = styled.div`
  width: 100%;
  background: ${palette.grey900};
  position: sticky;
  top: 0;
`;

export const PlateStyles = styled.div`
  height: 100%;
  min-height: 150px;
  overflow-y: auto;
  ${ScrollBarStyles};

  .slate-mention_input {
    box-shadow: none;
    background: none;
  }

  .slate-ToolbarButton-active[data-testid='ToolbarButton'],
  .slate-ToolbarButton:hover[data-testid='ToolbarButton'] {
    color: ${palette.white};
    background: ${palette.black92};
    border-radius: 4px;
    height: 28px;
  }

  .slate-mention {
    background-color: unset;
    color: ${palette.highlightBlue};
    padding: 0;
    box-shadow: none;
    font-size: 14px;
  }

  :where([data-slate-editor-id='plate']) {
    min-height: 100px;
  }

  .slate-HrElement-hr {
    padding-top: unset;
    padding-bottom: unset;
    background-color: ${palette.grey99};
  }

  .slate-code[data-slate-leaf='true'] {
    background-color: unset;
    font-family: monospace;
  }

  .plate-tooltip {
    color: ${palette.white};
    background-color: ${palette.grey99};
    padding: 5px;
    border-radius: 4px;
  }

  div[class*='PlateFloatingLink___StyledFloatingLinkInsertRoot'],
  div[class*='PlateFloatingLink___StyledDiv'] {
    background: ${palette.grey125};
    border: 1px solid rgb(75, 75, 75);
  }

  div[class*='PlateFloatingLink___StyledDiv'] input {
    color: ${palette.white};
  }

  div[class*='PlateFloatingLink___StyledDiv'] button,
  div[class*='PlateFloatingLink___StyledDiv'] a {
    background: none;
  }

  a[data-slate-node='element'],
  a[data-slate-node='element']:hover,
  a[data-slate-node='element']:active,
  a[data-slate-node='element']:visited {
    color: ${palette.highlightBlue} !important;
  }
`;
