import { MenuItem, Popper, ClickAwayListener, Typography } from '@mui/material';
import { Box } from '@mui/system';
import styled from 'styled-components';
import { greyColors } from 'theme/colors';
import palette from 'theme/palette';
import { Chevron } from '../../Icons/sections';

export const SelectMenuBoardTypeClickAway = styled(ClickAwayListener)``;

export const SelectMenuBoardTypeWrapper = styled.div``;

export const SelectMenuBoardTypeDiv = styled.div`
  && {
    background: ${({ open }) =>
      open ? `${palette.black95}` : `linear-gradient(90.93deg, ${palette.black95} 3.85%, ${palette.black97} 101.76%)`};
    height: 40px;
    border-radius: 3px;
    min-width: 120px;
    outline: 1px solid ${palette.grey80};
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px;
    cursor: pointer;
    :hover {
      background: ${({ open }) =>
        open
          ? `${palette.black95}`
          : `linear-gradient(90.93deg, ${palette.black95} 3.85%, ${palette.black97} 101.76%)`};
    }
    & > svg {
      ${({ open }) => open && `transform: rotate(180deg)`}
    }
  }
`;

export const SelectMenuBoardTypeText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: ${palette.white};
    opacity: ${({ open }) => open && `40%`};
  }
`;

export const SelectMenuBoardTypeIcon = styled((props) => <Chevron width={24} fill={palette.white} />)``;

export const SelectMenuBoardTypePopper = styled(Popper)``;

export const SelectMenuBoardTypePopperMenu = styled(Box)`
  width: 120px;
  background: linear-gradient(268.33deg, ${palette.black97} 3.14%, ${palette.black98} 97.25%);
  outline: 1px solid #393939;
  padding: 8px;
  border-radius: 3px;
`;

export const SelectMenuBoardTypeItem = styled(MenuItem)`
  && {
    color: ${palette.white};
    font-size: 14px;
    background: none;
    border-radius: 2px;
    padding: 6px;
    background-color: ${(props) => (props.picked ? `${greyColors.grey90}` : 'black')};
    :hover {
      background-color: #474747;
    }
  }
  &&.Mui-selected {
    background: none;
    :hover {
      background-color: #474747;
    }
  }
`;
