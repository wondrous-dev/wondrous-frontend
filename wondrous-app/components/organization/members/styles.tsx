import { Button, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const RequestsContainer = styled.div`
  background: ${palette.black95};
  border-radius: 6px;
  padding: 14px;
  width: 100%;
  margin-bottom: 30px;
`;

export const RequestHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px ${palette.black91} dashed;
`;

export const RequestCountWrapper = styled(Typography)`
  && {
    position: relative;
    padding: 7.5px 10px;
    font-family: 'Space Grotesk';
    font-weight: 500;
    line-height: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 1000px;
    color: ${palette.white};

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(251.85deg, ${palette.white} -32.64%, ${palette.red300} 66.55%);
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1.8px;
      border-radius: 1000px;
    }
  }
`;

export const RequestCount = styled(Typography)`
  && {
    color: ${palette.red750};
    font-family: 'Space Grotesk';
    font-weight: 500;
    line-height: 13px;
  }
`;

export const RequestCountEmptyState = styled(RequestCount)`
  && {
    color: ${palette.white};
  }
`;

export const MemberRequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px ${palette.black91} dashed;
`;

export const MemberRequestCard = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-family: 'Space Grotesk';
  width: 100%;
`;

export const MemberName = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 600;
    color: ${palette.white};
  }
`;

export const MemberMessage = styled(MemberName)`
  && {
    font-weight: 400;
    margin-left: 16px;
    margin-right: 8px;
    color: ${palette.grey57};
    max-width: 82ch;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const RequestActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

export const RequestActionButton = styled(Button)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    padding: 7px 16px;
    border-radius: 1000px;
    color: ${palette.white};
    &.Mui-disabled {
      color: ${palette.white};
    }
  }
`;

export const RequestDeclineButton = styled(RequestActionButton)`
  && {
    background: ${palette.grey78};
    &:hover {
      background: ${palette.grey78};
    }
  }
`;

export const RequestApproveButton = styled(RequestActionButton)`
  && {
    background: ${palette.background.default};
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1.8px;
      border-radius: 1000px;
    }
    &:hover {
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
    }
  }
`;

export const RequestRejectButton = styled(RequestApproveButton)`
  && {
    &::before {
      background: linear-gradient(259.59deg, ${palette.red300} 0%, ${palette.highlightPurple} 93.38%);
    }
    &:hover {
      background: linear-gradient(259.59deg, ${palette.red300} 0%, ${palette.highlightPurple} 93.38%);
    }
  }
`;

export const ShowMoreButton = styled(RequestActionButton)`
  && {
    line-height: 15px;
    letter-spacing: 0.01em;
    margin-top: 8px;
    background: ${palette.highlightPurple};
    border-radius: 6px;
    padding: 10px;

    &:hover {
      background: ${palette.highlightPurple}b3;
    }
  }
`;

export const MemberRequestsListEndMessage = styled(MemberName)`
  && {
    font-weight: 400;
    color: ${palette.grey57};
    text-align: center;
    padding-top: 14px;
  }
`;

export const EmptyMemberRequestsListMessage = styled(MemberRequestsListEndMessage)``;
