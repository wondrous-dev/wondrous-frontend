import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import Activities from '../../../components/Pod/activities';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { PodBoardContext } from '../../../utils/contexts';

const ActivitiesPage = () => {
  const router = useRouter();
  const { podId } = router.query;
  const { data: getPodByIdData } = useQuery(GET_POD_BY_ID, {
    variables: { podId },
  });
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  return (
    <PodBoardContext.Provider
      value={{
        pod: getPodByIdData?.getPodById,
        podId,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <Activities podId={podId} />;
    </PodBoardContext.Provider>
  );
};

export default withAuth(ActivitiesPage);
