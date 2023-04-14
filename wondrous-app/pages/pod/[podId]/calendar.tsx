import React from 'react';
import { useRouter } from 'next/router';

import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import CalendarPage from 'components/CalendarPage';
import EntitySidebar from 'components/Common/SidebarEntity';
import { CalendarProvidedIn } from 'components/CalendarPage/types';
import { PodBoardContext } from 'utils/contexts';
import { useGlobalContext, usePodPageFetch } from 'utils/hooks';
import { withAuth } from 'components/Auth/withAuth';

const OrgCalendarPage = () => {
  const router = useRouter();
  const { podId } = router.query;
  const { userPermissionsContext } = useGlobalContext();

  const { data } = usePodPageFetch(podId);

  return (
    <PodBoardContext.Provider
      value={{
        pod: data?.getPodById,
        podId,
        orgId: data?.getPodById?.orgId,
        userPermissionsContext,
      }}
    >
      <EntitySidebar>
        <BoardPageHeader headerTitle="Calendar">
          <CalendarPage orgId={data?.getPodById?.orgId} podId={podId as string} providedIn={CalendarProvidedIn.POD} />
        </BoardPageHeader>
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
};

export default withAuth(OrgCalendarPage);
