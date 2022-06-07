import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxWrapper,
  StyledHr,
  OnboardingTitle,
  ContinueButton,
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ProfilePictureDiv,
  LaterButton,
  ContinueButtonWrapper,
  BackButton,
  RightButtons,
  LeftButtons,
  ActionButtons,
} from './styles';
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';
import DiscordLogo from '../../public/images/onboarding/discord.svg';
import DiscordSuccessLogo from '../../public/images/onboarding/discord-success.svg';
import DiscordSmallLogo from '../../public/images/onboarding/discord-small.svg';
import { useRouter } from 'next/router';

import { SecondStep, ThirdStep } from 'components/Common/Image/OnboardingProgressBar';
import { useWonderWeb3 } from 'services/web3';
import { Field, FieldInput } from '../Common/field';
import { useMe } from '../Auth/withAuth';
import { getDiscordUrl } from 'utils';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { Logo } from 'components/Onboarding/wonderLogo';
import { DISCORD_CONNECT_TYPES } from 'utils/constants';
import { ErrorText } from 'components/Common';

const DISCORD_OAUTH_URL = getDiscordUrl();

export const InviteWelcomeBox = ({ updateUser }) => {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const user = useMe();
  const { discordUserExists, discordError, success } = router.query;

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
      {success ? (
        <OnboardingTitle
          style={{
            textAlign: 'left',
            marginTop: '36px',
            width: '100%',
          }}
        >
          Success!
        </OnboardingTitle>
      ) : (
        <OnboardingTitle
          style={{
            textAlign: 'left',
            marginTop: '36px',
            width: '100%',
          }}
        >
          Connect to Discord
        </OnboardingTitle>
      )}

      {success ? (
        <InviteWelcomeBoxParagraph
          style={{
            textAlign: 'left',
            width: '100%',
          }}
        >
          You have connected the Discord.
        </InviteWelcomeBoxParagraph>
      ) : (
        <InviteWelcomeBoxParagraph
          style={{
            textAlign: 'left',
            width: '100%',
          }}
        >
          Connect your Discord to get preapproval to join DAOs you’re a Discord member of. This is necessary if you want
          admin level permissions and are a core contributor.
        </InviteWelcomeBoxParagraph>
      )}

      {success ? <DiscordSuccessLogo /> : <DiscordLogo />}
      <StyledHr />
      {+discordUserExists && <ErrorText>Discord user already connected to another account</ErrorText>}
      {+discordError && !+discordUserExists && (
        <ErrorText>Error connecting to Discord. Please try again or contact support.</ErrorText>
      )}

      {success ? (
        <ActionButtons
          style={{
            justifyContent: 'end',
          }}
        >
          <ContinueButtonWrapper>
            <ContinueButton
              style={buttonStyle}
              onClick={() =>
                router.push('/onboarding/set-up-wallet', undefined, {
                  shallow: true,
                })
              }
              buttonInnerStyle={{
                padding: '8px 16px',
              }}
            >
              <InviteWelcomeBoxParagraph>Continue</InviteWelcomeBoxParagraph>
            </ContinueButton>
          </ContinueButtonWrapper>
        </ActionButtons>
      ) : (
        <ActionButtons>
          <LeftButtons
            style={{
              width: '30%',
            }}
          >
            <BackButton
              onClick={() => {
                router.push('/onboarding/build-profile', undefined, {
                  shallow: true,
                });
              }}
            >
              <LeftArrowIcon />
            </BackButton>
          </LeftButtons>
          <RightButtons
            style={{
              width: '70%',
            }}
          >
            <LaterButton
              buttonInnerStyle={{
                padding: '8px 30px',
                background: '#232323',
              }}
              onClick={() =>
                router.push('/onboarding/set-up-wallet', undefined, {
                  shallow: true,
                })
              }
            >
              <InviteWelcomeBoxParagraph>Later</InviteWelcomeBoxParagraph>
            </LaterButton>
            <ContinueButton
              style={buttonStyle}
              onClick={() => {
                const state = JSON.stringify({
                  callbackType: DISCORD_CONNECT_TYPES.connectOnboarding,
                });
                window.location.href = `${DISCORD_OAUTH_URL}&state=${state}`;
              }}
              buttonInnerStyle={{
                padding: '8px 19px',
                height: '36px',
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
          </RightButtons>
        </ActionButtons>
      )}
    </InviteWelcomeBoxWrapper>
  );
};
