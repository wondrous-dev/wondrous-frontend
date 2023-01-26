import { Box } from '@mui/material';
import styled from 'styled-components';

export const UserProfileContainerWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #0f0f0f;
  transition: 0.15s all ease;
  padding-bottom: 5px;
`;

export const UserProfileHeaderImageWrapper = styled(Box)`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const UserProfileContainerContent = styled(Box)`
  max-width: 1360px;
  margin: 0 auto;
  padding: 32px;
`;
