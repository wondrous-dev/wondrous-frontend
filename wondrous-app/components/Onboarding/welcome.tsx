import React, { useState, useEffect } from 'react';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxWrapper,
  LogoImg,
  StyledHr,
  ProgressBar,
  OnboardingTitle,
  ContinueButton,
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ErrorText,
  LabelWrapper,
  Label,
  HeaderWrapper,
  ContentWrapper,
  ContinueButtonWrapper,
} from './styles';

import { useRouter } from 'next/router';

import { FirstStep } from 'components/Common/Image/OnboardingProgressBar';
import { useWonderWeb3 } from 'services/web3';
import { Field, FieldInput } from '../Common/field';
import { USERNAME_REGEX } from 'utils/constants';
import { CompletedIcon } from 'components/Icons/statusIcons';
import { Logo } from 'components/Onboarding/wonderLogo';

export const InviteWelcomeBox = ({ updateUser, user }) => {
  const wonderWeb3 = useWonderWeb3();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username);
  const [error, setError] = useState('');
  // Two stage process as wallet connection takes
  // time.
  const buttonStyle = {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
  };

  useEffect(() => {
    if (user?.username) {
      setUsername(user?.username);
    }
  }, [user?.username]);

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
    const addressTag = wonderWeb3?.wallet?.addressTag;
    if (addressTag) {
      // Check if start of address is 0x
      if (!addressTag.startsWith('0x')) {
        const splitUsernameArr = wonderWeb3?.wallet?.addressTag.split('.');
        if (splitUsernameArr && splitUsernameArr[0]) {
          debugger;
          setUsername(splitUsernameArr[0].replace(/\./g, '_'));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3?.wallet?.addressTag]);

  return (
    <InviteWelcomeBoxWrapper>
      <ContentWrapper>
        <HeaderWrapper>
          <Logo
            divStyle={{
              position: 'relative',
              top: 0,
              left: 0,
            }}
          />
          <LabelWrapper>
            <CompletedIcon fill="none" stroke="none" style={{ width: '26px', height: '26px' }} />{' '}
            <Label>Success! Wallet connected.</Label>
          </LabelWrapper>
        </HeaderWrapper>
        <StyledHr />
        <FirstStep
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
          Welcome to Wonder
        </OnboardingTitle>
        <InviteWelcomeBoxParagraph
          style={{
            textAlign: 'left',
            width: '100%',
          }}
        >
          Earn crypto while contributoring to web3 projects. <br /> Let’s get your membership set up, it’ll take 2
          minutes.
        </InviteWelcomeBoxParagraph>
        <UsernameTitle>Enter your username</UsernameTitle>
        <UsernameDescription>You can do your Twitter handle, Discord, or something new</UsernameDescription>
        <UsernameInput
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          error={!!error}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </ContentWrapper>
      <ContentWrapper>
        <StyledHr />
        <ContinueButtonWrapper>
          <ContinueButton
            style={buttonStyle}
            onClick={() => {
              if (username && user?.username === username) {
                // No change
                router.push('/onboarding/build-profile', undefined, {
                  shallow: true,
                });
              } else {
                if (USERNAME_REGEX.test(username)) {
                  updateUser({
                    variables: {
                      input: {
                        username,
                      },
                    },
                    onError: (e) => {
                      setError(e.message);
                    },
                  });
                } else {
                  setError("Please enter a valid username with 3-15 alphanumeric characters with no '.'");
                }
              }
            }}
            buttonInnerStyle={{
              padding: '8px 16px',
            }}
          >
            <InviteWelcomeBoxParagraph>Continue</InviteWelcomeBoxParagraph>
          </ContinueButton>
        </ContinueButtonWrapper>
      </ContentWrapper>
    </InviteWelcomeBoxWrapper>
  );
};
