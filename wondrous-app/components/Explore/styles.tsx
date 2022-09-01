import { Typography } from '@mui/material';
import styled from 'styled-components';
import MasonryCSS from 'react-masonry-css';
import { ShowMoreButton } from 'components/Common/ListViewAccordion/styles';
import { device } from 'utils/device';
import palette from 'theme/palette';
import { CreateFormPreviewButton } from '../CreateEntity/styles';
import WheelSvg from './wheel.svg';
import Metheor from './metheor.svg';

export const Wheel = styled(WheelSvg)`
  && {
    position: absolute;
    right: 20%;
    bottom: -20%;
    @media ${device.laptop} {
      display: none;
    }
  }
`;

export const MetheorSvg = styled(Metheor)`
  && {
    position: absolute;
    right: 10%;
    top: 5%;
    @media ${device.laptop} {
      top: -10%;
    }
  }
`;

export const BackgroundImg = styled.img`
  @media ${device.laptop} {
    min-height: 425px;
  }
`;

export const BackgroundContainer = styled.div`
  width: 100%;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, #1a1a1a 0%, #1d0052 100%);
  position: relative;
  ${BackgroundImg} {
    width: 100%;
    @media ${device.laptop} {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: left;
    }

    @media ${device.mobileS} {
      font-size: 14px;
    }
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
  @media ${device.mobileL} {
    top: 20%;
  }
`;

export const BackgroundTextHeader = styled(Typography)`
  && {
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
  }
`;

export const BackgroundTextSubHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 33px;
    /* identical to box height, or 206% */

    letter-spacing: 0.0025em;

    color: #ffffff;
  }
`;

export const StyledGridItem = styled.div`
  margin: 0 0 24px 24px;
  background-color: #1e1e1e;
  border-radius: 12px;
  text-align: center;
  padding-bottom: 20px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  position: relative;
  align-items: center;
  overflow: hidden;
  img {
    transition: transform 0.4s ease;
    transform-origin: 50% 50%;
  }
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: none;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    pointer-events: none;
  }

  &:hover {
    background: linear-gradient(180deg, #1e1e1e 50%, #373737 100%);
    &::before {
      background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    }
    img {
      transform: scale(1.1);
    }
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
  width: 80%;
  @media ${device.mobileL} {
    flex-direction: column;
  }
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
      background: ${({ hoverColor, isActive }) => (isActive ? hoverColor : 'none')};
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
      background: ${({ hoverColor, isActive }) => (isActive ? hoverColor : 'none')};
      filter: blur(28px);
      border-radius: 100%;
      left: 0;
      top: 0;
      transform: ${({ rotateDeg, isActive }) => isActive && `rotate(${rotateDeg})`};
    }
  }
  &:hover {
    ${IconWrapper} {
      transform: ${({ rotateDeg, isActive }) => !isActive && `rotate(${rotateDeg})`};

      &::before {
        background: ${({ hoverColor, isActive }) => !isActive && hoverColor};
      }
    }
    span {
      &::after {
        background: ${({ hoverColor, isActive }) => !isActive && hoverColor};
      }
    }
  }
`;

export const ExplorePageContentWrapper = styled.div`
  height: 100%;
  display: flex;
  padding-bottom: 10rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: url('/images/explore/explore-page-background.svg');
  background-size: cover;
`;

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
  width: 80%;
  gap: 24px;
  margin-top: 33px;
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

export const ExplorePageFooter = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${BackgroundImg} {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right;
  }
`;

export const PartnershipRequest = styled.div`
  padding: 24px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
  border: 1px solid #424242;
  border-radius: 6px;
  gap: 12px;
  width: 40%;
  @media ${device.mobileL} {
    width: 80%;
  }
`;

export const PartnershipRequestHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    /* identical to box height, or 121% */

    text-align: center;
    letter-spacing: -0.03em;

    color: #ffffff;
  }
`;

export const LogoContainer = styled.div`
  border-radius: 5px;
  border: 4px solid ${palette.black95};
  margin-top: -32px;
  margin-bottom: 24px;
  z-index: 1;
  display: flex;
`;

export const PartnershipRequestSubheader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    /* identical to box height, or 93% */

    text-align: center;
    letter-spacing: 0.0025em;

    color: #ffffff;
  }
`;

export const ShowMoreButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 0.5px dashed #2b2b2b;
  border-radius: 6px;
  border-top: 0.5px dashed #2b2b2b;
  padding: 10px;
  ${ShowMoreButton} {
    margin-top: 0px;
    width: fit-content;
  }
`;

export const Masonry = styled(MasonryCSS).attrs({
  breakpointCols: {
    default: 3,
    1199: 2,
    599: 1,
  },
  columns: { xs: 1, sm: 2, md: 2, lg: 3 },
  columnClassName: 'masonry-grid-column',
})`
  display: flex;
  margin: -24px 12px 0 -12px;

  .masonry-grid-column > div {
    margin: 24px 12px 0;
  }

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100vw;
    margin-left: 0;
  }
`;
