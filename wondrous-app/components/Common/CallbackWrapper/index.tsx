import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const CallbackBackground = styled.div`
  background-image: url(/images/404/404-background.webp);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1000px;
  width: 100vw;
  height: 573px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 100px;
`;

export const CallbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CallbackHeading = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 32px;
    font-weight: 500;
    color: ${palette.white};
  }
`;
