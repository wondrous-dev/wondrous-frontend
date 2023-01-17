import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';
import Members from 'components/Members';
import EntitySidebar from 'components/Common/SidebarEntity';
import { usePageDataContext } from 'utils/hooks';

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

function OrgMemberPage() {
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
        <Members />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(OrgMemberPage);
