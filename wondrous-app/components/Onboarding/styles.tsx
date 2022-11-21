import styled from 'styled-components';
import { TextField, Typography } from '@mui/material';
import palette from 'theme/palette';
import { Button } from '../Common/button';
import { SafeImage } from '../Common/Image';

export const MainWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url('/images/onboarding/background.png') no-repeat center center ${palette.background.default};
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  padding: 0 20px;

  @media (min-width: 641px) {
    padding: 0;
  }
`;

export const LogoDiv = styled.div`
  display: flex;
  align-items: center;
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
  width: 100%;

  @media (max-width: 640px) {
    min-width: 320px;
    padding: 20px;
  }
`;

export const OrgProfilePicture = styled(SafeImage).attrs({ useNextImage: false })`
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
    color: ${palette.white};
    margin-bottom: 20px;
  }
`;

export const InviteWelcomeBoxParagraph = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 16px;
    font-weight: normal;
  }
`;

export const DataProtectBoxParagraph = styled(Typography)`
  && {
    color: ${palette.white};
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
  height: 1px;
  border: 1px solid ${palette.grey85};
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
    color: ${palette.white};
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
    color: ${palette.grey250};
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
    color: ${palette.red400};
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
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    color: ${palette.white};
    margin-left: 2px;
  }
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

export const ActionButtons = styled.div`
  width: 100%;
  justify-content: end;
  display: flex;
  flex-direction: row;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
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
  padding-top: 10px;
  width: 100%;

  svg {
    flex: 0 0 37px;
  }

  button {
    justify-content: unset;
    font-weight: 500;
  }

  div:nth-child(1) {
    background: linear-gradient(270deg, #7427ff, #f5841f);
  }
  div:nth-child(2) {
    background: linear-gradient(270deg, #7427ff, #0052ff);
  }
  div:nth-child(3) {
    background: linear-gradient(270deg, #7427ff, #3b99fc);
  }
  div:nth-child(4) {
    background: linear-gradient(270deg, #7427ff, #7e89ff);
  }
  div:nth-child(5) {
    background: linear-gradient(270deg, #7427ff, #06ffa5);
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

export const LogoText = styled.div`
  font-size: 20px;
`;

export const DataLink = styled.a`
  color: ${palette.highlightBlue};
  text-decoration: underline;
  font-weight: 500;
`;

export const QRCodeTwitter = styled.div`
  width: 305px;
  height: 328px;
  background-color: #d9d9d9;
`;
