import { ButtonBase, Menu, MenuItem } from '@mui/material';
import Arrow from 'components/Icons/arrow.svg';
import FilterStatusIcon from 'components/Icons/filterStatusIcon.svg';
import styled from 'styled-components';

export const MilestoneTaskFilterSelectButton = styled(ButtonBase)`
  && {
    align-items: center;
    background: #1b1b1b;
    border-radius: 6px;
    border: 1px solid ${({ open }) => (open ? `#424242` : 'transparent')};
    color: white;
    display: flex;
    font-family: var(--font-space-grotesk);
    font-size: 15px;
    gap: 8px;
    height: 40px;
    justify-content: space-between;
    margin-bottom: 24px;
    max-width: fit-content;
    min-width: 245px;
    padding: 8px;
  }
`;

export const MilestoneTaskFilterSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MilestoneTaskFilterStatusIcon = styled((props) => (
  <div {...props}>
    <FilterStatusIcon />
  </div>
))`
  background: #0f0f0f;
  height: 26px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
`;

export const MilestoneTaskFilterButtonIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    transform: rotate(${({ open }) => (open ? `-90` : `90`)}deg);
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
  }
`;

export const MilestoneTaskFilterMenu = styled(Menu)`
  && {
    .MuiMenu-list,
    .MuiMenu-paper {
      padding: 0;
      background-color: #1b1b1b;
      min-width: 245px;
      outline: 1px solid #424242;
    }
  }
`;

export const MilestoneTaskFilterMenuItem = styled(MenuItem)`
  && {
    background: #1b1b1b;
    color: white;
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    cursor: pointer;
    :hover {
      background: ${({ theme }) => theme.palette.black98};
    }
  }
`;

export const MilestoneTaskFilterMenuItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    width: 26px;
    height: 26px;
  }
`;
