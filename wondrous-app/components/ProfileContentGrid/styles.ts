import { Box, Button, CircularProgress } from '@mui/material';
import styled from 'styled-components';

export const ProfileContentGridWrapper = styled(Box)``;

export const ProfileContentGridContainer = styled(Box)`
  position: relative;
  height: fit-content;
`;

export const ProfileContentGridAutosizer = styled(Box)`
  position: relative;
  height: ${({ isVisible }) => (isVisible ? 630 : 100)}px;
  visibility: ${({ isVisible }) => (isVisible ? `visible` : `hidden`)};
  & > div > div {
    :hover {
      &::-webkit-scrollbar {
        display: block;
      }
    }
    &::-webkit-scrollbar {
      display: none;
      position: absolute;
      z-index: 999;
      width: 20px;
      background: transparent;
      border-radius: 0 4px 4px 0;
      outline: none;
    }
    &::-webkit-scrollbar-track {
      background: #606060;
      background-clip: padding-box;
      border: 8px solid rgba(0, 0, 0, 0);
      border-radius: 50px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 50px;
      border: 8px solid rgba(0, 0, 0, 0);
      background: #c4c4c4;
      background-clip: padding-box;
    }
  }
`;

export const ProfileContentGridButtonContainer = styled(Box)`
  padding: 12px 0;
  border-top: 0.5px dashed #4b4b4b;
  display: flex;
  justify-content: center;
`;

export const ProfileContentGridButton = styled(Button)`
  &.MuiButtonBase-root {
    font-family: 'Space Grotesk';
    font-size: 16px;
    color: '#FFFFFF';
    background: #7427ff;
    padding: 8px 10px;
    font-weight: 600;
    text-transform: capitalize;
    border-radius: 6px;

    &.Mui-disabled {
      opacity: 0.2;
      color: #7a7a7a;
      background: #3d3d3d;
    }
  }
`;

export const ProfileContentGridContentWrapper = styled(Box)``;

export const ProfileContentGridContent = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
  > * {
    width: 312px;
  }
`;

export const ProfileContentGridCell = styled(Box)`
  padding: 0 8px;
`;

export const ProfileContentGridLoadingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const ProfileContentGridLoading = styled(CircularProgress)``;
