import styled from 'styled-components';
import { Typography } from '@mui/material';
import { Masonry } from '@mui/lab';
import Grid from '@mui/material/Grid';
import { white } from 'theme/colors';
import typography from 'theme/typography';

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

export const GR15DEIExplainerContainer = styled(Grid)``;

export const Gr15DEIExplainer = styled(Grid)`
  && {
    padding: 0;
    padding-right: 12px;
  }
`;

export const Gr15DEIExplainerInnerDiv = styled.div`
  border: 1px solid rgba(66, 66, 66, 1);
  border-radius: 8px;
  padding: 16px;
  height: 100%;
`;

export const Gr15DEIExplainerTitleText = styled(Typography)`
  && {
    background-color: #e2fffa;
    background-image: linear-gradient(89.99deg, #fba3b8 0%, #ffe98a 96.33%);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 8px;
  }
`;

export const Gr15DEIExplainerSubheader = styled(Typography)`
  && {
    background-color: #e2fffa;
    background-image: linear-gradient(0deg, #ccbbff, #ccbbff);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 16px;
  }
`;

export const Gr15DEIExplainerDescription = styled(Typography)`
  && {
    color: ${white};
    font-size: 15px;
    line-height: 23px;
    font-weight: 400;
  }
`;
export const Gr15DEIExploreOrgsContainer = styled(Grid)`
  && {
    padding: 0;
    padding-right: 12px;
  }
`;

export const Gr15DEIExploreOrgsInnerDiv = styled.div`
  text-align: center;
  width: 100%;
`;

export const Gr15DEIButtonText = styled(Gr15DEIExplainerDescription)`
  && {
    font-weight: 500;
    padding: 12px;
  }
`;

export const Gr15DEIButtonDiv = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

export const OrgItemContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 12px;
  cursor: pointer;
  border-radius: 8px;
  padding: 12px;
  &:hover {
    background: rgba(45, 45, 45, 1);
  }
`;

export const OrgItemDescriptionDiv = styled.div`
  margin-left: 8px;
`;

export const OrgItemDescriptionTitle = styled(Typography)`
  && {
    color: ${white};
    font-weight: 500;
    font-size: 17px;
  }
`;

export const OrgItemDescription = styled(Typography)`
  && {
    color: ${white};
    font-size: 14px;
  }
`;

export const Gr15Img = styled.img`
  height: 100%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;
