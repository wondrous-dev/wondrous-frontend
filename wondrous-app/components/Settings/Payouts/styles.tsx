import { Typography } from '@material-ui/core';
import styled from 'styled-components'
import { White } from '../../../theme/colors';

export const PaymentsContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
`;

export const SeeMoreText = styled(Typography)`
  && {
    color: ${White};
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
  }
`;
