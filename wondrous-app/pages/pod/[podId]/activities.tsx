import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Activities from 'components/Pod/activities';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PodBoardContext } from 'utils/contexts';

const useGetPodById = (podId) => {
  const [getPodById, { data }] = useLazyQuery(GET_POD_BY_ID);
  useEffect(() => {
    if (!data && podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [podId, data, getPodById]);
  return data?.getPodById;
};

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
