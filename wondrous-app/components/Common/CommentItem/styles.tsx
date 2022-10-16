import { Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import styled from 'styled-components';
import palette from 'theme/palette';

const highlightComment = keyframes`
  from {
      background: ${palette.grey250};
   }
    to {
      background: transparent;
    }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid ${palette.grey87};
  padding: 12px 0px;
  ${({ highlight }) =>
    highlight &&
    `
    animation-name: ${highlightComment};
    animation-duration: 2s;
    padding: 2px;
    border-radius: 4px
  `}
`;

export const Role = styled(Typography)`
  && {
    background: ${palette.grey99};
    color: ${palette.blue20};
    padding: 4px 8px;
    height: 26px;
    font-weight: 500;
    font-size: 14px;
    border-radius: 4px;
  }
`;

export const CommentText = styled(Typography)`
  && {
    font-size: 13px;
    line-height: 20px;
    color: ${palette.white};
    text-align: left;
    white-space: pre-line;
  }
`;

export const DeleteText = styled(Typography)`
  && {
    color: white;
    text-decoration: underline;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }
`;

export const Creator = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.white};
    font-size: 13px;
    line-height: 20px;
    font-weight: bold;
    margin-right: 8px;
  }
`;

export const TimeText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
  }
`;
