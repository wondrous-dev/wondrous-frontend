import { useLazyQuery, useQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import Boards from 'components/Common/Boards';
import BoardsActivity from 'components/Common/BoardsActivity';
import {
  GET_JOIN_ORG_REQUESTS,
  GET_JOIN_POD_REQUESTS,
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_TASKS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
  SEARCH_TASKS_FOR_USER_BOARD_VIEW,
} from 'graphql/queries';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from 'graphql/queries/workflowBoards';
import { useAdminColumns } from 'hooks/useAdminColumns';

import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import apollo from 'services/apollo';
import {
  FILTER_STATUSES_ADMIN,
  LIMIT,
  USER_COLUMNS,
  populateTaskColumns,
  generateUserDashboardFilters,
  generateAdminDashboardFilters,
} from 'services/board';
import { ViewType } from 'types/common';
import { TaskFilter } from 'types/task';
import { dedupeColumns, delQuery } from 'utils';
import { bindSectionToColumns, sectionOpeningReducer } from 'utils/board';
import {
  TASKS_DEFAULT_STATUSES,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  PRIVACY_LEVEL,
} from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';
import {
  useCreateEntityContext,
  useGetPerStatusTaskCountForUserBoard,
  useRouterQuery,
  useSelectMembership,
} from 'utils/hooks';
import { BoardsActivityWrapper } from './styles';

const useGetUserTaskBoardTasks = ({
  isAdmin,
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
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (!isAdmin && loggedInUser?.id) {
      const taskBoardStatuses =
        filters?.statuses.length > 0
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

//TODO @Adrian: not used atm , comment out when we implement tabs to view props
// const useGetUserTaskBoardProposals = ({
//   isAdmin,
//   listView,
//   section,
//   contributorColumns,
//   setContributorColumns,
//   loggedInUser,
//   filters,
// }) => {
//   const [getUserTaskBoardProposals, { data }] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
//     fetchPolicy: 'cache-and-network',
//     nextFetchPolicy: 'cache-first',
//     onCompleted: (data) => {
//       const newColumns = bindSectionToColumns({
//         columns: contributorColumns,
//         data: data?.getUserTaskBoardProposals,
//         section: TASK_STATUS_REQUESTED,
//       });
//       setContributorColumns(newColumns);
//     },
//     onError: (error) => {
//       console.error(error);
//     },
//   });
//   useEffect(() => {
//     if (!isAdmin && loggedInUser?.id) {
//       if (section === TASK_STATUS_REQUESTED || listView || data) {
//         getUserTaskBoardProposals({
//           variables: {
//             podIds: filters?.podIds,
//             userId: loggedInUser?.id,
//             statuses: [STATUS_OPEN],
//             limit: filters?.statuses.length === 0 || filters?.statuses.includes(TASK_STATUS_REQUESTED) ? LIMIT : 0,
//             offset: 0,
//           },
//         });
//       }
//     }
//   }, [getUserTaskBoardProposals, isAdmin, listView, loggedInUser?.id, filters, section, data]);
// };

const useGetUserTaskBoard = ({
  isAdmin,
  view,
  section,
  loggedInUser,
  setHasMoreTasks,
  contributorColumns,
  setContributorColumns,
  filters,
}) => {
  const { getUserTaskBoardTasksFetchMore, fetchPerStatus } = useGetUserTaskBoardTasks({
    isAdmin,
    contributorColumns,
    setContributorColumns,
    setHasMoreTasks,
    loggedInUser,
    filters,
  });
  const listView = view === ViewType.List;
  // useGetUserTaskBoardProposals({
  //   isAdmin,
  //   listView,
  //   section,
  //   contributorColumns,
  //   setContributorColumns,
  //   loggedInUser,
  //   filters,
  // });

  return {
    getUserTaskBoardTasksFetchMore,
    fetchPerStatus,
  };
};

const useFilterSchema = (loggedInUser, isAdmin) => {
  const { userOrgs } = useCreateEntityContext();
  const [filterSchema, setFilterSchema]: any = useState([]);
  useEffect(() => {
    if (!isAdmin && loggedInUser?.id) {
      return setFilterSchema(generateUserDashboardFilters({ userId: loggedInUser?.id, orgs: userOrgs?.getUserOrgs }));
    }
    if (isAdmin && loggedInUser?.id) {
      setFilterSchema(generateAdminDashboardFilters({ userId: loggedInUser?.id, orgs: userOrgs?.getUserOrgs }));
    }
  }, [isAdmin, loggedInUser?.id]);
  return filterSchema;
};

const BoardsPage = (props) => {
  const { isAdmin, selectedStatus, setSelectedStatus } = props;
  const selectMembershipHook = useSelectMembership();
  const router = useRouter();
  const loggedInUser = useMe();
  const { search, view } = router.query;
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [contributorColumns, setContributorColumns] = useState([]);

  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    orgId: null,
  });

  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const { data: userTaskCountData } = useGetPerStatusTaskCountForUserBoard(loggedInUser?.id);
  const selectMembershipRequests = selectMembershipHook?.selectMembershipRequests;
  const [getWorkFlowBoardReviewableItemsCountData, { data: adminPanelCount }] = useLazyQuery(
    GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT
  );

  const { adminColumns, handleAdminColumnsLoadMore } = useAdminColumns({
    isAdmin,
    filters,
  });

  const filterSchema = useFilterSchema(loggedInUser, isAdmin);

  const { getUserTaskBoardTasksFetchMore, fetchPerStatus = () => {} } = useGetUserTaskBoard({
    isAdmin,
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

      if (filters?.statuses.length) {
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

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    // getWorkFlowBoardReviewableItemsCount()
    if (isAdmin) {
      getWorkFlowBoardReviewableItemsCountData();
    }
  }, [isAdmin]);

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
      if (isAdmin) {
        return handleAdminColumnsLoadMore(type);
      }
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

  const handleFilterChange = (filtersToApply = { statuses: [], podIds: [], date: null, orgId: null }) => {
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
  const activeColumns = isAdmin ? adminColumns : contributorColumns;

  const handleOnToggle = () => {
    router.query.view !== ViewType.Admin
      ? router.replace(`${delQuery(router.asPath)}?view=${ViewType.Admin}`)
      : router.replace(`${delQuery(router.asPath)}`);
  };

  const toggleItems = [
    {
      label: 'Contributor',
      isActive: router.query.view !== ViewType.Admin,
      onChange: handleOnToggle,
    },
    {
      label: 'Admin',
      isActive: router.query.view === ViewType.Admin,
      onChange: handleOnToggle,
    },
  ];

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
        adminWorkflowCount: adminPanelCount?.getWorkFlowBoardReviewableItemsCount,
      }}
    >
      <BoardsActivityWrapper>
        <BoardsActivity
          onSearch={handleSearch}
          filterSchema={filterSchema}
          onFilterChange={handleFilterChange}
          statuses={filters?.statuses}
          podIds={filters?.podIds}
          withAdminToggle
          isAdmin={isAdmin}
          selectMembershipRequests={selectMembershipRequests}
          toggleItems={toggleItems}
        />
      </BoardsActivityWrapper>
      <Boards
        columns={activeColumns}
        onLoadMore={handleLoadMore}
        hasMore={hasMoreTasks}
        isAdmin={isAdmin}
        setColumns={setContributorColumns}
      />
    </UserBoardContext.Provider>
  );
};

export default BoardsPage;
