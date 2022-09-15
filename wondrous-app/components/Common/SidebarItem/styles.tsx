import { ButtonBase, Typography } from '@mui/material';
import styled from 'styled-components';

export const ItemButton = styled(ButtonBase)`
  && {
    border-radius: 3px;
    background: transparent;
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 4px;
    background: ${({ isActive, theme }) => isActive && `${theme.palette.black101}`};
    justify-content: space-between;
    :hover {
      background: ${({ theme }) => theme.palette.black101};
    }
  }
`;

export const ItemButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  background: ${({ bgColor, theme, isActive }) =>
    bgColor || (isActive && `${theme.palette.highlightPurple}`) || `${theme.palette.grey87}`};
  border-radius: ${({ roundedBg }) => (roundedBg ? '50%' : '4px')};
  display: flex;
  align-items: center;
  justify-content: center;
  ${ItemButton}:hover & {
    background: ${({ theme }) => theme.palette.highlightPurple};
  }
  svg {
    path {
      stroke: ${({ theme }) => theme.palette.white};
    }
    rect {
      stroke: ${({ theme }) => theme.palette.white};
    }
  }
`;

export const ItemButtonText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.palette.white};
    line-height: 0;
  }
`;

export const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Count = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.palette.grey87};
  border-radius: 4px;
  display: flex;
  height: 22px;
  justify-content: center;
  min-width: 22px;
  padding: 0 4px;
  > ${ItemButtonText} {
    color: ${({ theme, isActive }) => (isActive ? theme.palette.highlightBlue : theme.palette.grey250)};
    ${ItemButton}:hover & {
      color: ${({ theme }) => theme.palette.highlightBlue};
    }
  }
`;
