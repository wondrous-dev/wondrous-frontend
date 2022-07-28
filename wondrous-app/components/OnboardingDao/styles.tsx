import { InputUnstyled } from '@mui/base';
import { Typography } from '@mui/material';
import styled from 'styled-components';

export const FieldLabel = styled(Typography)`
  && {
    color: #ccbbff;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
  }
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const ComponentFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

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

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const ImportButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Error = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 400;
    font-size: 15px;
    color: ${({ theme }) => theme.palette.red800};
  }
`;
