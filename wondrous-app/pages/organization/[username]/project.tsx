import { useLazyQuery, useQuery } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import Activities from 'components/organization/activities/activities';
import OrgProject from 'components/organization/Project';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
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
        <OrgProject orgData={org} />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(ActivitiesPage);
