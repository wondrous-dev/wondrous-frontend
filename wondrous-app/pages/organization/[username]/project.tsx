import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { withAuth } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import OrgProject from 'components/organization/project';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';

function ActivitiesPage() {
  const router = useRouter();
  const { username } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [getOrgFromUsername, { data: { getOrgFromUsername: org = null } = {} }] = useLazyQuery(GET_ORG_FROM_USERNAME);

  const contextValue = useMemo(
    () => ({
      userPermissionsContext: userPermissionsContext?.getUserPermissionContext
        ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
        : null,
      orgId: org?.id,
      orgData: org,
    }),
    [org, userPermissionsContext?.getUserPermissionContext]
  );

  useEffect(() => {
    if (username) {
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username]);

  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <OrgProject orgData={org} />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(ActivitiesPage);
