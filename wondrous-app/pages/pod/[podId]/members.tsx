import { useQuery } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import MemberRequests from 'components/Pod/members';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { PodBoardContext } from 'utils/contexts';
import { useGetPodById, usePageDataContext, usePodPageFetch } from 'utils/hooks';

function PodMembersPage() {
  const router = useRouter();
  const { podId } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const { data } = usePodPageFetch(podId);

  return (
    <PodBoardContext.Provider
      value={{
        pod: data?.getPodById,
        podId,
        orgId: data?.getPodById?.orgId,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <EntitySidebar>
        <MemberRequests
          podId={podId}
          podData={data?.getPodById}
          userPermissionsContext={
            userPermissionsContext?.getUserPermissionContext
              ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
              : null
          }
        />
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
}

export default withAuth(PodMembersPage);
