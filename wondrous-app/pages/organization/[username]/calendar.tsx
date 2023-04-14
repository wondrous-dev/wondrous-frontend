import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import CalendarPage from 'components/CalendarPage';
import EntitySidebar from 'components/Common/SidebarEntity';
import { CalendarProvidedIn } from 'components/CalendarPage/types';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';
import { usePageDataContext } from 'utils/hooks';
import { withAuth } from 'components/Auth/withAuth';

const OrgCalendarPage = () => {
  const { setPageData } = usePageDataContext();
  const router = useRouter();
  const { username } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const { data } = useQuery(GET_ORG_FROM_USERNAME, {
    skip: !username,
    variables: {
      username,
    },
  });
  const { getOrgFromUsername: orgData } = data || {};

  useEffect(() => {
    if (orgData) {
      setPageData({ orgData });
    }
  }, [orgData]);

  useEffect(() => () => setPageData({}), []);

  const contextValue = {
    orgId: orgData?.id,
    orgData,
    userPermissionsContext: userPermissionsContext?.getUserPermissionContext
      ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
      : null,
  };

  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <BoardPageHeader orgData={orgData} headerTitle="Calendar">
          <CalendarPage orgId={orgData?.id} providedIn={CalendarProvidedIn.ORGANIZATION} />
        </BoardPageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};

export default withAuth(OrgCalendarPage);
