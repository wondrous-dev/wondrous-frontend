import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { InviteWelcomeBox } from 'components/Onboarding/welcome';
import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { useMe, withAuth } from 'components/Auth/withAuth';

const ContributorOnboardingPage = () => {
  const router = useRouter();
  const user = useMe();

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      router.push('/onboarding/build-profile', undefined, {
        shallow: true,
      });
    },
  });

  return (
    <MainWrapper>
      <InviteWelcomeBox updateUser={updateUser} user={user} />
    </MainWrapper>
  );
};

export default withAuth(ContributorOnboardingPage);
