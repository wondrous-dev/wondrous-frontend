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
import { useMutation, useQuery } from '@apollo/client';
import { WHOAMI, GET_LOGGED_IN_USER, WHOAMI_WAITLIST } from 'graphql/queries';
import apollo from 'services/apollo';

import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';
import { useRouter } from 'next/router';

import { SecondStep, ThirdStep } from 'components/Common/Image/OnboardingProgressBar';
import { useMe } from '../Auth/withAuth';
import { VERIFY_USER_TWEET } from 'graphql/mutations';
import TwitterLogo from '../../public/images/twitter.svg';
import CheckMarkIcon from 'components/Icons/checkMark';
import { buildTwitterAuthUrl, challengeCode } from 'components/Twitter/utils';

export const Logo = ({ divStyle }) => {
  return (
    <LogoDiv style={divStyle}>
      <WonderLogo />
      <LogoText>Wonder</LogoText>
    </LogoDiv>
  );
};

export const InviteWelcomeBox = () => {
  const router = useRouter();
  const redirectToTwitterAuth = () => {
    const url = buildTwitterAuthUrl(challengeCode, 'onboarding');
    window.open(url);
  };

  const [tweetVerified, setTweetVerified] = useState(false);
  const { data: userData } = useQuery(GET_LOGGED_IN_USER, { fetchPolicy: 'network-only' });
  const [verifyUserTweet] = useMutation(VERIFY_USER_TWEET, {
    onCompleted: (data) => {
      setTweetVerified(true);
    },
  });
  const userAlreadyTweeted = !!userData?.getLoggedinUser?.userInfo?.promotionTweet;
  const twitterConnected = !!userData?.getLoggedinUser?.userInfo?.twitterUsername;
  useEffect(() => {
    if (userAlreadyTweeted) {
      setTweetVerified(true);
    }
  }, [userAlreadyTweeted]);

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

      {!twitterConnected && (
        <>
          <OnboardingTitle
            style={{
              textAlign: 'left',
              marginTop: '36px',
              width: '100%',
            }}
          >
            Connect to Twitter
          </OnboardingTitle>
          <InviteWelcomeBoxParagraph
            style={{
              textAlign: 'left',
              width: '100%',
            }}
          >
            Connect your Twitter!
          </InviteWelcomeBoxParagraph>
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
              <InviteWelcomeBoxParagraph>Later</InviteWelcomeBoxParagraph>
            </LaterButton>
            <ContinueButton
              style={buttonStyle}
              onClick={redirectToTwitterAuth}
              buttonInnerStyle={{
                padding: '8px 16px',
              }}
            >
              <TwitterLogo />
              <InviteWelcomeBoxParagraph
                style={{
                  marginLeft: '8px',
                }}
              >
                Connect Twitter
              </InviteWelcomeBoxParagraph>
            </ContinueButton>
          </div>
        </>
      )}
      {twitterConnected && (
        <>
          <OnboardingTitle
            style={{
              textAlign: 'left',
              marginTop: '36px',
              width: '100%',
            }}
          >
            Get your POAP
          </OnboardingTitle>

          <InviteWelcomeBoxParagraph
            style={{
              textAlign: 'left',
              width: '100%',
              marginTop: '20px',
            }}
          >
            Tweet at us to receive out Cool POAP
          </InviteWelcomeBoxParagraph>
          <div
            style={{
              width: '100%',
              justifyContent: 'end',
              alignItems: 'center',
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
              <InviteWelcomeBoxParagraph>{tweetVerified ? 'Continue' : 'Later'}</InviteWelcomeBoxParagraph>
            </LaterButton>

            {!tweetVerified && (
              <LaterButton
                buttonInnerStyle={{
                  padding: '8px',
                }}
                onClick={verifyUserTweet}
              >
                <InviteWelcomeBoxParagraph>Verify</InviteWelcomeBoxParagraph>
              </LaterButton>
            )}
            {tweetVerified && (
              <InviteWelcomeBoxParagraph style={{ marginRight: '16px', marginTop: '24px' }}>
                Verified
              </InviteWelcomeBoxParagraph>
            )}
            {!tweetVerified && (
              <a
                href="https://twitter.com/intent/tweet?text=Hello%20world%20@wonderverse_xyz"
                target="_blank"
                rel="noreferrer"
              >
                <ContinueButton
                  style={buttonStyle}
                  buttonInnerStyle={{
                    padding: '8px 16px',
                  }}
                >
                  <TwitterLogo />
                  <InviteWelcomeBoxParagraph
                    style={{
                      marginLeft: '8px',
                    }}
                  >
                    Tweet
                  </InviteWelcomeBoxParagraph>
                </ContinueButton>
              </a>
            )}
            {tweetVerified && <CheckMarkIcon style={{ marginRight: '16px', marginTop: '24px' }} />}
          </div>
        </>
      )}
    </InviteWelcomeBoxWrapper>
  );
};
