import { Box } from '@mui/material';
import styled from 'styled-components';

export const UserProfileContainerWrapper = styled(Box)`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #0f0f0f;
  transition: 0.15s all ease;
  padding-bottom: 5px;
  padding-top: 68px;
  padding-left: ${({ minimized }) => (minimized ? 0 : 80)}px;
`;

export const UserProfileHeaderImageWrapper = styled(Box)`
  width: 100%;
  height: 160px;
  overflow: hidden;
  position: relative;
`;

export const UserProfileContainerContent = styled(Box)`
  max-width: 1360px;
  margin: 0 auto;
  padding: 32px;
`;
