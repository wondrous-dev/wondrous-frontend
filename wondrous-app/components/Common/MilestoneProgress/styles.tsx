import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { ProgressBar } from '../ProgressBar';
import { ProgressBarWrapper } from '../ProgressBar/styles';
import palette from 'theme/palette';
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
