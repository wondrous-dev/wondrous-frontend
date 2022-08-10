import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';

import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { useMe, withAuth } from 'components/Auth/withAuth';
import OnboardingWelcome from 'components/Onboarding/Welcome';

function OnboardingWelcomePage() {
  const router = useRouter();
  const user = useMe();
  const { data: userData } = useQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: 'network-only',
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const { updateUser } = data;
      if (updateUser) {
        router.push('/onboarding/build-profile', undefined, {
          shallow: true,
        });
      }
    },
  });

  return (
    <MainWrapper>
      <OnboardingWelcome updateUser={updateUser} user={userData?.getLoggedinUser} />
    </MainWrapper>
  );
}

export default withAuth(OnboardingWelcomePage);
