import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { withAuth } from 'components/Auth/withAuth';
import { GET_ORG_FROM_USERNAME, GET_ORG_TASK_BOARD_TASKS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';
import EntitySidebar from 'components/Common/SidebarEntity';
import { usePageDataContext } from 'utils/hooks';
import CalendarPage from 'components/organization/calendar';
import { TaskFilter } from 'types/task';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import {
  ENTITIES_TYPES,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';

const OrgCalendarPage = () => {
  const { setPageData } = usePageDataContext();
  const router = useRouter();
  const { username } = router.query;
  const [filters, setFilters] = useState<TaskFilter>({
    // podIds: [],
    // // statuses: DEFAULT_ENTITY_STATUS_FILTER[activeEntityFromQuery],
    // labelId: null,
    // date: null,
    // privacyLevel: null,
    // // for the calendar view
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
    taskTypes: [ENTITIES_TYPES.TASK],
  });

  const [getOrgTaskBoardTasks, { data: getOrgTaskBoardTasksData }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log(error);
    },
  });

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

  useEffect(() => {
    getOrgTaskBoardTasks({
      variables: {
        orgId: orgData?.id,
        offset: 0,
        statuses: [TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO, TASK_STATUS_IN_REVIEW, TASK_STATUS_DONE],
        limit: 1000,
      },
    });
  }, [getOrgTaskBoardTasks, orgData?.id]);

  const handleFilterChange: any = (
    filtersToApply = {
      // statuses: [],
      // podIds: [],
      // labelId: null,
      // date: null,
      // category: null,
      fromDate: null,
      toDate: null,
      taskTypes: [],
    }
  ) => {
    setFilters({
      ...filtersToApply,
      taskTypes: filtersToApply.taskTypes ?? filters.taskTypes,
      fromDate: filtersToApply.fromDate ?? filters.fromDate,
      toDate: filtersToApply.toDate ?? filters.toDate,
    });
  };

  const contextValue = {
    userPermissionsContext: userPermissionsContext?.getUserPermissionContext
      ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
      : null,
    orgId: orgData?.id,
    orgData,
    tasks: getOrgTaskBoardTasksData?.getOrgTaskBoardTasks,
    handleFilterChange,
    filters,
  };

  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <BoardPageHeader
          orgData={orgData}
          // onSearch={onSearch}
          // filterSchema={filterSchema}
          // onFilterChange={onFilterChange}
          // statuses={statuses}
          // podIds={podIds}
          // userId={userId}
          // loading={loading}
          headerTitle="Calendar"
        >
          <CalendarPage />
        </BoardPageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};

export default withAuth(OrgCalendarPage);
