import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { VERIFY_USER_TWEET } from 'graphql/mutations';
import {
  ContinueButton,
  LaterButton,
  Later,
  SecretCodeContainer,
} from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { Layout, OnboardingTitle } from 'components/Onboarding/OnboardingLayout/styles';
import Image from 'next/image';
import { useWonderWeb3 } from 'services/web3';
import { PlayerWrapper } from 'components/Onboarding/VerifyTweet/styles';
import { useMe } from 'components/Auth/withAuth';
import useEagerConnectConditional from 'services/web3/hooks/useEagerConnectConditional';
import TwitterLogo from '../../../public/images/twitter.svg';
import { InviteWelcomeBoxParagraph } from '../styles';

// const buttonStyle = {
//   background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
//   display: 'flex',
//   alignItems: 'center',
// };

function VerifyTweet({ firstOrg, firstPod }) {
  const router = useRouter();
  const user = useMe();
  const wonderWeb3 = useWonderWeb3();
  const { collabInvite } = router?.query;

  const [tweetVerified, setTweetVerified] = useState(false);
  const { data: userData } = useQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getLoggedinUser?.userInfo && !data?.getLoggedinUser?.userInfo?.twitterUsername) {
        router.push(`/onboarding/twitter`, undefined, {
          shallow: true,
          ...(collabInvite ? { query: { collabInvite } } : {}),
        });
      }
    },
  });
  const [verifyUserTweet, { loading: checkTweetLoading }] = useMutation(VERIFY_USER_TWEET, {
    onCompleted: (data) => {
      if (data?.verifyUserTweet?.success) {
        setTweetVerified(true);
      }
    },
  });

  useEagerConnectConditional(user?.activeEthAddress);

  const userAlreadyTweeted = !!userData?.getLoggedinUser?.userInfo?.orbit1Tweet;

  const connectWeb3 = async () => {
    await wonderWeb3.onConnect();
  };

  useEffect(() => {
    if (user?.activeEthAddress) {
      connectWeb3();
    }
  }, [user?.activeEthAddress]);

  useEffect(() => {
    if (userAlreadyTweeted) {
      setTweetVerified(true);
    }
  }, [userAlreadyTweeted]);

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

  const generateTweetInfo = () => {
    if (user?.activeEthAddress) {
      if (wonderWeb3.ensName) {
        // && wonderWeb3.address === user?.activeEthAddress ?
        return `https://twitter.com/intent/tweet?text=gm%20-%20I%E2%80%99m%20reserving%20my%20Orbit%201%20NFT%20as%20a%20contributor%20%40wonderverse_xyz%20%E2%9C%A8%0AENS%3A%20${wonderWeb3.ensName}&in_reply_to=1603833807081066496`;
      }
      return `https://twitter.com/intent/tweet?text=gm%20-%20I%E2%80%99m%20reserving%20my%20Orbit%201%20NFT%20as%20a%20contributor%20%40wonderverse_xyz%20%E2%9C%A8%0A${user?.activeEthAddress}&in_reply_to=1603833807081066496`;
    }
    return `https://twitter.com/intent/tweet?text=gm%20-%20I%E2%80%99m%20reserving%20my%20Orbit%201%20NFT%20as%20a%20contributor%20%40wonderverse_xyz%20%E2%9C%A8%0A&in_reply_to=1603833807081066496`;
  };

  return (
    <Layout
      style={{
        paddingTop: '55px',
        paddingBottom: '55px',
        minHeight: 'unset',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <OnboardingTitle
          style={{
            marginTop: 0,
            textAlign: 'center',
          }}
        >
          Get your Orbit 1 NFT
        </OnboardingTitle>
        <InviteWelcomeBoxParagraph
          style={{
            textAlign: 'center',
            width: '100%',
            fontSize: '15px',
            fontWeight: '400',
          }}
        >
          Want to get your Orbit 1 NFT? Tweet us!
        </InviteWelcomeBoxParagraph>
      </div>
      {!user?.activeEthAddress && (
        <InviteWelcomeBoxParagraph
          style={{
            textAlign: 'left',
            width: '100%',
            fontSize: '15px',
            fontWeight: '400',
          }}
        >
          If you haven&apos;t connected your wallet, add your address or ENS to the tweet
        </InviteWelcomeBoxParagraph>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PlayerWrapper>
          <ReactPlayer
            style={{
              height: '100%',
              width: '100%',
            }}
            muted
            playing
            loop
            controls={false}
            url="https://stream.mux.com/TrJJODUH400xzbi00R1t2Pq5ik00zA7MwQ9y59NyU2Ailo.m3u8"
          />
        </PlayerWrapper>
        {!tweetVerified && (
          <div
            style={{
              width: '100%',
              maxWidth: '326px',
            }}
          >
            <a href={generateTweetInfo()} target="_blank" rel="noreferrer">
              <ContinueButton
                type="submit"
                style={{
                  marginTop: '29px',
                  minHeight: '50px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      marginRight: '10px',
                    }}
                  >
                    Step 1:
                  </div>
                  Tweet
                  <TwitterLogo style={{ marginLeft: '10px' }} />
                </div>
              </ContinueButton>
            </a>
            <LaterButton
              style={{
                marginRight: 0,
                minHeight: '50px',
                margin: '21px 0',
              }}
              onClick={verifyUserTweet}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    marginRight: '10px',
                  }}
                >
                  Step 2:
                </div>
                {checkTweetLoading && <>Checking...</>}
                {!checkTweetLoading && <>Verify</>}
              </div>
            </LaterButton>
            <Later
              style={{
                width: '100%',
                height: '50px',
              }}
              onClick={handleLaterClick}
            >
              I’ll get it later
            </Later>
          </div>
        )}
        {tweetVerified && (
          <div
            style={{
              width: '100%',
              maxWidth: '326px',
            }}
          >
            <SecretCodeContainer
              style={{
                marginTop: '29px',
                width: '100%',
                height: '50px',
              }}
            >
              Congrats! your NFT will be airdropped to you at the end of the week
            </SecretCodeContainer>
            <ContinueButton
              style={{
                marginTop: '29px',
                width: '100%',
                height: '50px',
              }}
              onClick={handleLaterClick}
            >
              Continue to dashboard
            </ContinueButton>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VerifyTweet;
