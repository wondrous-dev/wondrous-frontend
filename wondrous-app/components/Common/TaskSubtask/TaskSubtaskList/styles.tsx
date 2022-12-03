import Typography from '@mui/material/Typography';
import { Button } from 'components/Common/button';
import { SafeImage } from 'components/Common/Image';
import { ToggleBoardPrivacyIcon } from 'components/Common/PrivateBoardIcon';
import { EmptyStateSubtasksIcon } from 'components/Icons/emptyStates';
import styled from 'styled-components';
import palette from 'theme/palette';

export const TaskSubtaskWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 18px;
`;

export const TaskSubtaskItemWrapper = styled.div`
  padding: 14px;
  background: #1d1d1d;
  border-radius: 2px;
  :hover {
    cursor: pointer;
  }
`;

export const TaskSubtaskItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TaskSubtaskItemContent = styled.div`
  display: flex;
  gap: 8px;
`;

export const TaskSubtaskImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
  min-width: 28px;
`;

export const TaskSubtaskRewardWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: fit-content;
  border-radius: 35px;
  background: ${({ theme }) => theme.palette.grey85};
  height: 28px;
  padding: 0 8px;
`;

export const TaskSubtaskRewardIcon = styled(SafeImage).attrs({ useNextImage: false })`
  && {
    width: 13px;
    height: 13px;
    img[style] {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

export const TaskSubtaskRewardAmount = styled(Typography)`
  && {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const TaskSubtaskPrivacyIcon = styled(ToggleBoardPrivacyIcon)`
  && {
    height: 28px;
    background: ${palette.grey920};
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

export const TaskSubtaskTitle = styled(Typography)`
  && {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.white};
    margin-top: 14px;
  }
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const TaskSubtaskEmptyStateContainer = styled.div`
  width: 100%;
  padding: 14px 0;
  margin-top: 18px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const TaskSubtaskEmptyStateIcon = styled(EmptyStateSubtasksIcon)``;

export const TaskSubTaskEmptyStateText = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey57};
    text-align: center;
  }
`;

export const TaskSubtaskStatus = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  min-width: fit-content;
  border-radius: 4px;
  padding: 1px 8px;
  gap: 8px;
  background-color: ${({ theme }) => theme.palette.black97};
  svg {
    height: 18px;
    width: 18px;
  }
`;

export const TaskSubtaskStatusLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    ${({ theme }) => `
      color: ${theme.palette.white};
    `}
  }
`;

export const TaskSubtaskCoverImageWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const TaskSubtaskCoverImageSafeImage = styled(SafeImage).attrs({ useNextImage: false })`
  width: calc(100% / 3 - 8px);
  height: 120px;
  object-fit: cover;
  object-position: center;
  border-radius: 6px;
  border: 1px solid #424242;
`;

export const TaskSubtaskClaimButtonWrapper = styled(Button)`
  && {
    align-items: center;
    background: linear-gradient(270deg, #00baff -5.62%, #7427ff 45.92%, #ccbbff 103.12%);
    display: flex;
    height: 28px;
    line-height: 0;
    min-height: 0;
    padding: 1px;
    > button {
      align-items: center;
      background: ${({ theme }) => theme.palette.background};
      color: ${({ theme }) => theme.palette.white};
      display: flex;
      font-family: 'Space Grotesk';
      font-size: 14px;
      font-weight: 500;
      gap: 5px;
      height: 26px;
      padding: 4px;
    }
  }
`;
