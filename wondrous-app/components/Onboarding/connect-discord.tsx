import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxWrapper,
  LogoDiv,
  LogoText,
  StyledHr,
  OnboardingTitle,
  ContinueButton,
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ProfilePictureDiv,
  LaterButton,
} from './styles';
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';
import DiscordLogo from '../../public/images/onboarding/discord.svg';
import DiscordSmallLogo from '../../public/images/onboarding/discord-small.svg';
import { useRouter } from 'next/router';

import { SecondStep, ThirdStep } from '../../components/Common/Image/OnboardingProgressBar';
import { useWonderWeb3 } from '../../services/web3';
import { Field, FieldInput } from '../Common/field';
import { useMe } from '../Auth/withAuth';
import { HighlightBlue } from '../../theme/colors';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { SafeImage } from '../Common/Image';
import ProfilePictureAdd from '../../public/images/onboarding/profile-picture-add.svg';
import { Button } from '../Common/button';

export const Logo = ({ divStyle }) => {
  return (
    <LogoDiv style={divStyle}>
      <WonderLogo />
      <LogoText>Wonder</LogoText>
    </LogoDiv>
  );
};

export const InviteWelcomeBox = ({ updateUser }) => {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const user = useMe();

  const buttonStyle = {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
    position: 'relative',
    marginTop: '24px',
    bottom: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <InviteWelcomeBoxWrapper>
      <Logo
        divStyle={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          marginBottom: '26px',
        }}
      />
      <StyledHr />
      <ThirdStep
        style={{
          width: '100%',
          marginTop: '24px',
        }}
      />
      <OnboardingTitle
        style={{
          textAlign: 'left',
          marginTop: '36px',
          width: '100%',
        }}
      >
        Connect to Discord
      </OnboardingTitle>
      <InviteWelcomeBoxParagraph
        style={{
          textAlign: 'left',
          width: '100%',
        }}
      >
        Connect your Discord to get preapproval to join DAOs you’re a Discord member of.
      </InviteWelcomeBoxParagraph>
      <DiscordLogo />
      <div
        style={{
          width: '100%',
          justifyContent: 'end',
          display: 'flex',
        }}
      >
        <LaterButton
          buttonInnerStyle={{
            padding: '8px',
          }}
          onClick={() =>
            router.push('/onboarding/add-email', undefined, {
              shallow: true,
            })
          }
        >
          <InviteWelcomeBoxParagraph>Later</InviteWelcomeBoxParagraph>
        </LaterButton>
        <ContinueButton
          style={buttonStyle}
          onClick={() =>
            updateUser({
              variables: {
                input: {
                  bio,
                },
              },
            })
          }
          buttonInnerStyle={{
            padding: '8px 16px',
          }}
        >
          <DiscordSmallLogo />
          <InviteWelcomeBoxParagraph
            style={{
              marginLeft: '8px',
            }}
          >
            Connect Discord
          </InviteWelcomeBoxParagraph>
        </ContinueButton>
      </div>
    </InviteWelcomeBoxWrapper>
  );
};
