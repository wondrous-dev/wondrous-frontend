import { Box, Button } from '@mui/material';
import styled from 'styled-components';

export const ProfileContentGridWrapper = styled(Box)``;

export const ProfileContentGridContainer = styled(Box)`
  position: relative;
  height: 680px;
`;

export const ProfileContentGridAutosizer = styled(Box)`
  height: 630px;
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
`;
