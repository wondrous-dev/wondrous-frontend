import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PodBoardContext } from 'utils/contexts';
import { usePodPageFetch } from 'utils/hooks';
import EntitySidebar from 'components/Common/SidebarEntity';
import WonderAiTaskGeneration from 'components/Common/WonderAiTaskGeneration';

function WonderAIBotPage() {
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
        <WonderAiTaskGeneration />
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
}

export default withAuth(WonderAIBotPage);
