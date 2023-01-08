import { useLazyQuery, useQuery } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import { Boards } from 'components/Collaboration';
import EntitySidebar from 'components/Common/SidebarEntity';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, SEARCH_ORG_USERS } from 'graphql/queries/org';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_TASKS_RELATED_TO_USER_IN_ORG,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
} from 'graphql/queries/taskBoard';
import { GET_USER } from 'graphql/queries/user';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import apollo from 'services/apollo';
import {
  LIMIT,
  ORG_POD_COLUMNS,
  ORG_POD_PROPOSAL_COLUMNS,
  populateProposalColumns,
  populateTaskColumns,
} from 'services/board';
import { ViewType } from 'types/common';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import { extendFiltersByView, sectionOpeningReducer } from 'utils/board';
import {
  ENTITIES_TYPES,
  PRIVACY_LEVEL,
  PROPOSAL_STATUS_LIST,
  STATUS_APPROVED,
  STATUS_CLOSED,
  STATUS_OPEN,
  STATUSES_ON_ENTITY_TYPES,
  TASK_STATUSES,
} from 'utils/constants';
import { OrgBoardContext } from 'utils/contexts';
import { useGlobalContext } from 'utils/hooks';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

const useGetOrgTaskBoardTasks = ({
  columns,
  setColumns,
  setOrgTaskHasMore,
  orgId,
  userId,
  entityType,
  setIsLoading,
  search,
  filters,
  view,
}) => {
  const [getOrgTaskBoardTasks, { fetchMore }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgTaskBoardTasks }) => {
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(getOrgTaskBoardTasks);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(getOrgTaskBoardTasks, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
    },
  });
  const getOrgTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset:
          entityType === ENTITIES_TYPES.TASK ? Math.max(...columns.map(({ tasks }) => tasks.length)) : columns.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardTasks.length >= LIMIT);
        return {
          getOrgTaskBoardTasks: [...prev.getOrgTaskBoardTasks, ...fetchMoreResult.getOrgTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (!userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search && orgId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getOrgTaskBoardTasks({
        variables: {
          orgId,
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          offset: 0,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          labelId: filters?.labelId,
          date: filters?.date,
          types: [entityType],
          ...extendFiltersByView(view, filters),
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [getOrgTaskBoardTasks, orgId, filters, setOrgTaskHasMore, userId, entityType]);

  const fetchPerStatus = async (status, limit) => {
    const columnIdx = columns?.findIndex((column) => column.status === status);
    fetchMore({
      variables: {
        offset: columns[columnIdx]?.tasks?.length,
        statuses: [status],
        ...(limit ? { limit } : {}),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardTasks.length >= LIMIT);
        return {
          getOrgTaskBoardTasks: [...prev.getOrgTaskBoardTasks, ...fetchMoreResult.getOrgTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchMore: getOrgTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetTaskRelatedToUser = ({
  userId,
  orgId,
  setColumns,
  columns,
  setOrgTaskHasMore,
  entityType,
  setIsLoading,
  search,
  filters,
}) => {
  const [getTasksRelatedToUserInOrg, { fetchMore }] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_ORG, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getTasksRelatedToUserInOrg }) => {
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(getTasksRelatedToUserInOrg);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(getTasksRelatedToUserInOrg, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
    },
  });

  const getTasksRelatedToUserFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset:
          entityType === ENTITIES_TYPES.TASK
            ? columns.reduce((prev, next) => (prev += next.tasks.length), 0)
            : columns.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getTasksRelatedToUserInOrg.length >= LIMIT);
        const getTasksRelatedToUserInOrg = [
          ...prev.getTasksRelatedToUserInOrg,
          ...fetchMoreResult.getTasksRelatedToUserInOrg,
        ];
        return {
          getTasksRelatedToUserInOrg,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search && orgId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getTasksRelatedToUserInOrg({
        variables: {
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          userId,
          orgId,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          offset: 0,
          labelId: filters?.labelId,
          date: filters?.date,
          types: [entityType],
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [orgId, userId, entityType, filters]);
  return { fetchMore: getTasksRelatedToUserFetchMore };
};

const useGetOrgTaskBoardProposals = ({
  listView,
  section,
  columns,
  setColumns,
  orgId,
  entityType,
  setIsLoading,
  setOrgTaskHasMore,
  search,
  filters,
}) => {
  const [getOrgTaskProposals, { data, fetchMore }] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgTaskBoardProposals }) => {
      const newColumns = populateProposalColumns(getOrgTaskBoardProposals, ORG_POD_PROPOSAL_COLUMNS);
      setColumns(newColumns);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error, 'err=');
      setIsLoading(false);
    },
  });

  const getProposalsFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardProposals.length >= LIMIT);
        const getOrgTaskBoardProposals = [
          ...prev.getOrgTaskBoardProposals,
          ...fetchMoreResult.getOrgTaskBoardProposals,
        ];
        return {
          getOrgTaskBoardProposals,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search && orgId) {
      const proposalBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
          : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED];
      getOrgTaskProposals({
        variables: {
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          orgId,
          statuses: proposalBoardStatuses,
          offset: 0,
          labelId: filters?.labelId,
          limit: LIMIT,
        },
      });
    }
  }, [getOrgTaskProposals, orgId, setOrgTaskHasMore, entityType, filters]);
  return { fetchMore: getProposalsFetchMore };
};

const useGetOrgTaskBoard = ({
  section,
  columns,
  setColumns,
  setOrgTaskHasMore,
  orgId,
  userId,
  view,
  entityType,
  setIsLoading,
  search,
  filters,
}) => {
  const listView = view === ViewType.List;
  const board = {
    [userId]: useGetTaskRelatedToUser({
      columns,
      setColumns,
      setOrgTaskHasMore,
      userId,
      orgId,
      filters,
      entityType,
      setIsLoading,
      search,
    }),
    withoutUserId: useGetOrgTaskBoardTasks({
      columns,
      setColumns,
      setOrgTaskHasMore,
      orgId,
      userId,
      entityType,
      setIsLoading,
      search,
      filters,
      view,
    }),
    proposals: useGetOrgTaskBoardProposals({
      listView,
      section,
      columns,
      setColumns,
      setOrgTaskHasMore,
      orgId,
      entityType,
      setIsLoading,
      search,
      filters,
    }),
  };
  const { fetchMore, fetchPerStatus }: any =
    entityType === ENTITIES_TYPES.PROPOSAL ? board.proposals : userId ? board[userId] : board.withoutUserId;

  return { fetchMore, fetchPerStatus };
};

function BoardsPage() {
  const router = useRouter();
  const { username, orgId, search, view = ViewType.Grid, userId, entity } = router.query;
  const activeEntityFromQuery = (Array.isArray(entity) ? entity[0] : entity) || ENTITIES_TYPES.TASK;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    priorities: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    // for the calendar view
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
  });
  const [orgData, setOrgData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [entityType, setEntityType] = useState(activeEntityFromQuery);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState(view);
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const [getUser, { data: getUserData }] = useLazyQuery(GET_USER);
  const { userPermissionsContext } = useGlobalContext();
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(true);

  const { fetchMore, fetchPerStatus } = useGetOrgTaskBoard({
    view: activeView,
    section,
    columns,
    setColumns,
    setOrgTaskHasMore,

    orgId: orgId ?? orgData?.id,
    userId,
    entityType,
    setIsLoading,
    search,
    filters,
  });

  useEffect(() => {
    if (userId) {
      getUser({ variables: { userId } });
    }
  }, [userId]);

  const deleteUserIdFilter = () => {
    const routerQuery = { ...router.query };
    delete routerQuery.userId;
    return router.push(
      {
        pathname: location.pathname,
        query: routerQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleEntityTypeChange = (type) => {
    if (type !== entityType) {
      setIsLoading(true);
    }

    const query: any = { ...router.query, entity: type };

    setEntityType(type);
    setFilters({
      fromDate: startOfMonth(new Date()),
      toDate: endOfMonth(new Date()),
    });
    if (type === ENTITIES_TYPES.PROPOSAL && activeView !== ViewType.Grid) {
      setActiveView(ViewType.Grid);
      query.view = ViewType.Grid;
    }

    router.push({ query }, undefined, { shallow: true });
  };

  const [searchOrgTaskProposals] = useLazyQuery(SEARCH_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const boardColumns = [...columns];
      if (boardColumns[0].tasks?.length > 0) {
        boardColumns[0].tasks = [...boardColumns[0].tasks, ...data?.searchProposalsForOrgBoardView];
        setColumns(boardColumns);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgBoardTaskCount, { data: orgTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD);

  const searchOrgTaskProposalsArgs = {
    variables: {
      podIds: filters?.podIds,
      priorities: filters?.priorities,
      orgId: orgId || orgData?.id,
      statuses: [STATUS_OPEN],
      offset: 0,
      limit: 1000,
      searchString: search,
    },
  };

  const [searchOrgTasks] = useLazyQuery(SEARCH_TASKS_FOR_ORG_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForOrgBoardView;
      const newColumns = populateTaskColumns(tasks, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      searchOrgTaskProposals(searchOrgTaskProposalsArgs);
      if (orgTaskHasMore) {
        setOrgTaskHasMore(tasks.length >= LIMIT);
      }
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

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

  useEffect(() => {
    if (orgId || orgData?.id) {
      const id = orgId || orgData?.id;

      if (search) {
        if (!firstTimeFetch) {
          const id = orgId || orgData?.id;
          const searchOrgTasksArgs = {
            variables: {
              podIds: filters?.podIds,
              priorities: filters?.priorities,
              orgId: id,
              limit: 1000,
              offset: 0,
              // Needed to exclude proposals
              statuses: STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
              searchString: search,
              ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
                onlyPublic: true,
              }),
            },
          };
          searchOrgTasks(searchOrgTasksArgs);
          setFirstTimeFetch(true);
          setSearchString(search as string);
        }
      } else {
        getOrgBoardTaskCount({
          variables: {
            orgId: id,
          },
        });
      }
    }
  }, [orgData, orgId, getOrgBoardTaskCount, , filters]);

  function handleSearch(searchString: string) {
    const id = orgId || orgData?.id;
    const searchOrgTasksArgs = {
      variables: {
        podIds: filters?.podIds,
        priorities: filters?.priorities,
        orgId: id,
        limit: LIMIT,
        offset: 0,
        // Needed to exclude proposals
        statuses: STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
        searchString,
        ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
          onlyPublic: true,
        }),
      },
    };

    const promises: any = [
      apollo.query({
        query: SEARCH_ORG_USERS,
        variables: {
          orgIds: [id],
          limit: LIMIT,
          offset: 0,
          searchString,
        },
      }),
      apollo.query({
        ...{ ...searchOrgTaskProposalsArgs, limit: LIMIT },
        query: SEARCH_ORG_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchOrgTasksArgs,
        query: SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([users, proposals, tasks]: any) => ({
      users: users.data.searchOrgUsers,
      proposals: proposals.data.searchProposalsForOrgBoardView,
      tasks: tasks.data.searchTasksForOrgBoardView,
    }));
  }

  const handleFilterChange: any = (
    filtersToApply = { statuses: [], podIds: [], labelId: null, date: null, fromDate: null, toDate: null }
  ) => {
    setFilters({
      ...filtersToApply,
      fromDate: filtersToApply.fromDate ?? filters.fromDate,
      toDate: filtersToApply.toDate ?? filters.toDate,
    });

    if (search) {
      const id = orgId || orgData?.id;
      const taskStatuses = filtersToApply?.statuses.filter((status) => TASK_STATUSES.includes(status));
      const searchProposals =
        filtersToApply?.statuses.length !== taskStatuses.length ||
        filtersToApply?.statuses === (STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT);
      const searchTasks = !(searchProposals && filtersToApply?.statuses.length === 1);

      const searchOrgTasksArgs = {
        variables: {
          podIds: filtersToApply?.podIds,
          orgId: id,
          limit: 1000,
          labelId: filtersToApply?.labelId,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses,
          search,
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      };

      if (searchTasks) {
        searchOrgTasks(searchOrgTasksArgs);
      } else {
        const newColumns = [...columns];
        newColumns.forEach((column) => {
          column.tasks = [];
        });

        setColumns(dedupeColumns(newColumns));
        setIsLoading(false);
      }

      if (searchProposals) {
        const proposalArgs = {
          ...searchOrgTaskProposalsArgs,
          podIds: filters?.podIds,
          priorities: filters?.priorities,
        };
        searchOrgTaskProposals(proposalArgs);
        setIsLoading(false);
      }
    }
  };

  const handleActiveViewChange = (newView: ViewType) => {
    setActiveView(newView);

    if (newView === ViewType.Calendar) {
      // Trigger getOrgTaskBoardTasks query
      setFilters({ ...filters });
    }
  };

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
        columns,
        setColumns,
        orgId: orgData?.id,
        taskCount: orgTaskCountData?.getPerStatusTaskCountForOrgBoard,
        userPermissionsContext,
        setFirstTimeFetch,
        orgData,
        setSection,
        entityType,
        filters,
        handleFilterChange,
        setEntityType: handleEntityTypeChange,
        activeView,
        setActiveView: handleActiveViewChange,
        user: getUserData?.getUser,
        deleteUserIdFilter,
        fetchPerStatus,
        onLoadMore: fetchMore,
        hasMore: orgTaskHasMore,
      }}
    >
      <EntitySidebar>
        <Boards
          columns={columns}
          searchString={searchString}
          onLoadMore={fetchMore}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          hasMore={orgTaskHasMore}
          orgData={orgData}
          statuses={filters?.statuses}
          podIds={filters?.podIds}
          setColumns={setColumns}
          loading={isLoading}
          entityType={entityType}
          userId={userId?.toString()}
          activeView={activeView}
        />
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
}

export default withAuth(BoardsPage);
