import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PodBoardContext } from 'utils/contexts';
import { useGetPodById } from 'utils/hooks';
import MemberRequests from 'components/Pod/members';
import EntitySidebar from 'components/Common/SidebarEntity';

function PodMembersPage() {
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
      <EntitySidebar>
        <MemberRequests podId={podId} podData={getPodById} />
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
}

export default withAuth(PodMembersPage);
