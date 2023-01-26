import { Box, Button, Typography } from '@mui/material';
import styled from 'styled-components';

export const ProfileContentGridWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProfileContentGridButtonContainer = styled(Box)`
  padding: 12px 0;
  border-top: 0.5px dashed #4b4b4b;
  border-bottom: 0.5px dashed #4b4b4b;
  display: flex;
  justify-content: center;
`;

export const ProfileContentGridEndMessage = styled(Typography)`
  && {
    color: #7a7a7a;
    font-family: 'Space Grotesk';
  }
`;

export const ProfileContentGridButton = styled(Button)`
  display: ${({ disabled }) => (disabled ? 'none' : 'block')};

  &.MuiButtonBase-root {
    font-family: 'Space Grotesk';
    font-size: 16px;
    color: #ffffff;
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

export const ProfileContentGridContent = styled(Box)`
  margin: 0;
  width: fit-content;
  display: flex;
  align-items: flex-start;
  flex-flow: row wrap;
  gap: 12px;
  > * {
    width: 312px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;

    > * {
      width: 100%;
    }
  }
`;
