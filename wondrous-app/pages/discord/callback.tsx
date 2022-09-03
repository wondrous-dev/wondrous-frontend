import { useLazyQuery, useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { CallbackBackground, CallbackHeading, CallbackWrapper } from 'components/Common/CallbackWrapper';
import { useRouter } from 'next/router';
import React, { useEffect, useCallback, useState } from 'react';
import { storeAuthHeader, useMe, withAuth } from 'components/Auth/withAuth';
import { InviteWelcomeBoxWrapper } from 'components/Onboarding/styles';
import {
  CONNECT_USER_DISCORD,
  REDEEM_ORG_INVITE_LINK,
  REDEEM_POD_INVITE_LINK,
  USER_DISOCRD_SIGNUP_LOGIN,
} from 'graphql/mutations';
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from 'utils/constants';

function Callback() {
  const router = useRouter();
  const { code } = router.query;
  const state = router?.query?.state as string;
  const [connectUserDiscord] = useMutation(CONNECT_USER_DISCORD);
  const [discordSignupLogin] = useMutation(USER_DISOCRD_SIGNUP_LOGIN);
  const [connectUserDiscordTried, setConnectUserDiscordTried] = useState(false);
  const [redeemOrgInviteLink] = useMutation(REDEEM_ORG_INVITE_LINK);
  const [redeemPodInviteLink] = useMutation(REDEEM_POD_INVITE_LINK);

  const returnToPage = useCallback(() => {
    let inviteToken;
    let inviteType = null;
    if (state) {
      const parsedState = JSON.parse(state);
      inviteToken = parsedState?.token;
      inviteType = parsedState?.type;
    }
    if (inviteToken) {
      const url =
        inviteType === 'pod'
          ? `/invite/${inviteToken}?type=pod&discordConnectError=true`
          : `/invite/${inviteToken}?discordConnectError=true`;
      router.push(url, undefined, {
        shallow: true,
      });
    } else {
      router.push('/login?discordConnectError=true', undefined, {
        shallow: true,
      });
    }
  }, [state, router]);
  const redeemOrgInvite = async (token, user) => {
    redeemOrgInviteLink({
      variables: {
        token,
      },
    })
      .then((result) => {
        if (result?.data?.redeemOrgInviteLink?.success) {
          if (user && user?.username) {
            router.push('/mission-control', undefined, {
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
            router.push('/mission-control', undefined, {
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
            router.push('/mission-control', undefined, {
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
            router.push('/mission-control', undefined, {
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
    if (code && state) {
      const parsedState = JSON.parse(state);

      if (
        parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboarding ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboardingDao ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.connectSettings
      ) {
        connectUserDiscord({
          variables: {
            discordAuthCode: code,
          },
        })
          .then((result) => {
            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectSettings) {
              // Only place to change this is in settings
              window.location.href = `/profile/settings`;
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboarding) {
              router.push('/onboarding/discord?success', undefined, {
                shallow: true,
              });
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboardingDao) {
              router.push(
                {
                  pathname: '/onboarding-dao',
                  query: {
                    restoreState: true,
                    success: true,
                  },
                },
                undefined,
                {
                  shallow: true,
                }
              );
            }
          })
          .catch((err) => {
            console.log('Error updating discord', err?.graphQLErrors[0]?.extensions.errorCode);
            const alreadyExists =
              err?.graphQLErrors &&
              err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.DISCORD_USER_ALREADY_EXISTS;

            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectSettings) {
              // Only place to change this is in settings
              if (alreadyExists) {
                window.location.href = `/profile/settings?discordUserExists=true`;
              } else {
                window.location.href = `/profile/settings?discordError=true`;
              }
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboarding) {
              router.push(
                {
                  pathname: '/onboarding/discord',
                  query: {
                    discordError: 1,
                    discordUserExists: Number(alreadyExists),
                  },
                },
                undefined,
                {
                  shallow: true,
                }
              );
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboardingDao) {
              router.push(
                {
                  pathname: '/onboarding-dao',
                  query: {
                    discordError: 1,
                    discordUserExists: Number(alreadyExists),
                    restoreState: true,
                  },
                },
                undefined,
                {
                  shallow: true,
                }
              );
            }
          });
      } else if (
        parsedState.callbackType === DISCORD_CONNECT_TYPES.signup ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.login
      ) {
        // Sign them up or log them in
        discordSignupLogin({
          variables: {
            discordAuthCode: code,
          },
        })
          .then(async (result) => {
            const response = result?.data?.discordSignupLogin;
            const token = response?.token;
            const discordUser = response?.user;
            let inviteToken;
            let inviteType = null;
            inviteToken = parsedState?.token;
            inviteType = parsedState?.type;
            await storeAuthHeader(token, discordUser);
            if (inviteToken) {
              // Either redeem pod invite or org invite
              if (inviteType === 'pod') {
                redeemPodInvite(inviteToken, discordUser);
              } else {
                redeemOrgInvite(inviteToken, discordUser);
              }
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.login) {
              // Only place to change this is in settings
              router.push('/mission-control', undefined, {
                shallow: true,
              });
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.signup) {
              if (!discordUser?.username) {
                router.push('/onboarding/welcome', undefined, {
                  shallow: true,
                });
              } else {
                router.push('/mission-control', undefined, {
                  shallow: true,
                });
              }
            }
          })
          .catch((err) => {
            console.log('Error signing in discord user', err);
            returnToPage();
          });
      }
    }
  }, [code, state]);
  return (
    <>
      <CallbackBackground />
      <CallbackWrapper>
        <CallbackHeading>Connecting Discord Server</CallbackHeading>
        <CircularProgress />
      </CallbackWrapper>
    </>
  );
}

export default Callback;
