import { useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useMe, withAuth } from '../../components/Auth/withAuth';
import { InviteWelcomeBoxWrapper } from '../../components/Onboarding/styles';
import { CONNECT_USER_DISCORD } from '../../graphql/mutations';

const Callback = () => {
  const user = useMe();
  const router = useRouter();
  const { code } = router.query;
  const [connectUserDiscord] = useMutation(CONNECT_USER_DISCORD);
  useEffect(() => {
    if (code) {
      connectUserDiscord({
        variables: {
          discordAuthCode: code,
        },
      })
        .then((result) => {
          if (user?.signupCompleted) {
            // Only place to change this is in settings
            router.push('/profile/settings', undefined, {
              shallow: true,
            });
          } else {
            router.push('/onboarding/email-setup', undefined, {
              shallow: true,
            });
          }
        })
        .catch((err) => {
          console.log('Error updating discord');
        });
    }
  }, [user?.signupCompleted, code]);
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
