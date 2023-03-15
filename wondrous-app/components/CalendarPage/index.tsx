import { useLazyQuery, useQuery } from '@apollo/client';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { withAuth } from 'components/Auth/withAuth';
import {
  GET_ORG_FROM_USERNAME,
  GET_ORG_GRANTS,
  GET_ORG_MILESTONE_BOARD_TASKS,
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_USER_PERMISSION_CONTEXT,
} from 'graphql/queries';
import { DEFAULT_ENTITY_STATUS_FILTER } from 'services/board';
import { OrgBoardContext } from 'utils/contexts';
import EntitySidebar from 'components/Common/SidebarEntity';
import { usePageDataContext } from 'utils/hooks';
import CalendarPage from 'components/organization/calendar';
import { TaskFilter } from 'types/task';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import {
  ENTITIES_TYPES,
  GRANTS_STATUSES,
  STATUS_APPROVED,
  STATUS_CLOSED,
  STATUS_OPEN,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
  TASKS_DEFAULT_STATUSES,
} from 'utils/constants';

type CalendarTaskFilter = TaskFilter & {
  types: Array<number>;
};

const OrgCalendarPage = () => {
  const { setPageData } = usePageDataContext();
  const router = useRouter();
  const { username } = router.query;
  const [filters, setFilters] = useState<CalendarTaskFilter>({
    podIds: [],
    statuses: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    // for the calendar view
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
    types: [],
  });

  const [getOrgTaskBoardTasks, { data: orgTaskBoardTasksData }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error(error);
    },
  });

  const [getOrgBoardMilestones, { data: orgBoardMilestones }] = useLazyQuery(GET_ORG_MILESTONE_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
  });

  const [getOrgProposals, { data: orgProposalData }] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error(error);
    },
  });

  const [getOrgGrants, { data: orgGrantsData }] = useLazyQuery(GET_ORG_GRANTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error(error);
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
    if (!orgData?.id) {
      return;
    }

    getOrgTaskBoardTasks({
      variables: {
        podIds: [],
        // statuses: DEFAULT_ENTITY_STATUS_FILTER[activeEntityFromQuery],
        statuses: filters.statuses,
        labelId: null,
        date: null,
        privacyLevel: null,
        orgId: orgData?.id,
        // for the calendar view
        fromDate: format(filters.fromDate, 'yyyy-MM-dd'),
        toDate: format(filters.toDate, 'yyyy-MM-dd'),
      },
    });

    getOrgBoardMilestones({
      variables: {
        podIds: [],
        // statuses: DEFAULT_ENTITY_STATUS_FILTER[activeEntityFromQuery],
        statuses: ['created'],
        labelId: null,
        date: null,
        privacyLevel: null,
        orgId: orgData?.id,
        // for the calendar view
        fromDate: format(filters.fromDate, 'yyyy-MM-dd'),
        toDate: format(filters.toDate, 'yyyy-MM-dd'),
      },
    });

    getOrgProposals({
      variables: {
        offset: 0,
        statuses: [STATUS_OPEN, STATUS_APPROVED, STATUS_CLOSED],
        limit: 1000,
        orgId: orgData?.id,
        // for the calendar view
        fromDate: format(filters.fromDate, 'yyyy-MM-dd'),
        toDate: format(filters.toDate, 'yyyy-MM-dd'),
      },
    });

    getOrgGrants({
      variables: {
        orgId: orgData?.id,
        status: GRANTS_STATUSES.OPEN,
        limit: 1000,
        offset: 0,
        fromDate: format(filters.fromDate, 'yyyy-MM-dd'),
        toDate: format(filters.toDate, 'yyyy-MM-dd'),
      },
    });
    // }, [getOrgTaskBoardTasks, getOrgGrants, getOrgProposals, orgData?.id]);
  }, [filters, orgData?.id]);

  const handleFilterChange = (
    filtersToApply = {
      statuses: [],
      podIds: [],
      labelId: null,
      date: null,
      category: null,
      fromDate: null,
      toDate: null,
      types: [],
    }
  ) => {
    console.log(filtersToApply, '-------->>>filtersToApply');

    setFilters({
      ...filtersToApply,
      // taskTypes: filtersToApply.types ?? filters.types,
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
    // FIXME: remove this when the new API is ready
    tasks: [
      ...(orgTaskBoardTasksData?.getOrgTaskBoardTasks || []),
      ...(orgBoardMilestones?.getOrgBoardMilestones || []),
      ...(orgProposalData?.getOrgTaskBoardProposals || []),
      ...(orgGrantsData?.getGrantOrgBoard || []),
    ],
    grants: orgGrantsData?.getGrantOrgBoard,
    // proposals: orgProposalData?.getOrgTaskBoardProposals,
    handleFilterChange,
    filters,
  };

  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <BoardPageHeader orgData={orgData} headerTitle="Calendar">
          <CalendarPage />
        </BoardPageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};

export default withAuth(OrgCalendarPage);
