import { useMutation, useQuery } from '@apollo/client';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useIsMobile } from 'utils/hooks';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import {
  BackButton,
  Container,
  ContinueButton,
  Later,
  RightButtons,
} from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { buildTwitterAuthUrl } from 'components/Twitter/utils';
import { SET_USER_SIGNUP_COMPLETE } from 'graphql/mutations';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { TWITTER_CHALLENGE_CODE } from 'utils/constants';
import TwitterSmallLogo from '../../../public/images/onboarding/twitter-logo.svg';

export default function ConnectTwitter({ firstOrg, firstPod }) {
  const router = useRouter();
  const { collabInvite } = router.query;
  const [setUserSignupComplete] = useMutation(SET_USER_SIGNUP_COMPLETE);
  const isMobile = useIsMobile();
  const { data: userData } = useQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getLoggedinUser?.userInfo?.twitterUsername) {
        router.push(`/twitter/verify-tweet`, undefined, {
          shallow: true,
        });
      }
      if (!userData?.getLoggedinUser?.userInfo?.signupComplete) {
        setUserSignupComplete();
      }
    },
  });

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
      router.push(`/pod/${firstPod.id}/home`, undefined, {
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
      router.push('/mission-control', undefined, {
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
      description="Want our Orbit 1 NFT? Connect your twitter!"
      onBackClick={() => router.back()}
      displayFooter={false}
      footer={isMobile ? mobileFooter : footer}
      step={5}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px', marginTop: '20px' }}>
        <img
          src="/images/onboarding/twitter.svg"
          alt=""
          style={{
            width: '100%',
            height: '224px',
          }}
        />
      </div>
    </OnboardingLayout>
  );
}
