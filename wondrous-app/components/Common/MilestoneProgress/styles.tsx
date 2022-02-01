import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';
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
    color: #c4c4c4;
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
