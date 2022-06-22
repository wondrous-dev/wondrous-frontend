import { Checkbox, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const TableCellText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    text-align: center;
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  && {
    span {
      border: 1px solid white;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 12px;
      width: 12px;
    }
    input[type='checkbox'][disabled] {
      background: red;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 12px;
      width: 12px;
    }
  }
`;
