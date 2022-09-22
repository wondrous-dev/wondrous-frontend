import styled from 'styled-components';
import { Chip, ToggleButton } from '@mui/material';

import palette from 'theme/palette';

export const GridStyle = {
  padding: '4px',
  minHeight: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: palette.black97,
  borderRadius: '4px',
  width: '100%',
};

export const ToggleButtonGroupStyle = {
  maxHeight: '24px',
  backgroundColor: palette.grey99,
  width: '100%',
};

export const ToggleButtonStyle = styled(ToggleButton)` 
  && {
    width: 100%;
    min-height: 24px;
    padding: 4px 8px;
    color: ${palette.grey57};
    background-color: ${palette.grey99};
    font-size: 14px;
    font-weight: 500;
    border: 1px solid ${palette.grey99};

    &&.MuiToggleButtonGroup-grouped {
      border: 1px solid transparent;
      border-radius: 4px;
      margin: 0;
    },

    &&.Mui-selected, &&:hover {
      background-color: ${palette.grey99};
      color: ${(props) => props.textColor};
      border: 1px solid ${(props) => props.borderColor};
      border-radius: 4px;
    },
  }
`;

export const PriorityChipStyled = styled(Chip)`
  && {
    color: ${(props) => props.textColor};,
    font-size: 14px;
    font-weight: 500;
    border: 1px solid ${(props) => props.borderColor};
    padding: 6px 8px 6px 4px;
    height: 26px;

    & .MuiChip-label {
      padding: 0 0 0 4px;
    }
  }
`;
