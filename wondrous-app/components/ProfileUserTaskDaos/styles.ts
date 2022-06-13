import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

export const ProfileUserTaskDaosWrapper = styled(Box)`
  margin-top: 32px;
`;

export const ProfileUserTaskDaosContainer = styled(Box)`
  margin-top: 3px;
  border-bottom: 0.5px dashed #4b4b4b;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProfileUserTaskDaosTitle = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 16;
    color: #ccbbff;
  }
`;
