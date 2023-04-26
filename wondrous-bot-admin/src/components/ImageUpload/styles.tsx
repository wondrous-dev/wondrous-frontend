import { ButtonBase, Typography } from '@mui/material';
import styled, { css } from 'styled-components';

export const ImageUploadBlock = styled.div`
  width: 100%;
  padding: 0 0 30px 0;
`;

export const ImageUploadBlockActivitySection = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 10px;
`;

export const ImageUploadBlockInput = styled.input`
  position: absolute;
  color: deepskyblue;
  background-color: transparent;
  border-bottom: 1px solid deepskyblue;
  cursor: pointer;
  display: none;
`;

export const ImageUploadBlockInputWrapper = styled.div<{ isIcon: boolean }>`
  position: relative;
  width: ${({ isIcon }) => (isIcon ? '80px' : '100%')};
  height: ${({ isIcon }) => (isIcon ? '80px' : 'auto')};
`;

export const LabelBlock = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: red;
    margin-bottom: 10px;
  }
`;

export const ImageUploadButton = styled.div<{ marginLeft: string }>`
  text-align: center;
  width: 48px;
  height: 48px;
  background-color: #1D1D1D;
  opacity: 0.4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  margin-left: ${({ marginLeft }) => marginLeft || 0};
`;

export const ImageComponent = styled<{ borderRadius: boolean }>('img')`
  width: 100%;
  ${({ borderRadius }) =>
    borderRadius &&
    css`
      border-radius: 50%;
    `};
`;

export const ImageUploadBlockActionIcons = styled.div`
  display: flex;
  margin-left: 18px;
`;

export const ToolButton = styled(ButtonBase)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 36px;
    height: 36px;
    background: #313131;
    border-radius: 6px;
    fill: #313131;
    margin-right: 12px;

    button {
      background: #313131;
      border-radius: 6px;
    }
  }
`;

export const ImageUploadButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  padding: 18px;
  border-radius: 100%;
  background: ${({ hasImage }) => (hasImage ? '' : '#E8E8E8')};
  display: flex;
  align-items: center;
  width: ${({ isHeader }) => (isHeader ? '100%' : 'auto')};
  border-radius: ${({ isHeader }) => (isHeader ? '6px' : 'auto')};
  display: ${({ isHeader }) => (isHeader ? 'flex' : 'auto')};
  justify-content: ${({ isHeader }) => (isHeader ? 'center' : 'auto')};
`;
