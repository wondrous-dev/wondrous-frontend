import { InputUnstyled } from '@mui/base';
import styled from 'styled-components';

export const Input = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: transparent;
      border: none;
      color: black;
      font-family: Poppins;
      font-weight: 700;
      font-size: 13px;
      line-height: 17px;
        :focus-visible {
            outline: none;
        }
    }
  }
`;
