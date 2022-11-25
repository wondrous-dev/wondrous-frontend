import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';
import Collaborations from 'components/organization/collaborations/collaborations';

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

function CollabPage() {
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
      <Collaborations orgData={org} />
    </OrgBoardContext.Provider>
  );
}

export default withAuth(CollabPage);
