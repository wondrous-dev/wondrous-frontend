import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import palette from 'theme/palette';

export const SpinnerWrapper = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
  .MuiCircularProgress-circle {
    color: ${palette.highlightBlue};
  }
`;

export const Spinner = () => (
  <SpinnerWrapper>
    <CircularProgress />
  </SpinnerWrapper>
);

// linear-gradient(270deg,#ccbbff -5.62%,#7427ff 45.92%,#00baff 103.12%)
