import { useLazyQuery, useQuery } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import OrgProject from 'components/organization/project';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { OrgBoardContext } from 'utils/contexts';

const useGetOrgFromUsername = (username) => {
  const [getOrgFromUsername, { data }] = useLazyQuery(GET_ORG_FROM_USERNAME);
  useEffect(() => {
    if (!data && username) {
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username, data, getOrgFromUsername]);
  return data?.getOrgFromUsername;
};

function ActivitiesPage() {
  const router = useRouter();
  const { username } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const org = useGetOrgFromUsername(username);
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
  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <OrgProject orgData={org} />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(ActivitiesPage);
