import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { ConnectDiscord } from 'components/Onboarding/ConnectDiscord';
import { MainWrapper } from 'components/Onboarding/styles';
import { SET_USER_SIGNUP_COMPLETE, UPDATE_USER } from 'graphql/mutations';
import { useMe, withAuth } from 'components/Auth/withAuth';

function ConnectDiscordPage() {
  const router = useRouter();
  const { collabInvite } = router.query;
  const user = useMe();
  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';

  const [setUserSignupComplete] = useMutation(SET_USER_SIGNUP_COMPLETE);

  const goToNextStep = () => {
    const nextStep = user.activeEthAddress
      ? `/onboarding/twitter${collabInviteQueryString}`
      : `/onboarding/wallet${collabInviteQueryString}`;

    router.push(nextStep, undefined, { shallow: true });
  };

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      goToNextStep();
    },
  });

  useEffect(() => {
    if (!user?.signupComplete) {
      setUserSignupComplete();
    }
  }, [user?.signupComplete]);

  useEffect(() => {
    if (user?.userInfo?.discordUsername) {
      goToNextStep();
    }
  }, [user?.userInfo?.discordUsername]);

  return (
    <MainWrapper>
      <ConnectDiscord updateUser={updateUser} />
    </MainWrapper>
  );
}

export default withAuth(ConnectDiscordPage);
