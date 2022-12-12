import { Grid } from '@mui/material';
import styled from 'styled-components';

export const Wrapper = styled(Grid)`
  position: relative;
  height: 100%;
  padding-bottom: 24px;
  overflow: hidden;
  img {
    width: 80% !important;
    height: unset !important;
    position: relative !important;
  }
`;
