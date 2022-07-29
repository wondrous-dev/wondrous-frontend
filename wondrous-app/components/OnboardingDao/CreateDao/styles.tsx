import { InputUnstyled } from '@mui/base';
import { Typography } from '@mui/material';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import styled from 'styled-components';

export const InputWrapper = styled.div`
  background: #141414;
  border-radius: 6px;
  padding: 12px;
`;

export const FieldInputDao = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: #141414;
      border: none;
      color: ${({ theme }) => theme.palette.white};
      ${({ theme }) => theme.typography.fontFamily};
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      height: 110px;
      resize: none;
      width: 100%;
      :focus-visible {
        outline: none;
      }
      ${ScrollBarStyles}
    }
  }
`;

export const DescriptionCharacterLength = styled(Typography)`
  && {
    ${({ theme }) => theme.typography.fontFamily};
    font-size: 12px;
    font-weight: 400;
    line-height: 19px;
    text-align: right;
    width: 100%;
    color: #c4c4c4;
  }
`;
