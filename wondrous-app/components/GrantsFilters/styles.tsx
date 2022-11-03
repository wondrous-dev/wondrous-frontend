import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Wrapper = styled(Grid)`
  && {
    display: flex;
    width: fit-content;
    align-items: flex-start;
    padding: 4px;
    gap: 8px;
    border-radius: 300px;
    background: ${palette.black95};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${palette.background.default};
  padding: 4px;
  border-radius: 100%;
  height: 24px;
  width: 24px;
`;

export const ItemWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 2px 11px 2px 11px;
  border: none;
  cursor: pointer;
  background: none;
  border-radius: 300px;
  ${({ isActive }) =>
    isActive &&
    `
    background: ${palette.grey78};
  `}
`;
