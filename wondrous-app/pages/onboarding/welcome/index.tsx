import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { useMe, withAuth } from 'components/Auth/withAuth';
import OnboardingWelcome from 'components/Onboarding/Welcome';

const OnboardingWelcomePage = () => {
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
      <OnboardingWelcome updateUser={updateUser} user={user} />
    </MainWrapper>
  );
};

export default withAuth(OnboardingWelcomePage);
