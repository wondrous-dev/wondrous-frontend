import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import Docs from 'components/Pod/docs/docs';
import { PodBoardContext } from 'utils/contexts';

const useGetPodFromId = (podId) => {
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

const DocsPage = () => {
  const router = useRouter();
  const { podId } = router.query;

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const pod = useGetPodFromId(podId);
  return (
    <PodBoardContext.Provider
      value={{
        pod,
        podId,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <Docs podData={pod} />
    </PodBoardContext.Provider>
  );
};

export default withAuth(DocsPage);
