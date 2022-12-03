import Typography from '@mui/material/Typography';
import { EmptyStateTasksIcon } from 'components/Icons/emptyStates';
import styled from 'styled-components';

export const MilestoneTasksEmptyStateContainer = styled.div`
  width: 100%;
  padding: 14px 0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const MilestoneTasksEmptyStateIcon = styled(EmptyStateTasksIcon)``;

export const MilestoneTasksEmptyStateText = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey57};
    text-align: center;
  }
`;
