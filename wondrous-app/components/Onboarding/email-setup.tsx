import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation } from '@apollo/client';
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
  ErrorText,
  LaterButton,
} from './styles';

import { useRouter } from 'next/router';

import { FourthStep, ThirdStep } from 'components/Common/Image/OnboardingProgressBar';
import { CircularProgress } from '@material-ui/core';
import { StyledCancelButton } from '../Common/ArchiveTaskModal/styles';
import { validateEmail } from 'utils/constants';
import { SET_USER_SIGNUP_COMPLETE } from 'graphql/mutations';
import { Logo } from 'components/Onboarding/wonderLogo';

export const InviteWelcomeBox = ({ updateUser, firstOrg, firstPod }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null);
  const router = useRouter();
  const [setUserSignupComplete] = useMutation(SET_USER_SIGNUP_COMPLETE);
  const buttonStyle = {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
    position: 'relative',
    marginTop: '24px',
    bottom: '0',
    right: '0',
  };

  useEffect(() => {
    setUserSignupComplete();
  }, []);

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
      <StyledHr
        style={{
          marginBottom: '26px',
        }}
      />
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
        Set up your email
      </OnboardingTitle>
      <InviteWelcomeBoxParagraph
        style={{
          textAlign: 'left',
          width: '100%',
          // marginBottom: '35px',
          fontSize: '15px',
          lineHeight: '19px',
          fontWeight: '400',
        }}
      >
        Set up your accounts so you can begin contributing.
      </InviteWelcomeBoxParagraph>
      <UsernameTitle
        style={{
          marginBottom: '14px',
        }}
      >
        Enter your email
      </UsernameTitle>
      <UsernameInput
        type="email"
        name="email"
        value={email}
        error={error}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
        }}
        placeholder="Enter your best email"
        required
      />
      {/*<InviteWelcomeBoxParagraph*/}
      {/*  style={{*/}
      {/*    textAlign: 'left',*/}
      {/*    width: '100%',*/}
      {/*    marginTop: '24px',*/}
      {/*    color: '#C4C4C4',*/}
      {/*    fontSize: '14px',*/}
      {/*    fontWeight: '400',*/}
      {/*    fontHeight: '18px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Get updated on your tasks & payments.*/}
      {/*</InviteWelcomeBoxParagraph>*/}
      <StyledHr
        style={{
          marginTop: '180px',
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {loading ? (
        <CircularProgress
          style={{
            marginTop: '16px',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            justifyContent: 'end',
            display: 'flex',
          }}
        >
          <LaterButton
            onClick={() => {
              if (!firstOrg && !firstPod) {
                // Should go to explore but let's go to dashboard for now
                router.push('/dashboard', undefined, {
                  shallow: true,
                });
              } else {
                if (firstPod) {
                  router.push(`/pod/${firstPod?.id}/boards`, undefined, {
                    shallow: true,
                  });
                } else if (firstOrg) {
                  router.push(`/organization/${firstOrg?.username}/boards`, undefined, {
                    shallow: true,
                  });
                }
              }
            }}
            buttonInnerStyle={{
              fontFamily: 'Space Grotesk',
            }}
          >
            Later
          </LaterButton>
          <ContinueButton
            style={buttonStyle}
            onClick={() => {
              setLoading(true);
              if (validateEmail(email)) {
                updateUser({
                  variables: {
                    input: {
                      email,
                    },
                  },
                });
              } else {
                setLoading(false);
                setError('Please enter a valid email');
              }
            }}
            buttonInnerStyle={{
              padding: '8px 16px',
            }}
          >
            <InviteWelcomeBoxParagraph>Continue</InviteWelcomeBoxParagraph>
          </ContinueButton>
        </div>
      )}
    </InviteWelcomeBoxWrapper>
  );
};
