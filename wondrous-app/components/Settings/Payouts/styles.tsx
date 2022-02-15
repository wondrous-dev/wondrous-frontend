import { Checkbox, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { White } from '../../../theme/colors';

export const TableCellText = styled(Typography)`
  && {
    color: ${White};
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
