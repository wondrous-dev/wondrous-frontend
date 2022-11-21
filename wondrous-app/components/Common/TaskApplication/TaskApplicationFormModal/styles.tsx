import { Box, Button, Dialog, TextareaAutosize, Typography, Input } from '@mui/material';
import styled from 'styled-components';
import { ModalCloseButton } from 'components/Common/ModalCloseButton';

export const TaskApplicationFormModal = styled(Dialog)`
  .MuiPaper-root {
    background: transparent;
    width: 100%;
  }
`;

export const TaskApplicationFormBorder = styled(Box)`
  background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.5) 7.84%, rgba(35, 35, 35, 0.5) 108.71%);
  padding: 1px;
  border-radius: 6px;
`;

export const TaskApplicationFormBackground = styled(Box)`
  background: #1d1d1d;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-radius: inherit;
`;

export const TaskApplicationForm = styled.form``;

export const TaskApplicationFormTextarea = styled(TextareaAutosize)`
  color: #c4c4c4;
  border-radius: 6px;
  background: #0f0f0f;
  width: 100%;
  font-family: var(--font-space-grotesk);
  font-size: 16px;
  font-weight: 400;
  border: none;
  resize: none;
  min-height: 150px;
  padding: 14px;
  &:focus {
    outline: none;
  }
`;

export const TaskApplicationFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px dashed #4b4b4b;
  padding: 24px;
`;

export const TaskApplicationFormHeaderText = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
`;

export const TaskApplicationFormHeaderCloseButton = styled(ModalCloseButton)``;

export const TaskApplicationTextAreaCount = styled.span`
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  float: right;
  text-align: right;
  letter-spacing: 0.01em;

  color: #828282;
`;

export const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const LinkTitleInput = styled(Input)`
  && {
    height: 40px;
    background: #0f0f0f;
    border-radius: 4px;
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: rgb(196, 196, 196);
    padding: 14px;
  }
`;

export const LinkUrlInput = styled(Input)`
  && {
    height: 40px;
    background: #0f0f0f;
    border-radius: 4px;
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: rgb(196, 196, 196);
    padding: 14px;
    width: 100%;
  }
`;

export const TaskApplicationFormModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const IconWrapper = styled.button`
  background: #282828;
  border-radius: 4px;
  border: 0px;
  cursor: pointer;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    pointer-events: none;
    opacity: 0.7;
  }
`;
