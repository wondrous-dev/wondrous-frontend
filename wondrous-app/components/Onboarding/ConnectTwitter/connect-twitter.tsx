import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { WalletConnected, Label } from '../styles';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import { CompletedIcon } from 'components/Icons/statusIcons';
import {
  BackButton,
  Container,
  ContinueButton,
  Later,
  LaterButton,
  RightButtons,
} from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { buildTwitterAuthUrl, challengeCode } from 'components/Twitter/utils';
import LeftArrowIcon from 'components/Icons/leftArrow';
import TwitterSmallLogo from '../../../public/images/onboarding/twitter-logo.svg';

export const ConnectTwitter = () => {
  const router = useRouter();
  const { data: userData } = useQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (userData?.getLoggedinUser?.userInfo?.twitterUsername) {
        router.push(`/twitter/verify-tweet`, undefined, {
          shallow: true,
        });
      }
    },
  });
  const headerRightContent = (
    <WalletConnected>
      <CompletedIcon fill="none" stroke="none" style={{ width: '26px', height: '26px' }} />{' '}
      <Label>Success! Wallet connected.</Label>
    </WalletConnected>
  );

  const redirectToTwitterAuth = () => {
    const url = buildTwitterAuthUrl(challengeCode, 'onboarding');
    window.open(url);
  };

  const footer = (
    <div>
      <Container>
        <div>
          <BackButton onClick={() => router.back()}>
            <LeftArrowIcon />
          </BackButton>
        </div>
        <RightButtons>
          <Later
            onClick={() =>
              router.push('/dashboard?fromAuth=true', undefined, {
                shallow: true,
              })
            }
          >
            I&apos;ll connect it later
          </Later>
          <ContinueButton onClick={redirectToTwitterAuth}>
            <TwitterSmallLogo
              style={{
                marginRight: '12px',
              }}
            />
            Connect Twitter
          </ContinueButton>
        </RightButtons>
      </Container>
    </div>
  );

  return (
    <OnboardingLayout
      title="Connect to Twitter"
      description="Want our launch POAP? You have to tweet here."
      headerRightContent={router.query.wallet ? headerRightContent : null}
      onBackClick={() => router.back()}
      displayFooter={false}
      footer={footer}
      step={5}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px', marginTop: '20px' }}>
        <Image src="/images/onboarding/twitter.svg" width={406} height={224} />
      </div>
    </OnboardingLayout>
  );
};
