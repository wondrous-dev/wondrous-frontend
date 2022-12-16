import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import Arrow from 'components/Icons/arrow.svg';
import PodsIcon from 'components/Icons/Sidebar/pods.svg';
import styled from 'styled-components';

export const ButtonIcon = styled.div`
  width: 28px;
  height: 28px;
  background: ${({ theme }) => theme.palette.grey78};
  border-radius: ${({ isUserBoard }) => (isUserBoard ? '100%' : '6px')};
`;

export const Text = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 15px;
    color: ${({ theme }) => theme.palette.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Button = styled(ButtonBase)`
  && {
    padding: 6px;
    width: 100%;
    height: 42px;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${({ theme }) => theme.palette.grey99};
    :hover {
      background: ${({ theme }) => theme.palette.grey78};
    }
  }
`;

export const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 95%;
  justify-content: center;
`;

export const ArrowIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    transform: rotate(${({ open }) => (open ? `-90` : `90`)}deg);
    display: flex;
    height: 32px;
    margin-left: 6px;
    align-items: center;
    justify-content: center;
    svg {
      path {
        fill: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;

export const MenuStyled = styled(Menu)`
  && {
    margin-top: 6px;
    .MuiMenu-paper {
      background-color: ${({ theme }) => theme.palette.grey77};
    }
    .MuiList-root {
      background-color: ${({ theme }) => theme.palette.grey77};
      min-width: 173px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px;
    }
  }
`;

export const Item = styled(MenuItem)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.white};
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 2px;
    padding: 4px 9px;
    :hover {
      background: ${({ theme }) => theme.palette.grey58};
    }
  }
`;

export const NoLogoPod = styled((props) => (
  <div {...props}>
    <PodsIcon />
  </div>
))`
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.grey87}; ;
`;

export const IconWrapper = styled.div`
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
`;