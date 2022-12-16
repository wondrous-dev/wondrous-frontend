import React, { useEffect, useCallback, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { CallbackBackground, CallbackHeading, CallbackWrapper } from 'components/Common/CallbackWrapper';
import { VERIFY_TWITTER } from 'graphql/mutations';
// https://yourCallbackUrl.com?oauth_token=NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0&oauth_verifier=uw7NjWHT6OJ1MpJOXsHfNxoAhPKpgI8BlYDhxEjIBY

function Callback() {
  const router = useRouter();
  const { code, state, error: twitterError }: any = router.query;
  const collabInviteCode = state?.split('collabInvite=')[1] || '';
  const source = state?.split('?collabInvite=')[0] || 'onboading';
  const [verifyTwitter] = useMutation(VERIFY_TWITTER, {
    onCompleted: () => {
      if (source === 'onboarding') {
        router.replace({
          pathname: `/twitter/verify-tweet`,
          ...(collabInviteCode ? { query: { collabInvite: collabInviteCode } } : {}),
        });
      }
      if (source === 'profile') {
        router.replace({
          pathname: '/profile/settings',
          query: { successfulAuth: 'true' }, // unecessary for now
        });
      }
    },
    onError: (e) => {
      console.error('error verifying twitter', e);
      if (source === 'onboarding') {
        router.replace({
          pathname: `/onboarding/twitter`,
          ...(collabInviteCode ? { query: { collabInvite: collabInviteCode, error: 'unknown' } } : {}),
        });
      }
      if (source === 'profile') {
        router.replace({
          pathname: '/profile/settings',
          query: { successfulAuth: 'false' }, // unecessary for now
        });
      }
    },
  });

  useEffect(() => {
    if (twitterError === 'access_denied') {
      router.replace({
        pathname: `/onboarding/twitter`,
        ...(collabInviteCode ? { query: { collabInvite: collabInviteCode, eror: 'access_denied' } } : {}),
      });
    }
  }, [twitterError]);

  useEffect(() => {
    if (code) {
      verifyTwitter({
        variables: { code },
      });
    }
  }, [code]);

  return (
    <>
      <CallbackBackground />
      <CallbackWrapper>
        <CallbackHeading>Connecting Twitter Server</CallbackHeading>
        <CircularProgress />
      </CallbackWrapper>
    </>
  );
}

export default Callback;
