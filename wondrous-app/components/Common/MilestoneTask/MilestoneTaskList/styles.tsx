import { Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import { ToggleBoardPrivacyIcon } from 'components/Common/PrivateBoardIcon';
import CalendarIcon from 'components/Icons/calendar';
import CommentsIcon from 'components/Icons/comments';
import styled from 'styled-components';

export const MilestoneTaskListWrapper = styled.div`
  margin-top: 24px;
`;

export const MilestoneTaskItem = styled.div`
  padding: 18px 0;
  border-top: 1px dashed #2d2d2d;
  border-bottom: 1px dashed #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
`;

export const MilestoneTaskImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    width: 26px;
    height: 26px;
    border-radius: 50%;
  }
  min-width: 26px;
`;

export const MilestoneTaskImageSafeImage = styled(SafeImage).attrs({ useNextImage: false })``;

export const MilestoneTaskTitleAndInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 18px;
  padding-top: 4px;
`;

export const MilestoneTaskTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 15px;
    line-height: 1.5;
    word-break: break-all;
    hyphens: auto;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const MilestoneTaskInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const MilestoneTaskDueDateWrapper = styled.div`
  height: 26px;
  max-width: fit-content;
  border-radius: 4px;
  padding: 1px 8px;
  background: #1d1d1d;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MilestoneTaskDueDateIcon = styled(CalendarIcon)`
  width: 12px;
  height: 12px;
`;

export const MilestoneTaskDueDateText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const MilestoneTaskRewardWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: fit-content;
  border-radius: 35px;
  background: ${({ theme }) => theme.palette.grey85};
  height: 26px;
  padding: 0 8px;
`;

export const MilestoneTaskRewardIcon = styled(SafeImage).attrs({ useNextImage: false })`
  && {
    width: 13px;
    height: 13px;
    img[style] {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

export const MilestoneTaskRewardAmount = styled(Typography)`
  && {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const MilestoneTaskCommentIcon = styled(CommentsIcon)`
  width: 12px;
  height: 12px;
`;

export const MilestoneTaskCommentCount = styled.div`
  display: flex;
  gap: 10px;
`;

export const MilestoneTaskCommentCountText = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const MilestoneTaskPrivacyAndStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 145px;
  justify-content: flex-end;
`;

export const MilestoneTaskPrivacyIcon = styled(ToggleBoardPrivacyIcon)`
  && {
    height: 28px;
    background: #2d2d2d;
    border-radius: 6px;
    width: 28px;
    min-width: 28px;
    margin: 0;
    svg {
      path {
        stroke: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;

export const MilestoneTaskStatus = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  min-width: fit-content;
  border-radius: 4px;
  padding: 1px 8px;
  gap: 8px;
  background-color: #1d1d1d;
  svg {
    height: 18px;
    width: 18px;
  }
`;

export const MilestoneTaskStatusLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    ${({ theme }) => `
      color: ${theme.palette.white};
    `}
  }
`;
