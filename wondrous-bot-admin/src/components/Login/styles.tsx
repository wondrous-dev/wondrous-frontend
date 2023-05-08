import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';

export const MainWrapper = styled(Grid)`
  && {
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background: url('/images/wonder-bg.png') no-repeat center center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    padding: 0 20px;

    @media (min-width: 641px) {
      padding: 0;
    }
  }
`;

export const ErrorTypography = styled(Typography)`
  && {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    color: #ff0000;
  }
`;


export const SuccessTypography = styled(ErrorTypography)`
  && {
    color: #2A8D5C;
  }
`;

export const Connectors = styled(Grid)`
  && {
    background: #f7f7f7;
    padding: 24px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
`;
