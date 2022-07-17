import { InputUnstyled } from '@mui/base';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import styled from 'styled-components';

export const FieldInput = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: #141414;
      border-radius: 6px;
      border-radius: 6px;
      border: none;
      color: ${({ theme }) => theme.palette.white};
      font-family: 'Space Grotesk';
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      height: 42px;
      padding: 12px;
      width: 100%;
      :focus-visible {
        outline: none;
      }
    }
  }
`;

export const FieldInputDao = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: #141414;
      border-radius: 6px;
      border-radius: 6px;
      border: none;
      color: ${({ theme }) => theme.palette.white};
      font-family: 'Space Grotesk';
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      height: 100px;
      padding: 12px;
      resize: none;
      width: 100%;
      :focus-visible {
        outline: none;
      }
      ${ScrollBarStyles}
    }
  }
`;
