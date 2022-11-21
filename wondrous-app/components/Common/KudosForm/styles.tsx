import { Box, Button, Dialog, TextareaAutosize, Typography, Divider } from '@mui/material';
import styled from 'styled-components';
import { Button as SubmitButton } from '../button';
import { ModalCloseButton } from '../ModalCloseButton';

export const KudosFormModal = styled(Dialog)`
  width: 100%;
  background: transparent;
`;

export const KudosFormBorder = styled(Box)`
  background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.5) 7.84%, rgba(35, 35, 35, 0.5) 108.71%);
  padding: 1px;
  border-radius: 6px;
`;

export const KudosFormBackground = styled(Box)`
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  padding: 24px;
  border-radius: inherit;
`;

export const KudosFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const KudosFormHeaderText = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
`;

export const KudosFormHeaderCloseButton = styled(ModalCloseButton)``;

export const KudosFormTextareaWrapper = styled.div`
  margin-top: 42px;
  color: #c4c4c4;
  background: #0f0f0f;
  border-radius: 6px;
  padding: 15px 18px;
`;

export const KudosFormTextarea = styled(TextareaAutosize)`
  color: #c4c4c4;
  border-radius: 6px;
  background: #0f0f0f;
  width: 100%;
  font-family: var(--font-space-grotesk);
  font-size: 16px;
  font-weight: 400;
  border: none;
  resize: none;

  &:focus {
    outline: none;
  }
`;

export const KudosFormTextareaCharacterCount = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    text-align: right;
    color: #828282;
  }
`;

export const KudosFormError = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: #ff0000;
    margin-top: 8px;
  }
`;

export const KudosFormDivider = styled(Divider)`
  && {
    background: #363636;
    width: 100%;
    margin-top: 24px;
    height: 1px;
  }
`;

export const KudosFormButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

export const KudosFormCancelButton = styled(Button)`
  && {
    background: #232323;
    font-family: var(--font-space-grotesk);
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    padding: 10px 12px;
  }
`;

export const KudosFormSubmitButton = styled(SubmitButton)`
  background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  max-width: fit-content;
  font-family: var(--font-space-grotesk);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
`;

export const KudosFormSubmitButtonText = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
  }
`;
