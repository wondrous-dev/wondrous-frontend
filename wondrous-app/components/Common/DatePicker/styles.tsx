import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import styled from 'styled-components';
import { TextField } from '@mui/material';

export const StyledDatePicker = styled(DesktopDatePicker)`
  && {
    .MuiFormControl-root {
      background: #0f0f0f;
      border-radius: 6px;
      width: 100%;
      height: 40px;
      padding: 0 15px;
      position: relative;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.01em;
      color: #c4c4c4;
    }
  }
`;

export const StyledTextField = styled(TextField)`
  && {
    background: #0f0f0f;
    border-radius: 6px;
    width: 100%;
    height: 40px;
    padding: 0 15px;
    position: relative;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4 !important;
    margin-top: 16px;

    input {
      color: #c4c4c4 !important;
    }

    svg {
      color: #c4c4c4 !important;
    }
  }
`;
