import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import styled from 'styled-components';

export const StyledAlert = styled(Alert)`
  &.MuiAlert-standardSuccess {
    background: #12413d;
    border-radius: 7px;
    color: #ffffff;
    font-weight: 500;
    font-size: 14px;
    border: 1px solid #115448;
    z-index: 9999;
  }
`;

export const StyledSnackbar = styled(Snackbar)``;
