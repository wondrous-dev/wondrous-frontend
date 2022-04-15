import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useLazyQuery } from '@apollo/client';

import { InviteWelcomeBox } from 'components/Onboarding/connect-discord';
import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { GET_PRESIGNED_IMAGE_URL } from 'graphql/queries/media';
import { useMe, withAuth } from 'components/Auth/withAuth';

const ContributorBuildProfilePage = () => {
  const router = useRouter();
  const user = useMe();
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      router.push('/onboarding/email-setup', undefined, {
        shallow: true,
      });
    },
  });
  useEffect(() => {
    if (user?.userInfo?.discordUsername) {
      router.push('/onboarding/email-setup', undefined, {
        shallow: true,
      });
    }
  }, [user?.userInfo?.discordUsername]);
  return (
    <MainWrapper>
      <InviteWelcomeBox updateUser={updateUser} />
    </MainWrapper>
  );
};

export default withAuth(ContributorBuildProfilePage);
