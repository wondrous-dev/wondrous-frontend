import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import palette from 'theme/palette';
import TextField from '@mui/material/TextField';
import typography from 'theme/typography';

export const Wrapper = styled(Grid)`
  && {
    position: absolute;
    top: 50%;
    background: ${palette.grey900};
    border: 1px solid ${palette.grey79};
    left: 50%;
    border-radius: 6px;
    transform: translate(-50%, -50%);
  }
`;

export const Input = styled(TextField)`
  &.MuiTextField-root {
    width: 100%;
    border-bottom: 1px solid ${palette.grey79};
  }
  input {
    height: 2rem;
    width: 100%;
    border: 0;
    color: ${palette.white};
    &::placeholder {
      color: ${palette.grey57};
    }
  }
`;

export const SpotlightFooter = styled(Grid)`
  && {
    background: ${palette.black97};
    border-radius: 0px 0px 6px 6px;
    padding: 14px;
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 700;
  }
`;
