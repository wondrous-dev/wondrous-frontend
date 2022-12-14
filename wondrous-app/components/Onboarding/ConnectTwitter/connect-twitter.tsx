import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { useIsMobile } from 'utils/hooks';
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
import { buildTwitterAuthUrl } from 'components/Twitter/utils';
import { TWITTER_CHALLENGE_CODE } from 'utils/constants';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { WalletConnected, Label } from '../styles';
import TwitterSmallLogo from '../../../public/images/onboarding/twitter-logo.svg';

export function ConnectTwitter({ firstOrg, firstPod }) {
  const router = useRouter();
  const { collabInvite } = router.query;

  const isMobile = useIsMobile();
  const { data: userData } = useQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (userData?.getLoggedinUser?.userInfo?.twitterUsername) {
        router.push(`/explore`, undefined, {
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

  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';
  const redirectToTwitterAuth = () => {
    const url = buildTwitterAuthUrl(TWITTER_CHALLENGE_CODE, `onboarding${collabInviteQueryString}`);
    window.open(url);
  };

  const handleLaterClick = () => {
    // if user has collabInvite token and is not a member of an org we assume they want to create a new org
    if (collabInvite && !firstOrg) {
      return router.push(`/onboarding-dao?collabInvite=${collabInvite}`, undefined, {
        shallow: true,
      });
    }
    if (collabInvite && firstOrg) {
      return router.push(`/invite/collab/${collabInvite}`, undefined, { shallow: true });
    }
    if (firstPod) {
      router.push(`/pod/${firstPod.id}/boards`, undefined, {
        shallow: true,
      });
    } else if (firstOrg) {
      router.push(
        `/${firstOrg?.shared ? 'collaboration' : 'organization'}/${firstOrg.username}/${
          firstOrg?.shared ? 'boards' : 'home'
        }`,
        undefined,
        {
          shallow: true,
        }
      );
    } else {
      router.push('/explore', undefined, {
        shallow: true,
      });
    }
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
          <Later onClick={handleLaterClick}>I&apos;ll connect it later</Later>
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

  const mobileFooter = (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Later
        onClick={handleLaterClick}
        style={{
          width: '300px',
          marginRight: 0,
        }}
      >
        I&apos;ll connect it later
      </Later>
      <ContinueButton style={{ marginTop: '20px', width: '300px' }} onClick={redirectToTwitterAuth}>
        <TwitterSmallLogo
          style={{
            marginRight: '12px',
          }}
        />
        Connect Twitter
      </ContinueButton>
    </div>
  );

  return (
    <OnboardingLayout
      title="Connect to Twitter"
      description="Connect your twitter!"
      headerRightContent={router.query.wallet ? headerRightContent : null}
      onBackClick={() => router.back()}
      displayFooter={false}
      footer={isMobile ? mobileFooter : footer}
      step={5}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px', marginTop: '20px' }}>
        <Image src="/images/onboarding/twitter.svg" width={406} height={224} alt="" />
      </div>
    </OnboardingLayout>
  );
}
