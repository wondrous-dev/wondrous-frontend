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
    font-family: 'Space Grotesk';
    font-size: 15px;
    gap: 8px;
    height: 40px;
    justify-content: space-between;
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

export const MilestoneTaskFilterStatusIcon = styled(FilterStatusIcon)``;

export const MilestoneTaskFilterButtonIcon = styled((props) => {
  return (
    <div {...props}>
      <Arrow />
    </div>
  );
})`
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
