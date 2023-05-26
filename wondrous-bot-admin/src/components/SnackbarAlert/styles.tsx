import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import styled from 'styled-components';

export const StyledAlert = styled(Alert)`
  &.MuiAlert-standardSuccess {
    background: #2A8D5C;
    border-radius: 6px;
    color: #fee2ca;
    border: 1px solid black;
    z-index: 9999;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    padding: 6px 24px;
  }
`;

export const StyledSnackbar = styled(Snackbar)``;
