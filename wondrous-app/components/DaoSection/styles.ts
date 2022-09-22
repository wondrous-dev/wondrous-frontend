import { Typography } from '@mui/material';
import styled from 'styled-components';

export const OrgsSectionHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 24px;
    /* identical to box height, or 86% */

    letter-spacing: 0.0025em;

    /* Status - Proposal */

    background: linear-gradient(46.92deg, #b820ff 8.72%, #ffffff 115.55%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;
export const SectionSubheader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    /* identical to box height, or 93% */

    letter-spacing: 0.0025em;

    color: #ffffff;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 80%;
  gap: 24px;
  margin-top: 33px;
`;
