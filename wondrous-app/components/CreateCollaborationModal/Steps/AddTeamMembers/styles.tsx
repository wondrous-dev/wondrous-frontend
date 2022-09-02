import styled from 'styled-components';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const ListboxWrapper = styled.ul`
  border-color: #7a7a7a;
  scroll-padding-right: 0;
  max-height: 200px;
  ${ScrollBarStyles};
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    background: #1f1f1f;
    min-height: 36px;
    padding: 6px 12px;
    &:hover {
      background: ${palette.grey87};
    }
  }
`;

export const PaperComponent = styled.div`
  .MuiAutocomplete-noOptions {
    background: #1f1f1f;
    font-family: ${typography.fontFamily};
    font-size: 14px;
    color: ${palette.white};
    font-weight: 500;
    border-color: #7a7a7a;
  }
`;

export const InviteAllButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 6px;
  color: white;
  height: fit-content;
  cursor: pointer;
  min-width: 20%;
  background: #4000b3;
  border: 1px solid #7427ff;
  &:hover {
    background: #7427ff;
  }
`;
