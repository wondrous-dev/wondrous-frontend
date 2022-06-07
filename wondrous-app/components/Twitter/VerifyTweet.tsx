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

export const Logo = ({ divStyle }) => {
  return (
    <LogoDiv style={divStyle}>
      <WonderLogo />
      <LogoText>Wonder</LogoText>
    </LogoDiv>
  );
};
import styled from 'styled-components';

export const TwitterButton = styled.a`
  text-decoration: none;
  display: inline-block;
  color: #fff;
  background: #1da1f2;
  padding: 9px 18px;
  border-radius: 50px;
  transition: all 400ms ease-in-out;

  &:hover {
    background: #1d8cd0;
  }
`;

const TWITTER_CLIENT_ID = 'alotNFdURk5Qd0FoRGpKeUpHMDE6MTpjaQ';
const DEFAULT_TWITTER_SCOPE = 'users.read%20tweet.read%20offline.access';

export const getTwitterCallbackUrl = () => {
  if (process.env.NEXT_PUBLIC_PRODUCTION) {
    return 'https%3A%2F%2Fapp.wonderverse.xyz%2Ftwitter%2Fcallback';
  } else if (process.env.NEXT_PUBLIC_STAGING) {
    return 'https%3A%2F%2Fapp.wonderverse.xyz%2Ftwitter%2Fcallback';
  }
  return 'http%3A%2F%2Flocalhost%3A3000%2Ftwitter%2Fcallback';
};

const buildTwitterAuthUrl = (challengeCode, state?) => {
  if (!state) {
    state = 'state';
  }
  const redirectUri = getTwitterCallbackUrl();
  return `https://twitter.com/i/oauth2/authorize?client_id=${TWITTER_CLIENT_ID}&scope=${DEFAULT_TWITTER_SCOPE}&response_type=code&redirect_uri=${redirectUri}&state=${state}&code_challenge=${challengeCode}&code_challenge_method=plain`;
};

export const ConnectTwitter = () => {
  const router = useRouter();
  const challengeCode = '0ioze5m20493ny2'; // not that important but should fetch from server
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
              router.push('/profile/settings', undefined, {
                shallow: true,
              })
            }
          >
            <InviteWelcomeBoxParagraph>Back</InviteWelcomeBoxParagraph>
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
    </InviteWelcomeBoxWrapper>
  );
};
