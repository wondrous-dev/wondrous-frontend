import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const SpinnerWrapper = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
`;

export const Spinner = () => (
  <SpinnerWrapper>
    <CircularProgress />
  </SpinnerWrapper>
);

export const PageDescription = styled(Typography)`
  && {
    font-size: 15px;
    font-family: ${typography.fontFamily};
    margin-top: 5px;
    margin-bottom: 10px;
    color: ${palette.grey79};
  }
`;
