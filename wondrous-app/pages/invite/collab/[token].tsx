import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { withAuth, useMe } from 'components/Auth/withAuth';

const CollabsOnboardingPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const user = useMe();

  /*

    step 1: Fetch request from token
    step 2: If user is logged in display only My DAO is on wonder
    step 3: If user is not logged in display login 
    step 4: Create account / login with inviteToken
    step 5: Afer login redirect to create org page
    step 6: After create org start collab
    step 7: Redirect to collab page

  */
  return null;
};

export default withAuth(CollabsOnboardingPage);
