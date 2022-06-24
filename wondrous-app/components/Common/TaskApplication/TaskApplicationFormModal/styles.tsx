import { Box, Button, Dialog, TextareaAutosize, Typography, Input } from '@mui/material';
import styled from 'styled-components';
import { Button as SubmitButton } from 'components/Common/button';
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
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  padding: 24px;
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
  font-family: 'Space Grotesk';
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
  padding-bottom: 18px;
`;

export const TaskApplicationFormHeaderText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
`;

export const TaskApplicationFormHeaderCloseButton = styled(ModalCloseButton)``;

export const TaskApplicationTextAreaCount = styled.span`
  font-family: 'Space Grotesk';
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
  height: 40px;
  background: #0f0f0f;
  border-radius: 4px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #828282;
  padding: 14px;
`;

export const LinkUrlInput = styled(Input)`
  height: 40px;
  background: #0f0f0f;
  border-radius: 4px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #828282;
  padding: 14px;
`;
