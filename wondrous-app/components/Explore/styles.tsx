import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from 'utils/constants';
import { CreateFormPreviewButton } from '../CreateEntity/styles';
import Masonry from '@mui/lab/Masonry';
import WheelSvg from './wheel.svg';

export const Wheel = styled(WheelSvg)`
  && {
    position: absolute;
    right: 20%;
    bottom: -20%;
  }
`;

export const BackgroundImg = styled.img``;

export const BackgroundContainer = styled.div`
  width: 100%;
  padding-top: 2rem;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  margin-left: ${SIDEBAR_WIDTH};
  background: linear-gradient(180deg, #1a1a1a 0%, #1d0052 100%);
  position: relative;
  ${BackgroundImg} {
    width: 100%;
  }
`;

export const BackgroundTextWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  flex-direction: column;
  gap: 42px;
  justify-content: flex-start;
  width: 75%;
`;

export const BackgroundTextHeader = styled(Typography)`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-size: 48px;
  line-height: 46px;
  /* identical to box height, or 96% */

  letter-spacing: -0.03em;

  /* glow */

  background: linear-gradient(273.13deg, #fefec0 20.13%, #36a9ff 95.72%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export const BackgroundTextSubHeader = styled(Typography)`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 33px;
  /* identical to box height, or 206% */

  letter-spacing: 0.0025em;

  color: #ffffff;
`;

export const StyledGridContainer = styled(Masonry)`
  && {
    display: flex;
  }
`;

export const StyledGridItemContainer = styled(Grid)`
  max-width: 327px;
  cursor: pointer;
`;
export const StyledGridItem = styled(Grid)`
  && {
    background-color: #1e1e1e;
    border-radius: 12px;
    text-align: center;
    margin: auto;
    margin-top: 20px;
    padding-bottom: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const OrgName = styled(Typography)`
  && {
    color: white;
    font-weight: bold;
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 8px;
  }
`;

export const OrgDescription = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 24px;
    color: #c4c4c4;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const ExploreButton = styled(CreateFormPreviewButton)`
  && {
    margin-left: 0;
    height: auto;
    padding: 4px 16px;
    margin-top: 24px;
    position: absolute;
    bottom: 16px;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 25px;
  margin-top: 24px;
  width: 100%;
  margin-top: 33px;
  margin-left: ${SIDEBAR_WIDTH};
  width: 80%;
`;

export const IconWrapper = styled.div`
  margin-bottom: 16px;
  position: relative;
  transition: transform 0.2s;
`;

export const Tab = styled.button`
  background: #1e1e1e;
  border-radius: 6px;
  padding: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  gap: 24px;
  max-height: 72px;
  span {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 24px;
    position: relative;

    /* identical to box height, or 109% */

    letter-spacing: 0.0025em;

    /* Status - In progress */

    background: ${({ color }) => color};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    &::after {
      background: none;
      content: attr(data-text);
      left: 0;
      filter: blur(18px);
      top: 0;
      z-index: 1;
      position: absolute;
      height: 70%;
      width: 100%;
    }
  }
  ${IconWrapper} {
    svg {
      z-index: 2;
      position: relative;
    }
    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: ${({ iconPseudoStyleWidth = '100%' }) => iconPseudoStyleWidth};
      z-index: 0;
      background: none;
      filter: blur(28px);
      border-radius: 100%;
      left: 0;
      top: 0;
    }
  }
  &:hover {
    ${IconWrapper} {
      transform: ${({ rotateDeg }) => `rotate(${rotateDeg})`};

      &::before {
        background: ${({ hoverColor }) => hoverColor};
      }
    }
    span {
      &::after {
        background: ${({ hoverColor }) => hoverColor};
      }
    }
  }
`;

export const ExplorePageContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: ${SIDEBAR_WIDTH};
  background: url('/images/explore-page-background.svg');
  background-size: cover;
`;

export const OrgsSectionHeader = styled(Typography)`
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
`;
export const SectionSubheader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 14px;
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
  margin-left: ${SIDEBAR_WIDTH};
  margin-top: 33px;
`;
