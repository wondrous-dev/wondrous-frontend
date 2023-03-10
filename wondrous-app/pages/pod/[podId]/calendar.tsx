import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { withAuth } from 'components/Auth/withAuth';
import {
  GET_ORG_BY_ID,
  GET_POD_GRANTS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  GET_USER_PERMISSION_CONTEXT,
} from 'graphql/queries';
import { PodBoardContext } from 'utils/contexts';
import EntitySidebar from 'components/Common/SidebarEntity';
import { usePodPageFetch } from 'utils/hooks';
import CalendarPage from 'components/organization/calendar';
import { TaskFilter } from 'types/task';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import {
  GRANTS_STATUSES,
  STATUS_APPROVED,
  STATUS_CLOSED,
  STATUS_OPEN,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';

const OrgCalendarPage = () => {
  const router = useRouter();
  const { podId } = router.query;
  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    // for the calendar view
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
    taskTypes: [],
  });

  const [getPodTaskBoardTasks, { data: podTaskBoardTasksData }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log(error);
    },
  });

  const [getPodProposals, { data: podProposalData }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log(error);
    },
  });

  const [getPodGrants, { data: podGrantsData }] = useLazyQuery(GET_POD_GRANTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log(error);
    },
  });

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const { data } = usePodPageFetch(podId);

  useEffect(() => {
    getPodTaskBoardTasks({
      variables: {
        input: {
          podId,
          limit: 1000,
          offset: 0,
          date: filters?.date,
          statuses: [
            TASK_STATUS_IN_PROGRESS,
            TASK_STATUS_TODO,
            TASK_STATUS_IN_REVIEW,
            TASK_STATUS_DONE,
            TASK_STATUS_ARCHIVED,
          ],
        },
      },
    });

    getPodProposals({
      variables: {
        input: {
          podId,
          statuses: [STATUS_OPEN, STATUS_APPROVED, STATUS_CLOSED],
          offset: 0,
          limit: 100,
        },
      },
    });

    getPodGrants({
      variables: {
        podId,
        status: GRANTS_STATUSES.OPEN,
        limit: 1000,
        offset: 0,
      },
    });
  }, [getPodTaskBoardTasks, getPodGrants, getPodProposals, podId]);

  const handleFilterChange: any = (
    filtersToApply = {
      statuses: [],
      podIds: [],
      labelId: null,
      date: null,
      category: null,
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

  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  useEffect(() => {
    if (data?.getPodById?.orgId) {
      getOrgById({
        variables: {
          orgId: data?.getPodById?.orgId,
        },
      });
    }
  }, [getOrgById, data?.getPodById?.orgId]);

  return (
    <PodBoardContext.Provider
      value={{
        pod: data?.getPodById,
        podId,
        orgId: data?.getPodById?.orgId,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        tasks: podTaskBoardTasksData?.getPodTaskBoardTasks,
        grants: podGrantsData?.getGrantPodBoard,
        proposals: podProposalData?.getPodTaskBoardProposals,
        handleFilterChange,
        filters,
      }}
    >
      <EntitySidebar>
        <BoardPageHeader orgData={orgData?.getOrgById} headerTitle="Calendar">
          <CalendarPage />
        </BoardPageHeader>
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
};

export default withAuth(OrgCalendarPage);
