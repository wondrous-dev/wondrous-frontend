import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  z-index: 1000;
  display: none;
  .open {
    display: block;
  }
  display: ${({ open }) => (open ? 'block' : 'none')};
`;

export const Button = styled(ButtonUnstyled)`
  && {
    align-items: center;
    background: #171717;
    border-radius: 6px;
    border: none;
    display: flex;
    height: 32px;
    justify-content: center;
    outline: ${({ open }) => open && `1px solid #424242`};
    width: 32px;
    :hover,
    :active {
      cursor: pointer;
      background: #171717;
    }
    svg {
      circle {
        display: none;
      }
      path {
        stroke: #ffffff;
      }
    }
  }
`;

export const StyledMenu = styled(Menu)`
  && {
    .MuiMenu-paper {
      background: transparent;
      outline: 1px solid #424242;
    }
    .MuiMenu-list {
      min-width: fit-content;
      width: 150px;
      background: #1d1d1d;
      display: flex;
      padding: 0;
      flex-direction: column;
    }
  }
`;

export const Item = styled(MenuItem)`
  && {
    z-index: 1000;
    display: flex;
    justify-content: flex-start;
    color: ${({ theme, warning }) => (warning ? theme.palette.red800 : theme.palette.white)};
    height: 32px;
    font-size: 13px;
    padding: 12px;
    border-radius: 4px;
    :hover {
      background: ${({ theme }) => theme.palette.black98};
    }
  }
`;
