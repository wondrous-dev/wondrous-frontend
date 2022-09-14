import styled from 'styled-components';
import { Typography } from '@mui/material';
import { Masonry } from '@mui/lab';

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

export const BountySectionHeader = styled(OrgsSectionHeader)`
  && {
    background: linear-gradient(180deg, #ffffff 0%, #ffd653 100%);
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
  width: 80%;
  gap: 24px;
  margin-top: 33px;
`;

export const ShowMoreButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 0.5px dashed #2b2b2b;
  border-radius: 6px;
  border-top: 0.5px dashed #2b2b2b;
  padding: 10px;
  margin-top: 0px;
  width: fit-content;
`;

export const StyledGridContainer = styled(Masonry)``;
