import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import CalendarPage from 'components/CalendarPage';
import EntitySidebar from 'components/Common/SidebarEntity';
import { CalendarProvidedIn } from 'components/CalendarPage/types';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME } from 'graphql/queries/org';
import { OrgBoardContext } from 'utils/contexts';
import { useGlobalContext, usePageDataContext } from 'utils/hooks';
import { withAuth } from 'components/Auth/withAuth';

function CollabCalendarPage() {
  const router = useRouter();
  const { username, orgId } = router.query;
  const [orgData, setOrgData] = useState(null);
  const { setPageData } = usePageDataContext();
  const { userPermissionsContext } = useGlobalContext();

  useEffect(() => {
    if (orgData) {
      setPageData({ orgData });
    }
  }, [orgData]);

  useEffect(() => () => setPageData({}), []);

  const [getOrgFromUsername] = useLazyQuery(GET_ORG_FROM_USERNAME, {
    onCompleted: (data) => {
      if (data?.getOrgFromUsername) {
        setOrgData(data?.getOrgFromUsername);
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrg] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: (data) => {
      setOrgData(data?.getOrgById);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId && !orgData) {
      getOrg({
        variables: {
          orgId,
        },
      });
      // get user task board tasks immediately
    } else if (!orgId && username && !orgData) {
      // Get orgId from username
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username, orgId, orgData, getOrg, getOrgFromUsername]);

  if (!process.env.NEXT_PUBLIC_PRODUCTION) {
    console.log(
      'user permissions context',
      userPermissionsContext?.getUserPermissionContext
        ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
        : null
    );
  }
  return (
    <OrgBoardContext.Provider
      value={{
        orgId: orgData?.id,
        userPermissionsContext,
        orgData,
      }}
    >
      <EntitySidebar>
        <BoardPageHeader orgData={orgData} headerTitle="Calendar">
          <CalendarPage orgId={orgData?.id} providedIn={CalendarProvidedIn.ORGANIZATION} />
        </BoardPageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(CollabCalendarPage);
