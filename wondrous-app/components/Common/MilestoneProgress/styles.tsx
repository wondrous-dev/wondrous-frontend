import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

import { ProgressBar } from '../ProgressBar';
import { ProgressBarWrapper } from '../ProgressBar/styles';

export const StyledBox = styled(Box)`
  background: #0f0f0f;
  border-radius: 6px;
  padding: 12px 10px 17px;
`;

export const StyledTextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

export const StyledTasksLabel = styled(Typography)`
  && {
    font-weight: 500;
    color: ${palette.white};
    font-family: 'Space Grotesk';
    font-style: normal;
    font-size: 13px;
    line-height: 17px;
  }
`;

export const StyledTasksCount = styled(Typography)`
  && {
    color: #707070;
  }
`;

export const StyledProgressBarWrapper = styled.div`
  ${ProgressBarWrapper} {
    margin-top: 12px;
  }
`;

export const StyledProgressBar = styled(ProgressBar)``;

export const MilestoneProgressViewModalWrapper = styled.div`
  background: #0f0f0f;
  display: flex;
  flex-grow: 1;
  height: 26px;
  border-radius: 6px;
  gap: 9px;
  padding: 0 8px;
`;

export const MilestoneProgressLabel = styled(Typography)`
  && {
    display: flex;
    align-items: center;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 700;
    width: fit-content;
    ${({ theme }) => `
    color: ${theme.palette.white}
  `}
  }
`;

export const MilestoneProgressBarWrapper = styled.div`
  flex-grow: 1;
  ${ProgressBarWrapper} {
    margin-top: 0;
    display: flex;
    align-items: center;
    height: 100%;
    > div {
      height: 5px;
      margin: 0;
    }
  }
`;
