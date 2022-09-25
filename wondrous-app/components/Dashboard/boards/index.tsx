import { useLazyQuery, useQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import Boards from 'components/Common/Boards';
import {
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_TASK_BOARD_TASKS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
  SEARCH_TASKS_FOR_USER_BOARD_VIEW,
} from 'graphql/queries';

import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import apollo from 'services/apollo';
import { LIMIT, USER_COLUMNS, populateTaskColumns, generateUserDashboardFilters } from 'services/board';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import { sectionOpeningReducer } from 'utils/board';
import {
  TASKS_DEFAULT_STATUSES,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  PRIVACY_LEVEL,
} from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';
import { useGlobalContext, useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';
import BoardWrapper from './BoardWrapper';

const useGetUserTaskBoardTasks = ({
  contributorColumns,
  setContributorColumns,
  setHasMoreTasks,
  loggedInUser,
  filters,
}) => {
  const [getUserTaskBoardTasks, { fetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks ?? [];
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
          userId: loggedInUser?.id,
          statuses: taskBoardStatuses,
          limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
          offset: 0,
          orgId: filters?.orgId,
          priorities: filters?.priorities,
          date: filters?.date,
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
}) => {
  const { getUserTaskBoardTasksFetchMore, fetchPerStatus } = useGetUserTaskBoardTasks({
    contributorColumns,
    setContributorColumns,
    setHasMoreTasks,
    loggedInUser,
    filters,
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
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [contributorColumns, setContributorColumns] = useState([]);

  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    priorities: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    orgId: null,
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
  });

  const bindProposalsToCols = (taskProposals) => {
    const newColumns = [...contributorColumns];
    newColumns[0].section.tasks = [];
    taskProposals?.forEach((taskProposal) => {
      newColumns[0].section.tasks.push(taskProposal);
    });
    setContributorColumns(newColumns);
  };
  const [searchTasks] = useLazyQuery(SEARCH_TASKS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForUserBoardView;
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : USER_COLUMNS);
      newColumns[0].section.tasks = [];
      newColumns[1].section.tasks = [];
      newColumns[2].section.tasks = [];

      tasks.forEach((task) => {
        if (task.status === TASK_STATUS_IN_REVIEW) {
          newColumns[1].section.tasks.push(task);
        }
      });

      if (filters?.statuses?.length) {
        newColumns.forEach((column) => {
          if (!filters?.statuses.includes(column.section.filter.taskType)) {
            column.section.tasks = [];
          }
        });
      }

      setContributorColumns(dedupeColumns(newColumns));
      if (hasMoreTasks) {
        setHasMoreTasks(tasks.length > LIMIT - 1);
      }
    },
    fetchPolicy: 'cache-and-network',
  });
  const [searchProposals] = useLazyQuery(SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForUserBoardView),
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    if (search) {
      const searchTaskProposalsArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString: search,
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
          searchString: search,
        },
      };

      searchTasks(searchTasksArgs);
      searchProposals(searchTaskProposalsArgs);
    }
  }, [loggedInUser]);

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
        query: SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
      }),

      apollo.query({
        ...searchTasksArgs,
        query: SEARCH_TASKS_FOR_USER_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([proposals, tasks]: any) => ({
      proposals: proposals.data.searchProposalsForUserBoardView,
      tasks: tasks.data.searchTasksForUserBoardView,
    }));
  }

  const handleFilterChange = (filtersToApply = { statuses: [], podIds: [], priorities: [], date: null, orgId: null }) => {
    setFilters(filtersToApply);
    if (search) {
      const taskStatuses = filtersToApply.statuses?.filter((status) => TASK_STATUSES.includes(status));
      const shouldSearchProposals =
        filtersToApply.statuses?.length !== taskStatuses?.length || filtersToApply.statuses === TASKS_DEFAULT_STATUSES;
      const shouldSearchTasks = !(searchProposals && filtersToApply.statuses?.length === 1);
      const searchTaskProposalsArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: filtersToApply.podIds,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString: search,
        },
      };

      const searchTasksArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: filtersToApply.podIds,
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses,
          searchString: search,
        },
      };

      if (shouldSearchTasks) {
        searchTasks(searchTasksArgs);
      } else {
        const newColumns = [...contributorColumns];
        newColumns.forEach((column) => {
          column.tasks = [];
          column.section.tasks = [];
        });

        setContributorColumns(newColumns);
      }

      if (shouldSearchProposals) {
        searchProposals(searchTaskProposalsArgs);
      }
    }
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
