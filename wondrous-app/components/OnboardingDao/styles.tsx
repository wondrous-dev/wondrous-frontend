import { InputUnstyled } from '@mui/base';
import { ButtonBase, Typography } from '@mui/material';
import styled from 'styled-components';

export const FieldLabel = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.blue20};
    font-family: ${({ theme }) => theme.typography.fontFamily};
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
    width: 100%;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.palette.background.default};
    height: 42px;
    padding: 12px;
    border-radius: 6px;
    .MuiInput-input {
      background: inherit;
      border: none;
      color: ${({ theme }) => theme.palette.white};
      font-family: ${({ theme }) => theme.typography.fontFamily};
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
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
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 400;
    font-size: 15px;
    color: ${({ theme }) => theme.palette.red800};
  }
`;

export const MainButton = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    align-items: center;
    background: ${({ theme }) =>
      `linear-gradient(270deg, ${theme.palette.blue20} -5.62%, ${theme.palette.highlightPurple} 45.92%, ${theme.palette.highlightBlue} 103.12%);`};
    border-radius: 35px;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 15px;
    font-weight: 600;
    height: 38px;
    justify-content: space-between;
    padding: 1px;
    text-align: center;
    width: fit-content;
    > div {
      align-items: center;
      background: ${({ theme }) => theme.palette.background.default};
      border-radius: inherit;
      display: flex;
      height: 100%;
      justify-content: center;
      width: 100%;
      padding: 8px 24px;
    }
  }
`;
