import { InputUnstyled } from '@mui/base';
import styled from 'styled-components';

export const CustomTextField = styled(InputUnstyled)`
  width: 100%;
  && {
    .MuiInput-input {
      border-radius: 6px;
      background: #e8e8e8;
      padding: 14px;
      box-sizing: border-box;

      border: none;
      color: #949494;
      width: 100%;
      font-family: Poppins;
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      height: 110px;
      resize: none;
      width: 100%;
      :focus-visible {
        outline: none;
      }
    }
  }
`;
