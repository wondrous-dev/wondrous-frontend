import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';
import { useGetOrgFromUsername, usePageDataContext } from 'utils/hooks';
import EntitySidebar from 'components/Common/SidebarEntity';
import WonderAiTaskGeneration from 'components/Common/WonderAiTaskGeneration';

function WonderAIBotPage() {
  const router = useRouter();
  const { setPageData } = usePageDataContext();
  const { username } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const org = useGetOrgFromUsername(username);

  useEffect(() => {
    if (org) {
      setPageData({ orgData: org });
    }
  }, [org]);

  useEffect(() => () => setPageData({}), []);

  return (
    <OrgBoardContext.Provider
      value={{
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        orgId: org?.id,
        orgData: org,
      }}
    >
      <EntitySidebar>
        <WonderAiTaskGeneration />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(WonderAIBotPage);
