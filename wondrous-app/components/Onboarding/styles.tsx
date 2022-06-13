import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import Image from 'next/image';
import { Grey250, Grey85, Red400, White, Background, HighlightBlue } from '../../theme/colors';
import { Button } from '../Common/button';
import { SafeImage } from '../Common/Image';

export const MainWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url('/images/onboarding/background.png') no-repeat center center ${Background};
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
`;

export const LogoDiv = styled.div`
  display: flex;
  align-items: center;
  //position: absolute;
  //left: 40px;
  //top: 30px;
`;

export const LogoImg = styled.img`
  width: 40px;
  height: 30px;
`;

export const InviteWelcomeBoxWrapper = styled.div`
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  border-radius: 6px;
  padding: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: 80vh;
  max-width: 634px;

  @media (max-width: 640px) {
    min-width: 320px;
    padding: 20px;
  }
`;

export const OrgProfilePicture = styled(SafeImage)`
  && {
    margin-bottom: 20px;
    width: 77px;
    height: 77px;
  }
`;

export const InviteWelcomeBoxTitle = styled(Typography)`
  && {
    font-size: 24px;
    font-weight: bold;
    color: ${White};
    margin-bottom: 20px;
  }
`;

export const InviteWelcomeBoxParagraph = styled(Typography)`
  && {
    color: ${White};
    font-size: 16px;
    font-weight: normal;
  }
`;

export const DataProtectBoxParagraph = styled(Typography)`
  && {
    color: ${White};
    font-size: 14px;
    font-weight: normal;
    margin-top: 30px;
  }
`;

export const MetamaskButton = styled(Button)`
  && {
    margin-top: 32px;
  }
`;

export const StyledHr = styled.hr`
  background: ${Grey85};
  height: 1px;
  width: 100%;
  border: 0;
`;

export const ProgressBar = styled.img`
  && {
    margin-top: 26px;
  }
`;

export const OnboardingTitle = styled(Typography)`
  && {
    font-size: 28px;
    color: ${White};
    margin-top: 18px;
    margin-bottom: 18px;
    font-weight: 500;
  }
`;

export const ButtonDiv = styled.div`
  width: 100%;
`;

export const ContinueText = styled(Typography)`
  && {
  }
`;

export const UsernameTitle = styled(Typography)`
  && {
    color: #ccbbff;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    margin-top: 36px;
    width: 100%;
    padding-top: 3px;
  }
`;

export const UsernameDescription = styled(UsernameTitle)`
  && {
    color: ${Grey250};
    margin-top: 8px;
    margin-bottom: 26px;
    font-weight: 400;
  }
`;

export const UsernameInput = styled(TextField)({
  '&.MuiTextField-root': {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#0F0F0F',
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    border: '1px solid #4B4B4B',
  },
  '& .MuiInputBase-input': {
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: '0.01em',
    padding: '11px 14px',
    color: '#C4C4C4',
    fontWeight: '500px',
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid violet',
  },
});

export const ProfilePictureDiv = styled.div`
  width: 100%;
  position: relative;
`;

export const ErrorText = styled(Typography)`
  && {
    color: ${Red400};
    font-size: 14px;
  }
`;

export const WalletConnected = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #12413d;
  padding: 2px 7px 2px 2px;
  border-radius: 6px;
`;

export const Label = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    color: ${White};
    margin-left: 2px;
  }
`;

// TODO: REmove
export const ContentWrapper = styled.div`
  //width: 100%;
`;

export const RemovePictureBtn = styled.button`
  display: flex;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  color: #cb3340;
  margin-top: 11px;
  margin-bottom: 41px;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
`;

// export const RemovePictureDiv = styled.div`
//   width: 100%;
// `;

// @ts-ignore
export const ActionButtons = styled.div`
  width: 100%;
  justify-content: end;
  display: flex;
  flex-direction: row;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

// TODO: Rename/remove
// @ts-ignore
export const LeftButtons = styled.div`
  width: 50%;
  justify-content: start;
  display: flex;
  align-items: flex-end;
`;

// TODO: Rename/remove
// @ts-ignore
export const RightButtons = styled.div`
  width: 50%;
  justify-content: end;
  display: flex;
  align-items: flex-end;
`;

export const Logo = styled.div`
  text-align: center;
  margin: 20px auto;
`;

export const Connectors = styled.div`
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px dashed #2B2B2B;
  padding-top: 10px;

  svg {
    flex: 0 0 40px;
  }

  button {
    justify-content: unset;
    font-weight: 500;
  }
  div:first-child {
    background: linear-gradient(270deg, #7427FF,  #F5841F);
  }
  div:nth-child(2) {
    background: linear-gradient(270deg, #7427FF,  #0052FF);
  }
  div:nth-child(3) {
    background: linear-gradient(270deg, #7427FF,  #3B99FC);
  }
  div:nth-child(4) {
    background: linear-gradient(270deg, #7427FF,  #7E89FF);
  }
  div:nth-child(5) {
    background: linear-gradient(270deg, #7427FF,  #06FFA5);
  }
  div > button {
    padding: 8px 0;
  }
`;

export const TwitterTitle = styled.div`
  color: white;
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 93px;
  width: 100%;
`;

export const AlignButtonTwitter = styled.div`
  padding: 16px 21px 8px 0;
`;

export const TwitterContent = styled.div`
  display: unset;
  flex-direction: unset;
  text-align: center;
  max-width: 326px;
  width: 100%;
`;

export const LogoText = styled.div`
  font-size: 20px;
`;

export const DataLink = styled.a`
  color: ${HighlightBlue};
  text-decoration: underline;
  font-weight: 500;
`;

export const QRCodeTwitter = styled.div`
  width: 305px;
  height: 328px;
  background-color: #d9d9d9;
`;
