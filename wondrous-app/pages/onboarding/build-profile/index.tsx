import React from 'react';
import { useMutation } from '@apollo/client';

import OnboardingBuildProfile from 'components/Onboarding/BuildProfile';
import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { withAuth } from 'components/Auth/withAuth';

function ContributorBuildProfilePage() {
  const [updateUser] = useMutation(UPDATE_USER);

  return (
    <MainWrapper>
      <OnboardingBuildProfile updateUser={updateUser} />
    </MainWrapper>
  );
}

export default withAuth(ContributorBuildProfilePage);
