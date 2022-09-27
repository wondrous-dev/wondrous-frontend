import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useLazyQuery } from '@apollo/client';

import { ConnectDiscord } from 'components/Onboarding/ConnectDiscord';
import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { GET_PRESIGNED_IMAGE_URL } from 'graphql/queries/media';
import { useMe, withAuth } from 'components/Auth/withAuth';

function ConnectDiscordPage() {
  const router = useRouter();
  const {collabInvite} = router.query
  const user = useMe();

  const goToNextStep = () => {
    let nextStep = user.activeEthAddress ? '/onboarding/twitter' : '/onboarding/wallet';

    if(collabInvite) {
      nextStep = nextStep + '?collabInvite=' + collabInvite;
    }
    router.push(nextStep, undefined, { shallow: true });
  };

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      goToNextStep();
    },
  });

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
