import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

export const ProfileUserTaskDaosWrapper = styled(Box)``;

export const ProfileUserTaskDaosContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

export const ProfileUserTaskDaosTitle = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-weight: 500;
    font-size: 16px;
    color: #ccbbff;
  }
`;
