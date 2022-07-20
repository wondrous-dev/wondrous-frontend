import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Activities from 'components/Pod/activities';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PodBoardContext } from 'utils/contexts';
import { useGetPodById } from 'utils/hooks';
const ActivitiesPage = () => {
  const router = useRouter();
  const { podId } = router.query;
  const getPodById = useGetPodById(podId);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <PodBoardContext.Provider
      value={{
        pod: getPodById,
        podId,
        orgId: getPodById?.orgId,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <Activities podId={podId} />
    </PodBoardContext.Provider>
  );
};

export default withAuth(ActivitiesPage);
