import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';

export const Panel = styled(Grid)`
  && {
    filter: drop-shadow(0px 4px 34px rgba(0, 0, 0, 0.24));
    border-radius: 16px;
    background: #f7f7f7;
    width: 100%;
  }
`;

export const CampaignOverviewTitle = styled(Typography)`
  && {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
    color: #fee2ca;
  }
`;

export const Label = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 15px;
    min-width: 150px;
    letter-spacing: 0.01em;
    color: #626262;
  }
`;
