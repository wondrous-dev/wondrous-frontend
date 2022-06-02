import { List, ListItem, ListItemIcon, ListItemText, Popper } from '@mui/material';
import styled from 'styled-components';

export const StyledPopper = styled(Popper)`
  z-index: 999;
  .MuiPaper-rounded {
    border-radius: 0 6px 6px 6px;
    background: transparent;
  }
`;

export const StyledList = styled(List)`
  && {
    min-width: 186px;
    background: linear-gradient(177.24deg, #4b4b4b 11.18%, #232323 99.11%);
    padding: 6px;
    z-index: 1;
    border-radius: 0 6px 6px 6px;
    position: relative;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0.1em;
    z-index: -1;
    border-radius: inherit;
    background: linear-gradient(180deg, #1e1e1e 0%, #141414 109.19%);
  }
`;

export const StyledListItem = styled(ListItem)`
  height: 35px;
  background: #121212;
  margin-top: 3px;
  border-radius: 4px;

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background: #1e1e1e;
    cursor: pointer;
  }
`;
export const StyledListItemIcon = styled(ListItemIcon)`
  && {
    min-width: 0px;
  }

  & svg {
    width: 14px;
    height: 14px;
  }
`;

export const StyledListItemText = styled(ListItemText)`
  margin-left: 11px;
  .MuiTypography-body1 {
    color: #c4c4c4;
    font-size: 13px;
  }
`;
