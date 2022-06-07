import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxWrapper,
  LogoDiv,
  LogoText,
  StyledHr,
  OnboardingTitle,
  ContinueButton,
  LaterButton,
} from './styles';
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';
import DiscordLogo from '../../public/images/onboarding/discord.svg';
import { useRouter } from 'next/router';
import { Metamask } from '../Icons/metamask';
import {FourthStep, SecondStep, ThirdStep} from 'components/Common/Image/OnboardingProgressBar';
import { useWonderWeb3 } from 'services/web3';
import { Field, FieldInput } from '../Common/field';
import { useMe } from '../Auth/withAuth';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import { getDiscordUrl } from 'utils';


const DISCORD_OAUTH_URL = getDiscordUrl();

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
        <FourthStep
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
          Set up your wallet
      </OnboardingTitle>
      <InviteWelcomeBoxParagraph
        style={{
          textAlign: 'left',
          width: '100%',
        }}
      >
          Get paid in USDC, Eth, $WONDER, and your DAOs native social token. <br />
          Don’t have a digital wallet? Click here and we’ll help you set one up.
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
            router.push('/onboarding/email-setup', undefined, {
              shallow: true,
            })
          }
        >
          <InviteWelcomeBoxParagraph>I’ll connect it later</InviteWelcomeBoxParagraph>
        </LaterButton>
          <MetaMaskConnector/>
          {/*<ContinueButton
          style={buttonStyle}
          onClick={() => (window.location.href = DISCORD_OAUTH_URL)}
          buttonInnerStyle={{
            padding: '8px 16px',
          }}
        >
          <Metamask />
          <InviteWelcomeBoxParagraph
            style={{
              marginLeft: '8px',
            }}
          >
            Connect with MetaMask
          </InviteWelcomeBoxParagraph>
        </ContinueButton>*/}
      </div>
    </InviteWelcomeBoxWrapper>
  );
};
