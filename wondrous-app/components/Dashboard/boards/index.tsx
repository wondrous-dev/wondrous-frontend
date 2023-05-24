import { useLazyQuery, useQuery } from '@apollo/client';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { useMe } from 'components/Auth/withAuth';
import Boards from 'components/Common/Boards';
import {
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_TASKS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
} from 'graphql/queries';

import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import apollo from 'services/apollo';
import { LIMIT, USER_COLUMNS, populateTaskColumns, generateUserDashboardFilters } from 'services/board';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import { extendFiltersByView, sectionOpeningReducer } from 'utils/board';
import { TASKS_DEFAULT_STATUSES, STATUS_OPEN, PRIVACY_LEVEL, TASK_STATUS_DONE } from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';
import { useGlobalContext, useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';
import BoardWrapper from './BoardWrapper';

const useGetUserTaskBoardTasks = ({
  contributorColumns,
  setContributorColumns,
  setHasMoreTasks,
  loggedInUser,
  filters,
  view,
  userOrgs,
  userPods,
}) => {
  const [getUserTaskBoardTasks, { fetchMore, variables }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const tasks = (data?.getUserTaskBoardTasks ?? []).filter(({ orgId, podId, status }) => {
        if (status === TASK_STATUS_DONE) return true;
        const orgModules = userOrgs?.find(({ id }) => id === orgId)?.modules;
        const podModules = userPods?.find(({ id }) => id === podId)?.modules;

        if (podId && !orgModules?.pod) return false;
        if (!podId && orgId && orgModules?.task) return true;
        if (podId && podModules?.task) return true;

        return false;
      });
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : USER_COLUMNS);
      setContributorColumns(dedupeColumns(newColumns));
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const getUserTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...contributorColumns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMoreTasks(fetchMoreResult?.getUserTaskBoardTasks?.length >= LIMIT);
        return {
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [contributorColumns, fetchMore, setHasMoreTasks]);

  const fetchPerStatus = async (status, limit) => {
    const column = contributorColumns?.find((column) => column.status === status);

    fetchMore({
      variables: {
        ...variables,
        offset: column?.tasks?.length,
        statuses: [status],
        ...(limit ? { limit } : {}),
      },
      updateQuery: (prev, { fetchMoreResult }) => ({
        getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
      }),
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (loggedInUser?.id) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => TASKS_DEFAULT_STATUSES.includes(status))
          : TASKS_DEFAULT_STATUSES;
      const taskBoardStatusesIsNotEmpty = taskBoardStatuses.length > 0;

      getUserTaskBoardTasks({
        variables: {
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          userId: loggedInUser?.id,
          statuses: taskBoardStatuses,
          limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
          offset: 0,
          orgId: filters?.orgId,
          date: filters?.date,
          ...extendFiltersByView(view, filters),
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setHasMoreTasks(true);
    }
  }, [getUserTaskBoardTasks, loggedInUser?.id, filters, setHasMoreTasks]);

  return { getUserTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetUserTaskBoard = ({
  view,
  section,
  loggedInUser,
  setHasMoreTasks,
  contributorColumns,
  setContributorColumns,
  filters,
  userOrgs,
  userPods,
}) => {
  const { getUserTaskBoardTasksFetchMore, fetchPerStatus } = useGetUserTaskBoardTasks({
    contributorColumns,
    setContributorColumns,
    setHasMoreTasks,
    loggedInUser,
    filters,
    view,
    userOrgs,
    userPods,
  });
  return {
    getUserTaskBoardTasksFetchMore,
    fetchPerStatus,
  };
};

const useFilterSchema = (loggedInUser) => {
  const { userOrgs } = useGlobalContext();

  if (loggedInUser?.id) {
    return generateUserDashboardFilters({ userId: loggedInUser?.id, orgs: userOrgs?.getUserOrgs });
  }
};

const BoardsPage = (props) => {
  const { isAdmin } = props;
  const router = useRouter();
  const loggedInUser = useMe();
  const { search, view } = router.query;
  const [activeView, setActiveView] = useState(view as string);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [contributorColumns, setContributorColumns] = useState([]);
  const { userOrgs, userPods } = useGlobalContext();

  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    orgId: null,
    // for the calendar view
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
  });

  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const { data: userTaskCountData } = useGetPerStatusTaskCountForUserBoard(loggedInUser?.id);

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const filterSchema = useFilterSchema(loggedInUser);

  const { getUserTaskBoardTasksFetchMore, fetchPerStatus = () => {} } = useGetUserTaskBoard({
    section,
    loggedInUser,
    setHasMoreTasks,
    contributorColumns,
    setContributorColumns,
    view,
    filters,
    userOrgs: userOrgs?.getUserOrgs,
    userPods: userPods?.getUserPods,
  });

  const handleLoadMore = (type = null) => {
    if (hasMoreTasks) {
      return getUserTaskBoardTasksFetchMore();
    }
  };

  function handleSearch(searchString: string) {
    const searchTaskProposalsArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: LIMIT,
        searchString,
      },
    };

    const searchTasksArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        limit: LIMIT,
        offset: 0,
        // Needed to exclude proposals
        statuses: TASKS_DEFAULT_STATUSES,
        searchString,
      },
    };

    const promises: any = [
      apollo.query({
        ...searchTaskProposalsArgs,
        query: GET_USER_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchTasksArgs,
        query: GET_USER_TASK_BOARD_TASKS,
      }),
    ];

    return Promise.all(promises).then(([proposals, tasks]: any) => ({
      proposals: proposals.data.getUserTaskBoardProposals.map((proposal) => ({ ...proposal, isProposal: true })),
      tasks: tasks.data.getUserTaskBoardTasks,
    }));
  }

  const handleFilterChange = (
    filtersToApply = { statuses: [], podIds: [], date: null, orgId: null, fromDate: null, toDate: null }
  ) => {
    setFilters({
      ...filtersToApply,
      fromDate: filtersToApply.fromDate ?? filters.fromDate,
      toDate: filtersToApply.toDate ?? filters.toDate,
    });
  };

  return (
    <UserBoardContext.Provider
      value={{
        columns: contributorColumns,
        setColumns: setContributorColumns,
        taskCount: userTaskCountData?.getPerStatusTaskCountForUserBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        activeView,
        setActiveView,
        handleFilterChange,
        filters,
        loggedInUserId: loggedInUser?.id,
        setSection,
        fetchPerStatus,
        hasMore: hasMoreTasks,
        onLoadMore: handleLoadMore,
      }}
    >
      <BoardWrapper
        isAdmin={isAdmin}
        onSearch={handleSearch}
        filterSchema={filterSchema}
        onFilterChange={handleFilterChange}
        statuses={filters?.statuses}
        podIds={filters?.podIds}
      >
        <Boards
          activeView={activeView}
          columns={contributorColumns}
          onLoadMore={handleLoadMore}
          hasMore={hasMoreTasks}
          isAdmin={isAdmin}
          setColumns={setContributorColumns}
        />
      </BoardWrapper>
    </UserBoardContext.Provider>
  );
};

export default BoardsPage;
