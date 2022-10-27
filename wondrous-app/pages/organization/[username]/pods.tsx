import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import Pods from 'components/organization/pods';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import EntitySidebar from 'components/Common/SidebarEntity';
import { withAuth } from 'components/Auth/withAuth';

import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';

import { useGetOrgFromUsername, useIsMobile } from 'utils/hooks';
import { OrgBoardContext } from 'utils/contexts';

function PodsInOrgPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { username } = router.query;

  const orgData = useGetOrgFromUsername(username);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <OrgBoardContext.Provider
      value={{
        orgId: orgData?.id,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        orgData,
      }}
    >
      {isMobile ? <MobileComingSoonModal /> : null}
      <EntitySidebar>
        <Pods orgData={orgData} />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(PodsInOrgPage);
