import { Backdrop } from '@mui/material';
import styled from 'styled-components';

export const SectionWrapper = styled.section`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding-top: 28px;
`;

export const BackdropComponent = styled(Backdrop)`
  && {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      z-index: 100;
    }
  }
`;
