import { Backdrop } from '@mui/material';
import styled from 'styled-components';
import { HEADER_HEIGHT } from 'utils/constants';

export const SectionWrapper = styled.section`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  position: relative;
  top: ${HEADER_HEIGHT};
`;

export const BackdropComponent = styled(Backdrop)`
  && {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      z-index: 100;
    }
  }
`;
