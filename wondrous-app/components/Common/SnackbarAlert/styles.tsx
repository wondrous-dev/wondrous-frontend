import Alert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core'
import styled from 'styled-components';

export const StyledAlert = styled(Alert)`
    &.MuiAlert-standardSuccess {
        background: #12413D;
        border-radius: 7px;
        color: #FFFFFF;
        font-weight: 500;
        font-size: 14px;
        border: 1px solid #115448;    
    }

`

export const StyledSnackbar = styled(Snackbar)``