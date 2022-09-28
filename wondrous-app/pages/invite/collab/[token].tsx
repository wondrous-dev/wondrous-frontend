import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';
import { withAuth, useMe } from 'components/Auth/withAuth';
import { MainWrapper } from 'components/Onboarding/styles';
import { GET_ORG_COLLAB_REQUEST_BY_TOKEN, GET_USER_ORGS } from 'graphql/queries';
import CollabInvite from 'components/CollabInvite';

const CollabsOnboardingPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const { data, loading, error } = useQuery(GET_ORG_COLLAB_REQUEST_BY_TOKEN, {
    variables: {
      token,
    },
    skip: !token,
  });

  return (
    <MainWrapper>
      <CollabInvite orgRequestInfo={data} />
    </MainWrapper>
  );
};

export default withAuth(CollabsOnboardingPage);
