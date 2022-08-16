import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';

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
