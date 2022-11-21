import { Typography } from '@mui/material';
import styled from 'styled-components';
import { device } from 'utils/device';
import palette from 'theme/palette';
import { CreateFormPreviewButton } from '../CreateEntity/styles';
import WheelSvg from './wheel.svg';
import Metheor from './metheor.svg';

const styles = {
  filterButton: {
    justifySelf: 'left',
    color: 'white',
    mr: 'auto',
    backgroundColor: '#4000b3',
    border: `1px solid #7427FF`,
    borderRadius: '6px',
    px: 1.5,
  },
};

export default styles;

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
    font-family: var(--font-space-grotesk);
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
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 33px;
    /* identical to box height, or 206% */

    letter-spacing: 0.0025em;

    color: #ffffff;
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
  justify-content: center;
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
    font-family: var(--font-space-grotesk);
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
  display: flex;
  padding-bottom: 10rem;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  transition: padding 300ms cubic-bezier(0, 0, 0.2, 1);
  padding-left: ${({ filtersOpen }) => (filtersOpen ? '240px' : '0px')};
  background: url('/images/explore/explore-page-background.svg');
  background-size: cover;
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
    font-family: var(--font-space-grotesk);
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
    font-family: var(--font-space-grotesk);
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
