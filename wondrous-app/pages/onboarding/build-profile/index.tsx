import React from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';

import { OnboardingBuildProfile } from 'components/Onboarding/BuildProfile';
import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { GET_PRESIGNED_IMAGE_URL } from 'graphql/queries/media';

const ContributorBuildProfilePage = () => {
  const [updateImage] = useLazyQuery(GET_PRESIGNED_IMAGE_URL);
  const [updateUser] = useMutation(UPDATE_USER);
  return (
    <MainWrapper>
      <OnboardingBuildProfile updateUser={updateUser} />
    </MainWrapper>
  );
};

export default (ContributorBuildProfilePage);
