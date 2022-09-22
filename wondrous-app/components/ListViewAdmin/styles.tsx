import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import typography from 'theme/typography';
import AttachFileIcon from 'components/Icons/attachFile.svg';
import { RequestApproveButton } from 'components/organization/members/styles';

export const BoldName = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 15px;
    line-height: 23px;
    color: ${palette.white};
  }
`;

export const Description = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: ${palette.grey250};
  }
`;

export const IconContainer = styled.div`
  background: ${palette.highlightPurple};
  height: 26px;
  width: 26px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const IconsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const MediaIcon = styled(AttachFileIcon)`
  width: 15px;
  height: 16px;
  path {
    stroke: ${palette.white};
  }
`;

export const ApproveButton = styled(RequestApproveButton)`
  && {
    &::before {
      background: ${({ isCompleted }) =>
        !isCompleted
          ? `linear-gradient(270deg, ${palette.green30} -5.62%, ${palette.highlightPurple} 103.12%)`
          : palette.green30};
    }
    &:hover {
      background: linear-gradient(270deg, ${palette.green30} -5.62%, ${palette.highlightPurple} 103.12%);
    }
  }

  span {
    z-index: 1;
  }
`;

export const DeclineButton = styled(RequestApproveButton)`
  && {
    &::before {
      background: linear-gradient(270deg, ${palette.red300} -5.62%, ${palette.highlightPurple} 103.12%);
    }
    &:hover {
      background: linear-gradient(270deg, ${palette.red300} -5.62%, ${palette.highlightPurple} 103.12%);
    }
  }

  span {
    z-index: 1;
  }
`;

export const RequestChangesButton = styled(RequestApproveButton)`
  && {
    &::before {
      background: linear-gradient(270deg, ${palette.yellow800} -5.62%, ${palette.highlightPurple} 103.12%);
    }
    &:hover {
      background: linear-gradient(270deg, ${palette.yellow800} -5.62%, ${palette.highlightPurple} 103.12%);
    }
  }
`;

export const DueDateWrapper = styled.div`
  display: flex;
  gap: 6px;
  color: ${palette.white};
  font-weight: 600;
  align-items: center;
  justify-content: center;
  padding: 1px 8px;
  background-color: ${palette.grey900};
  font-family: ${typography.fontFamily};
  font-size: 13px;
  border-radius: 4px;
`;
