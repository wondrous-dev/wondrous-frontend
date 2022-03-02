import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { InviteWelcomeBox } from '../../../components/Onboarding/welcome';
import { MainWrapper } from '../../../components/Onboarding/styles';
import { UPDATE_USER } from '../../../graphql/mutations';
import { useMe } from '../../../components/Auth/withAuth';

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
  useEffect(() => {
    if (user?.username) {
      router.push('/dashboard', undefined, {
        shallow: true,
      });
    }
  }, [user?.username]);
  return (
    <MainWrapper>
      <InviteWelcomeBox updateUser={updateUser} />
    </MainWrapper>
  );
};

export default ContributorOnboardingPage;
