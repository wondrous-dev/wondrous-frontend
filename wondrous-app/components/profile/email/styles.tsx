import { Typography, Button } from '@mui/material';
import styled from 'styled-components';
import { greenColors, greyColors, purpleColors, redColors, white, yellowColors } from 'theme/colors';
import { createSpacingUnit } from 'utils';
import { device } from 'utils/device';

import ClearIcon from '@material-ui/icons/Clear';
import { CenteredFlexRow } from '../../Common';

export const BlurredDiv = styled.div`
  border: 2px solid black;
  text-align: center;
  border-image-slice: 1;
  border-image-source: linear-gradient(179.47deg, #4f8bff 0.46%, #7000ff 295.96%);
  position: relative;
  z-index: 100;
  background: linear-gradient(0deg, rgba(2, 2, 16, 0.45), rgba(2, 2, 16, 0.45));
  background-blend-mode: overlay, normal;
  box-shadow: 0px 14px 44px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(30px);
`;

export const ModalWrapper = styled.div`
  && {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('/images/waitlist/background-desktop.png');
    background-repeat: no-repeat;
    background-position: center; /* Center the image */
    background-size: cover;
    flex-direction: column;
    padding: ${createSpacingUnit(3)};
    background-color: ${purpleColors.purple};
    & .MuiSvgIcon-root {
      fill: ${white};
    }
  }
`;

export const ProfileWrapper = styled(ModalWrapper)`
  && {
    background-image: url('/images/waitlist/waitlist-profile-background.png');
    background-color: ${purpleColors.purple};
  }
`;

export const LogoNoTextImg = styled.img`
  width: ${createSpacingUnit(9.5)};
  margin-bottom: ${createSpacingUnit(2)};
`;

export const Subtext = styled(Typography)`
  && {
    margin-top: ${createSpacingUnit(3)};
    color: ${white};
    font-size: 20px;
    text-align: center;
    line-height: 32px;
    position: relative;
    z-index: 10;

    @media ${device.mobileL} {
      font-size: 16px;
    }

    @media ${device.mobileS} {
      font-size: 14px;
    }
  }
`;

export const Container = styled.div`
  && {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    padding: ${createSpacingUnit(2)};
    background-image: url('/images/waitlist/background-desktop.png');
    background-repeat: no-repeat;
    background-position: center; /* Center the image */
    background-size: cover;
  }
`;

export const CloseModalButton = styled(ClearIcon)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

export const JoinWaitListButton = styled(Button)`
  && {
    padding: ${createSpacingUnit(2)};
    border: 1px solid ${greenColors.green200};
    border-radius: 9px;
    padding: ${createSpacingUnit(1.5)} ${createSpacingUnit(3)};
    margin-top: ${createSpacingUnit(3)};
  }
`;

export const ErrorDiv = styled.div`
  color: ${redColors.red400};
  margin-top: ${createSpacingUnit()};
  margin-bottom: -${createSpacingUnit()};
`;

export const JoinWaitlistHeader = styled(Typography)`
  && {
    color: white;
    text-align: center;
    margin-bottom: ${createSpacingUnit(2)};
    @media ${device.mobileL} {
      font-size: 20px;
    }
    @media ${device.mobileS} {
      font-size: 16px;
    }
  }
`;

export const ExplanationText = styled(Typography)`
  && {
    color: ${white};
    margin-top: ${createSpacingUnit()};
    max-width: ${createSpacingUnit(80)}px;
    font-size: 18px;
    line-height: 28px;
    text-align: center;
    margin-bottom: ${createSpacingUnit(4)};
    @media ${device.mobileL} {
      font-size: 16px;
      line-height: 24px;
      margin-top: ${createSpacingUnit(1.5)};
      margin-bottom: ${createSpacingUnit(1.5)};
    }
  }
`;

export const ProfileText = styled(Typography)`
  && {
    font-size: 16px;
    line-height: 27.5px;
    color: ${white};
  }
`;

export const TokenEarnedDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${purpleColors.purple200};
  border-radius: 289.08px;
  padding-left: ${createSpacingUnit(3)};
  padding-top: ${createSpacingUnit(0.5)};
  padding-bottom: ${createSpacingUnit(0.5)};
  margin-bottom: ${createSpacingUnit(3)};
`;

export const TokenEarnedInnerDiv = styled(TokenEarnedDiv)`
  && {
    background: rgb(91, 0, 255, 0.6);
    padding-left: 0;
    padding-right: ${createSpacingUnit(3)};
    padding-top: 4px;
    margin-bottom: 0;
  }
`;

export const InviteDiv = styled.div`
  background-color: ${purpleColors.purple};
  padding: ${createSpacingUnit(4)};
  @media ${device.tablet} {
    padding: ${createSpacingUnit()};
  }
  @media ${device.mobileL} {
    padding-left: 4px;
    padding-right: 4px;
  }
`;

export const WonderTokenSymbol = styled.img`
  && {
    width: ${createSpacingUnit(6)};
    margin-right: ${createSpacingUnit()};
  }
`;

export const YouHaveText = styled(Typography)`
  && {
    font-size: 23px;
    line-height: 36px;
    color: ${white};
    font-family: Carmen Sans SemiBold;
    margin-right: ${createSpacingUnit(2)};
    @media ${device.mobileL} {
      font-size: 16px;
      line-height: 24px;
    }
  }
`;

export const TokenText = styled(YouHaveText)`
  && {
    color: ${greenColors.green200};
    margin-right: 0;
    font-family: Carmen Sans Bold;
  }
`;

export const MetaTag = styled.span`
  display: block;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-all;
  background: ${greyColors.grey55};
  color: ${greyColors.grey700};
  font-size: 16px;
  line-height: ${createSpacingUnit(2.5)};
  border-radius: ${createSpacingUnit(1)};
  padding: ${createSpacingUnit(4 / 3)} ${createSpacingUnit(2)};
`;

export const LinkBox = styled.div`
  && {
    background: ${purpleColors.purple500};
    border-radius: ${createSpacingUnit()};
    padding: ${createSpacingUnit(2)};

    display: flex;
    align-items: center;
    margin-top: ${createSpacingUnit(3)};
    @media ${device.mobileL} {
      font-size: 16px;
      line-height: 24px;
      margin-top: 0;
    }
  }
`;

export const LinkText = styled(Typography)`
  && {
    font-size: ${createSpacingUnit(2)};
    color: ${white};
    @media ${device.mobileL} {
      font-size: 14px;
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

export const CopyText = styled(Typography)`
  && {
    font-size: ${createSpacingUnit(2)};
    cursor: pointer;
    margin-left: ${createSpacingUnit(2)};
    color: ${greenColors.green200};
    @media ${device.mobileL} {
      font-size: 14px;
    }
  }
`;

export const HomeButtonText = styled(Typography)`
  && {
    font-size: 16px;
    color: ${white};
    font-weight: bold;
    font-family: Carmen Sans SemiBold;
    @media ${device.mobileS} {
      font-size: 14px;
    }
  }
`;

export const ResendLink = styled(Typography)`
  && {
    color: ${white};
    font-size: 16px;
    font-weight: bold;
    text-decoration: underline;
    margin-top: ${createSpacingUnit(2)};
    cursor: pointer;
  }
`;

export const CenteredDiv = styled(BlurredDiv)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: ${createSpacingUnit(91)}px;
    width: 100%;
    padding: ${createSpacingUnit(6)};
    @media ${device.mobileL} {
      margin-top: ${createSpacingUnit(3)};
      padding: ${createSpacingUnit(3)};
    }

    @media ${device.mobileS} {
      padding-left: 4px;
      padding-right: 4px;
    }
  }
`;

export const ProfileCenteredDiv = styled(CenteredDiv)`
  && {
    margin-top: 100px;
    margin-bottom: 100px;
  }

  & > .logo {
    height: 56px;
    margin-bottom: 16px;
  }
`;
export const SmallerCenteredDiv = styled(CenteredDiv)`
  && {
    padding: ${createSpacingUnit(10)} !important;
    @media ${device.mobileL} {
      margin-top: ${createSpacingUnit(3)} !important;
      padding: ${createSpacingUnit(3)} !important;
    }

    @media ${device.mobileS} {
      padding-left: 4px !important;
      padding-right: 4px !important;
    }
  }
`;
export const LinkRow = styled(CenteredFlexRow)`
  && {
    display: flex;
    justify-content: center;
    @media ${device.mobileL} {
      padding: ${createSpacingUnit(1.5)};
    }
  }
`;
export const FunkyText = styled(Typography)`
  && {
    @keyframes shine {
      to {
        background-position: 200% center;
      }
    }
    display: inline;
    font-weight: bold;
    background: linear-gradient(-260deg, #37c6ce 13.71%, #8d6fea 50.94%, #f645e5 70.76%, #37c6ce 100%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    -webkit-animation: shine 8s ease infinite;
    animation: shine 8s ease infinite;
    @media ${device.mobileL} {
      font-size: 28px;
    }
  }
`;

export const FunkyTextYellow = styled(Typography)`
  && {
    @keyframes shine {
      to {
        background-position: 200% center;
      }
    }
    font-size: 18px;
    line-height: 28px;
    display: inline;
    font-weight: bolder;
    color: ${yellowColors.yellow400};
    margin-top: ${createSpacingUnit(3)};
    @media ${device.mobileL} {
      font-size: 16px;
      line-height: 24px;
    }
  }
`;
export const InviteButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InviteButton = styled(Button)`
  && {
    padding: ${createSpacingUnit(2)};
    margin-top: ${createSpacingUnit(3)};
    background: ${purpleColors.purple400};
    border-radius: ${createSpacingUnit()};
    display: flex;
    align-items: center;
    &:hover {
      background: ${purpleColors.purple300};
    }
    @media ${device.mobileL} {
      margin-top: ${createSpacingUnit()};
    }
  }
`;

export const InviteButtonText = styled(Typography)`
  && {
    color: ${greenColors.green200};
    font-weight: bolder;
    font-size: 15px;
  }
`;

export const ReferredText = styled(Typography)`
  && {
    color: ${white};
    margin-top: ${createSpacingUnit(3)};
  }
`;

// export const ReferredText = styled(FunkyText)`
// 	&& {
// 		color: ${greyColors.grey800};
// 		font-size: 18px;
// 		line-height: 28px;
// 		text-align: center;
// 		margin-bottom: ${createSpacingUnit(3)};
// 	}
// `
