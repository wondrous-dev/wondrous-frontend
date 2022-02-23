import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import Activities from '../../../components/organization/activities/activities';
import { GET_ORG_FROM_USERNAME } from '../../../graphql/queries';

const ActivitiesPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { data: getOrgFromUsernameData } = useQuery(GET_ORG_FROM_USERNAME, {
    variables: { username },
  });
  return <Activities orgData={getOrgFromUsernameData?.getOrgFromUsername} />;
};

export default withAuth(ActivitiesPage);
