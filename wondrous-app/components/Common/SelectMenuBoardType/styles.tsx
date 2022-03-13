import { MenuItem, Popper } from '@material-ui/core';
import { ClickAwayListener, Typography } from '@mui/material';
import { Box } from '@mui/system';
import styled from 'styled-components';
import { Black95, Black97, Black98, Grey80, White } from '../../../theme/colors';
import { Chevron } from '../../Icons/sections';

export const SelectMenuBoardTypeClickAway = styled(ClickAwayListener)``;

export const SelectMenuBoardTypeWrapper = styled.div``;

export const SelectMenuBoardTypeDiv = styled.div`
  && {
    background: ${({ open }) =>
      open ? `${Black95}` : `linear-gradient(90.93deg, ${Black95} 3.85%, ${Black97} 101.76%)`};
    height: 40px;
    border-radius: 3px;
    min-width: 120px;
    outline: 1px solid ${Grey80};
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px;
    cursor: pointer;
    :hover {
      background: ${({ open }) =>
        open ? `${Black95}` : `linear-gradient(90.93deg, ${Black95} 3.85%, ${Black97} 101.76%)`};
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
    color: ${White};
    opacity: ${({ open }) => open && `40%`};
  }
`;

export const SelectMenuBoardTypeIcon = styled((props) => {
  return <Chevron width={24} fill={White} />;
})``;

export const SelectMenuBoardTypePopper = styled(Popper)``;

export const SelectMenuBoardTypePopperMenu = styled(Box)`
  width: 120px;
  background: linear-gradient(268.33deg, ${Black97} 3.14%, ${Black98} 97.25%);
  outline: 1px solid #393939;
  padding: 8px;
  border-radius: 3px;
`;

export const SelectMenuBoardTypeItem = styled(MenuItem)`
  && {
    color: ${White};
    font-size: 14px;
    background: none;
    border-radius: 3px;
    padding: 6px;
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
