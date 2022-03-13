import { MenuItem, Select } from '@material-ui/core';
import styled from 'styled-components';
import { Black95, Black97, Grey80, White } from '../../../theme/colors';
import { Chevron } from '../../Icons/sections';

export const SelectMenuBoardType = styled(Select)`
  background: ${({ open }) =>
    open ? `${Black95}` : `linear-gradient(90.93deg, ${Black95} 3.85%, ${Black97} 101.76%)`};
  height: 40px;
  border-radius: 3px;
  min-width: 120px;
  outline: 1px solid ${Grey80};
  :hover {
    cursor: pointer;
  }
  padding: 0 9px;
  & .MuiSelect-select {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: ${White};
    opacity: ${({ open }) => open && `40%`};
  }
  & > svg {
    ${({ open }) => open && `transform: rotate(180deg)`}
  }
`;

export const SelectMenuBoardTypeIcon = styled((props) => {
  return <Chevron width={24} fill={White} />;
})``;

export const SelectMenuBoardTypeWrapper = styled(({ className, ...props }) => {
  return (
    <SelectMenuBoardType
      IconComponent={SelectMenuBoardTypeIcon}
      MenuProps={{
        classes: { paper: className },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}
      {...props}
    />
  );
})`
  &.MuiPaper-root {
    width: 120px;
    background: linear-gradient(268.33deg, #131313 3.14%, #141414 97.25%);
    outline: 1px solid #393939;
    margin: 6px -9px;
  }
`;

export const SelectMenuBoardTypeItem = styled(MenuItem)`
  && {
    color: ${White};
    font-size: 14px;
    background: none;
    border-radius: 3px;
    margin: auto 4px;
    padding: 6px 4px;
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
