import { useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMe, withAuth } from '../../components/Auth/withAuth';
import { InviteWelcomeBoxWrapper } from '../../components/Onboarding/styles';
import { CONNECT_USER_DISCORD } from '../../graphql/mutations';

const Callback = () => {
  const user = useMe();
  const router = useRouter();
  const { code } = router.query;
  const [connectUserDiscord] = useMutation(CONNECT_USER_DISCORD);
  const [firstTimeFetched, setFirstTimeFetched] = useState(false);
  useEffect(() => {
    if (code && !firstTimeFetched) {
      setFirstTimeFetched(true);
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
