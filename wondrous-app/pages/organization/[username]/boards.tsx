import { useLazyQuery, useQuery } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import Boards from 'components/organization/boards/boards';
import EntitySidebar from 'components/Common/SidebarEntity';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, SEARCH_ORG_USERS } from 'graphql/queries/org';
import {
  GET_ORG_TASK_BOARD_CALENDAR,
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
import { dedupeColumns, insertUrlParam } from 'utils';
import { format } from 'date-fns';
import { sectionOpeningReducer } from 'utils/board';
import {
  STATUSES_ON_ENTITY_TYPES,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  ENTITIES_TYPES,
  STATUS_APPROVED,
  STATUS_CLOSED,
  PROPOSAL_STATUS_LIST,
} from 'utils/constants';
import { OrgBoardContext } from 'utils/contexts';
import { useIsMobile } from 'utils/hooks';

const useGetOrgTaskBoardCalendar = ({
  setColumns,
  orgId,
  userId,
  entityType,
  setIsLoading,
  search,
  filters,
  calendarView,
  fromDate,
  toDate,
  isDashboard,
}) => {
  const [getOrgTaskBoardCalendar] = useLazyQuery(GET_ORG_TASK_BOARD_CALENDAR, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setColumns(data?.getOrgTaskBoardCalendar);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error(error);
    },
  });

  useEffect(() => {
    if (!userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search && orgId && calendarView && !isDashboard) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      getOrgTaskBoardCalendar({
        variables: {
          orgId,
          podIds: filters?.podIds,
          offset: 0,
          statuses: taskBoardStatuses,
          labelId: filters?.labelId,
          date: filters?.date,
          fromDate: format(fromDate, 'yyyy-MM-dd'),
          toDate: format(toDate, 'yyyy-MM-dd'),
          types: [entityType],
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
    }
  }, [getOrgTaskBoardCalendar, orgId, filters, userId, entityType, calendarView, fromDate]);
};

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
  calendarView,
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
      console.error(error);
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
      console.error(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (!userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search && orgId && !calendarView) {
      setIsLoading(true);
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
          offset: 0,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
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
  }, [getOrgTaskBoardTasks, orgId, filters, setOrgTaskHasMore, userId, entityType, calendarView]);

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
      console.error(error);
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
  calendarView,
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
      console.error(error);
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
      console.error(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search && orgId && !calendarView) {
      setIsLoading(true);

      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getTasksRelatedToUserInOrg({
        variables: {
          podIds: filters?.podIds,
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
  calendarView,
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
      console.error(error, 'err=');
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
      console.error(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search && orgId && !calendarView) {
      setIsLoading(true);

      const proposalBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
          : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED];
      getOrgTaskProposals({
        variables: {
          podIds: filters?.podIds,
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
  fromDate,
  toDate,
}) => {
  const listView = view === ViewType.List;
  const calendarView = view === ViewType.Calendar;
  const router = useRouter();
  const isDashboard = router.asPath.includes('/dashboard');
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
      calendarView,
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
      calendarView,
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
      calendarView,
    }),
    calendarTasks: useGetOrgTaskBoardCalendar({
      isDashboard,
      setColumns,
      orgId,
      userId,
      entityType,
      setIsLoading,
      search,
      filters,
      calendarView,
      fromDate,
      toDate,
    }),
  };
  const { fetchMore, fetchPerStatus }: any =
    entityType === ENTITIES_TYPES.PROPOSAL ? board.proposals : userId ? board[userId] : board.withoutUserId;

  return { fetchMore, fetchPerStatus };
};

function BoardsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { username, orgId, search, view = ViewType.Grid, userId, entity } = router.query;
  const activeEntityFromQuery = (Array.isArray(entity) ? entity[0] : entity) || ENTITIES_TYPES.TASK;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    labelId: null,
    date: null,
    privacyLevel: null,
  });
  const [orgData, setOrgData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [entityType, setEntityType] = useState(activeEntityFromQuery);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState(view);
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const [getUser, { data: getUserData }] = useLazyQuery(GET_USER);
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 24);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 6);

  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(lastDay);

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
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
    fromDate,
    toDate,
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
    insertUrlParam('entity', type);
    setEntityType(type);
    setFilters({});
    if (type === ENTITIES_TYPES.PROPOSAL && activeView !== ViewType.Grid) {
      setActiveView(ViewType.Grid);
      insertUrlParam('view', ViewType.Grid);
    }
  };

  const [searchOrgTaskProposals] = useLazyQuery(SEARCH_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const boardColumns = [...columns];
      boardColumns[0].tasks = [...boardColumns[0].tasks, ...data?.searchProposalsForOrgBoardView];
      setColumns(boardColumns);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error(error);
      setIsLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgBoardTaskCount, { data: orgTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD);

  const searchOrgTaskProposalsArgs = {
    variables: {
      podIds: filters?.podIds,
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
          orgId: id,
          limit: LIMIT,
          offset: 0,
          queryString: searchString,
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

  const handleCalendarDatesChange = (date) => {
    const holdFromDate = new Date(date);
    // so that if there are previous days on the calendar not in the month then it will get those tasks as well
    holdFromDate.setDate(holdFromDate.getDate() - 6);
    setFromDate(holdFromDate);
    setToDate(new Date(date.getFullYear(), date.getMonth() + 1, 6));
  };

  const handleFilterChange: any = (filtersToApply = { statuses: [], podIds: [], labelId: null, date: null }) => {
    setFilters(filtersToApply);

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
        };
        searchOrgTaskProposals(proposalArgs);
        setIsLoading(false);
      }
    }
  };
  return (
    <OrgBoardContext.Provider
      value={{
        columns,
        setColumns,
        orgId: orgData?.id,
        taskCount: orgTaskCountData?.getPerStatusTaskCountForOrgBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        setFirstTimeFetch,
        orgData,
        setSection,
        entityType,
        setEntityType: handleEntityTypeChange,
        activeView,
        setActiveView,
        user: getUserData?.getUser,
        deleteUserIdFilter,
        fetchPerStatus,
        onLoadMore: fetchMore,
        hasMore: orgTaskHasMore,
      }}
    >
      {isMobile ? <MobileComingSoonModal /> : null}
      <EntitySidebar>
        <Boards
          columns={columns}
          searchString={searchString}
          onLoadMore={fetchMore}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onCalendarDateChange={handleCalendarDatesChange}
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
