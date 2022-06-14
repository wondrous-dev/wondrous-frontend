import React, { useEffect, useCallback, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import apollo from 'services/apollo';
import { storeAuthHeader, useMe, withAuth } from 'components/Auth/withAuth';
import { InviteWelcomeBoxWrapper } from 'components/Onboarding/styles';
import { VERIFY_TWITTER } from 'graphql/mutations';
import { GRAPHQL_ERRORS } from 'utils/constants';
// https://yourCallbackUrl.com?oauth_token=NPcudxy0yU5T3tBzho7iCotZ3cnetKwcTIRlX0iwRl0&oauth_verifier=uw7NjWHT6OJ1MpJOXsHfNxoAhPKpgI8BlYDhxEjIBY

const Callback = () => {
  const router = useRouter();
  const [successfullyVerified, setSuccessfullyVerified] = useState(false);
  const { code, state, error: twitterError } = router.query;
  const [verifyTwitter] = useMutation(VERIFY_TWITTER, {
    onError: () => {
      console.error('error verifying twitter');
    },
  });

  useEffect(() => {
    if (twitterError === 'access_denied') {
      router.replace({
        pathname: '/onboarding/twitter',
      });
    }
  }, [twitterError]);

  useEffect(() => {
    if (code) {
      verifyTwitter({
        variables: { code },
      }).then(() => {
        console.log('state', state);
        if (state === 'onboarding') {
          router.replace({
            pathname: '/twitter/verify-tweet',
          });
        }
        if (state === 'profile') {
          router.replace({
            pathname: '/profile/settings',
            query: { successfulAuth: 'true' }, // unecessary for now
          });
        }
      });
    }
  }, [code]);

  return (
    <InviteWelcomeBoxWrapper
      style={{
        minHeight: '100vh',
      }}
    >
      {!successfullyVerified && <CircularProgress />}
      {successfullyVerified && <h1>success</h1>}
    </InviteWelcomeBoxWrapper>
  );
};

export default Callback;
