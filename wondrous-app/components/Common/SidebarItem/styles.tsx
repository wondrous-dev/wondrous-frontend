import { ButtonBase, Typography } from '@mui/material';
import styled, { css } from 'styled-components';

export const ItemButton = styled(ButtonBase)`
  && {
    background: transparent;
    padding: 14px;
    height: 32px;
    width: 100%;
    display: flex;
    border-left: 4px solid ${({ isActive, theme }) => (isActive ? `${theme.palette.highlightPurple}` : 'transparent')};
    align-items: center;
    background: ${({ isActive, theme }) => isActive && `${theme.palette.grey87}`};
    justify-content: ${({ minimized }) => (minimized ? 'center' : 'space-between')};
    :hover {
      background: ${({ theme, disableHover }) => !disableHover && theme.palette.grey87};
    }
  }
`;

export const ButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgColor, theme, isActive }) =>
    bgColor || (isActive && `${theme.palette.highlightPurple}`) || `${theme.palette.grey87}`};
  border-radius: ${({ roundedBg }) => (roundedBg ? '50%' : '4px')};
  ${ItemButton}:hover & {
    background: ${({ theme, disableHover }) => !disableHover && theme.palette.highlightPurple};
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

export const UnstyledButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ItemButtonIcon = ({ ignoreIconStyles = false, children, ...props }) =>
  ignoreIconStyles ? (
    <UnstyledButtonIcon>{children}</UnstyledButtonIcon>
  ) : (
    <ButtonIcon {...props}>{children}</ButtonIcon>
  );

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
