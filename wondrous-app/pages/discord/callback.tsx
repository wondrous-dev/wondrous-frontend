import { useLazyQuery, useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { storeAuthHeader, useMe, withAuth } from 'components/Auth/withAuth';
import { InviteWelcomeBoxWrapper } from 'components/Onboarding/styles';
import {
  CONNECT_USER_DISCORD,
  REDEEM_ORG_INVITE_LINK,
  REDEEM_POD_INVITE_LINK,
  USER_DISOCRD_SIGNUP_LOGIN,
} from 'graphql/mutations';
import { GRAPHQL_ERRORS } from 'utils/constants';

const Callback = () => {
  const user = useMe();
  const router = useRouter();
  const { code } = router.query;
  const state = router?.query?.state as string;
  const [connectUserDiscord] = useMutation(CONNECT_USER_DISCORD);
  const [discordSignupLogin] = useMutation(USER_DISOCRD_SIGNUP_LOGIN);

  const [redeemOrgInviteLink] = useMutation(REDEEM_ORG_INVITE_LINK);
  const [redeemPodInviteLink] = useMutation(REDEEM_POD_INVITE_LINK);

  const redeemOrgInvite = async (token, user) => {
    redeemOrgInviteLink({
      variables: {
        token,
      },
    })
      .then((result) => {
        if (result?.data?.redeemOrgInviteLink?.success) {
          if (user && user?.username) {
            router.push('/dashboard', undefined, {
              shallow: true,
            });
          } else if (user && !user?.username) {
            router.push(`/onboarding/welcome`, undefined, {
              shallow: true,
            });
          }
        }
      })
      .catch((err) => {
        if (
          err?.graphQLErrors &&
          (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.ORG_INVITE_ALREADY_EXISTS ||
            err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.POD_INVITE_ALREADY_EXISTS)
        ) {
          if (user && user?.username) {
            router.push('/dashboard', undefined, {
              shallow: true,
            });
          } else if (user && !user?.username) {
            router.push(`/onboarding/welcome`, undefined, {
              shallow: true,
            });
          }
        }
      });
  };

  const redeemPodInvite = async (token, user) => {
    redeemPodInviteLink({
      variables: {
        token,
      },
    })
      .then((result) => {
        if (result?.data?.redeemPodInviteLink?.success) {
          if (user && user?.username) {
            router.push('/dashboard', undefined, {
              shallow: true,
            });
          } else if (user && !user?.username) {
            router.push(`/onboarding/welcome`, undefined, {
              shallow: true,
            });
          } else if (!user) {
          }
        }
      })
      .catch((err) => {
        if (
          err?.graphQLErrors &&
          (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.ORG_INVITE_ALREADY_EXISTS ||
            err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.POD_INVITE_ALREADY_EXISTS)
        ) {
          if (user && user?.username) {
            router.push('/dashboard', undefined, {
              shallow: true,
            });
          } else if (user && !user?.username) {
            router.push(`/onboarding/welcome`, undefined, {
              shallow: true,
            });
          }
        }
      });
  };
  useEffect(() => {
    const token = localStorage.getItem('wonderToken') || null;
    if (code && token) {
      connectUserDiscord({
        variables: {
          discordAuthCode: code,
        },
      })
        .then((result) => {
          if (user && user?.signupCompleted) {
            // Only place to change this is in settings
            window.location.href = `/profile/settings`;
          } else if (user && !user?.signupCompleted) {
            router.push('/onboarding/email-setup', undefined, {
              shallow: true,
            });
          }
        })
        .catch((err) => {
          console.log('Error updating discord');
        });
    } else if (code && !token) {
      // Sign them up or log them in
      discordSignupLogin({
        variables: {
          discordAuthCode: code,
        },
      })
        .then(async (result) => {
          const response = result?.data?.discordSignupLogin;
          const token = response?.token;
          const user = response?.user;
          let inviteToken,
            inviteType = null;
          if (state) {
            const parsedState = JSON.parse(state);
            inviteToken = parsedState?.token;
            inviteType = parsedState?.type;
          }
          await storeAuthHeader(token, user);
          if (inviteToken) {
            // Either redeem pod invite or org invite
            if (inviteType === 'pod') {
              redeemPodInvite(inviteToken, user);
            } else {
              redeemOrgInvite(inviteToken, user);
            }
          } else {
            if (user && user?.signupCompleted) {
              // Only place to change this is in settings
              router.push('/dashboard', undefined, {
                shallow: true,
              });
            } else if (user && !user?.signupCompleted) {
              router.push('/onboarding/welcome', undefined, {
                shallow: true,
              });
            }
          }
        })
        .catch((err) => {
          console.log('Error updating discord');
        });
    }
  }, [user, user?.signupCompleted, code, state]);
  return (
    <InviteWelcomeBoxWrapper
      style={{
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </InviteWelcomeBoxWrapper>
  );
};

export default withAuth(Callback);
