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
  const user = useMe();
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    skip: !user?.id,
    notifyOnNetworkStatusChange: true,
    variables: {
      excludeSharedOrgs: true,
    },
  });

  const { data, loading, error } = useQuery(GET_ORG_COLLAB_REQUEST_BY_TOKEN, {
    variables: {
        token
    },
    skip: !token
  });

  console.log(data, user, userOrgs)
  /*

    step 1: Fetch request from token
    step 2: If user is logged in display only My DAO is on wonder
    step 3: If user is not logged in display login 
    step 4: Create account / login with inviteToken
    step 5: Afer login redirect to create org page
    step 6: After create org start collab
    step 7: Redirect to collab page

  */
  return (
    <MainWrapper>
        {data && <CollabInvite orgRequestInfo={data} />}
    </MainWrapper>
  )
};

export default withAuth(CollabsOnboardingPage);
