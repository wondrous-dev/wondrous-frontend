import { Button, ButtonGroup } from '@mui/material';
import styled from 'styled-components';

export const ButtonGroupStyled = styled(ButtonGroup)`
  min-height: 40px;
`;

export const ButtonStyled = styled(Button)`
  &.MuiButton-root {
    border-radius: 6px;
    font-size: 14px;
    font-weight: 400;
    border: 0.5px solid #363636;
  }

  &.MuiButton-contained {
    background: linear-gradient(90.93deg, #1e1e1e 3.85%, #141414 101.76%);
    color: #fff;
  }

  &.MuiButton-contained:hover {
    background: linear-gradient(90.93deg, #1e1e1e 3.85%, #141414 101.76%);
    color: #fff;
  }

  &.MuiButton-outlined {
    color: #c4c4c4;
    padding: 6px 16px;
  }

  &.MuiButton-outlined:hover {
    background: linear-gradient(90.93deg, #1e1e1e 3.85%, #141414 101.76%);
    color: #fff;
  }
`;
