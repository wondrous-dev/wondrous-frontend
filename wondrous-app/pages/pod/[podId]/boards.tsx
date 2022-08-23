import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ViewType } from 'types/common';
import Boards from 'components/Pod/boards';
import { bindSectionToColumns, sectionOpeningReducer } from 'utils/board';
import { useRouterQuery } from 'utils/hooks';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import { GET_USER_PERMISSION_CONTEXT, SEARCH_POD_USERS } from 'graphql/queries';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import { GET_USER } from 'graphql/queries/user';

import {
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  GET_POD_TASK_BOARD_CALENDAR,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  GET_TASKS_RELATED_TO_USER_IN_POD,
  SEARCH_POD_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_POD_BOARD_VIEW,
} from 'graphql/queries/taskBoard';
import apollo from 'services/apollo';
import {
  ORG_POD_COLUMNS,
  LIMIT,
  populateTaskColumns,
  ORG_POD_PROPOSAL_COLUMNS,
  populateProposalColumns,
} from 'services/board';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import {
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  ENTITIES_TYPES,
  STATUSES_ON_ENTITY_TYPES,
  STATUS_APPROVED,
  PROPOSAL_STATUS_LIST,
  STATUS_CLOSED,
} from 'utils/constants';
import { PodBoardContext } from 'utils/contexts';
import uniqBy from 'lodash/uniqBy';
import { insertUrlParam } from 'utils';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';
import { format } from 'date-fns';

const useGetPodTaskBoardCalendar = ({
  setColumns,
  podId,
  userId,
  entityType,
  setIsLoading,
  search,
  statuses,
  privacyLevel,
  calendarView,
  fromDate,
  toDate,
}) => {
  const [getPodTaskBoardCalendar] = useLazyQuery(GET_POD_TASK_BOARD_CALENDAR, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY || calendarView) {
        setColumns(data?.getPodTaskBoardCalendar);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (entityType !== ENTITIES_TYPES.PROPOSAL && podId && !search && !userId && calendarView) {
      const taskBoardStatuses =
        statuses?.length > 0
          ? statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES[entityType].includes(status))
          : //double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;

      getPodTaskBoardCalendar({
        variables: {
          input: {
            podId,
            statuses: taskBoardStatuses,
            offset: 0,
            fromDate: format(fromDate, 'yyyy-MM-dd'),
            toDate: format(toDate, 'yyyy-MM-dd'),
            types: [entityType],
            ...(privacyLevel === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        },
      });
    }
  }, [getPodTaskBoardCalendar, podId, statuses, entityType, privacyLevel, calendarView]);
};

const useGetPodTaskBoardTasks = ({
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  statuses,
  entityType,
  setIsLoading,
  search,
  labelId,
  date,
  privacyLevel,
  userId,
  calendarView,
}) => {
  const [getPodTaskBoardTasks, { variables, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(data?.getPodTaskBoardTasks);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(data?.getPodTaskBoardTasks, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getPodTaskBoardTasksFetchMore = useCallback(() => {
    const fetchMoreVariables = {
      ...variables,
      input: {
        ...variables.input,
        offset:
          entityType === ENTITIES_TYPES.TASK
            ? columns.map(({ tasks }) => tasks.length).reduce((a, b) => a + b, 0)
            : columns.length,
      },
    };
    fetchMore({
      variables: fetchMoreVariables,
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodTaskBoardTasks.length >= LIMIT);
        return {
          getPodTaskBoardTasks: [...prev.getPodTaskBoardTasks, ...fetchMoreResult.getPodTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setPodTaskHasMore, variables]);

  const fetchPerStatus = async (status, limit) => {
    const column = columns?.find((column) => column.status === status);
    const fetchMoreVariables = {
      ...variables,
      input: {
        ...variables.input,
        offset: column?.tasks?.length,
        statuses: [status],
        ...(limit ? { limit } : {}),
      },
    };

    fetchMore({
      variables: fetchMoreVariables,
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          getPodTaskBoardTasks: [...prev.getPodTaskBoardTasks, ...fetchMoreResult.getPodTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (entityType !== ENTITIES_TYPES.PROPOSAL && podId && !search && !userId && !calendarView) {
      const taskBoardStatuses =
        statuses?.length > 0
          ? statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES[entityType].includes(status))
          : //double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;

      const taskBoardStatusesIsNotEmpty = taskBoardStatuses?.length > 0;
      getPodTaskBoardTasks({
        variables: {
          input: {
            podId,
            statuses: taskBoardStatuses,
            limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
            offset: 0,
            labelId,
            date,
            types: [entityType],
            ...(privacyLevel === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        },
      });
      setPodTaskHasMore(true);
    }
  }, [getPodTaskBoardTasks, podId, statuses, setPodTaskHasMore, entityType, labelId, date, privacyLevel, calendarView]);
  return { fetchMore: getPodTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetPodTaskProposals = ({
  listView,
  section,
  setColumns,
  columns,
  podId,
  statuses,
  entityType,
  setIsLoading,
  setPodTaskHasMore,
  search,
  labelId,
  date,
  privacyLevel,
  calendarView,
}) => {
  const [getPodTaskProposals, { data, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newColumns = populateProposalColumns(data?.getPodTaskBoardProposals, ORG_POD_PROPOSAL_COLUMNS);
      setColumns(newColumns);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const getProposalsFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodTaskBoardProposals.length >= LIMIT);
        const getPodTaskBoardProposals = uniqBy(
          [...prev.getOrgTaskBoardProposals, ...fetchMoreResult.getOrgTaskBoardProposals],
          'id'
        );
        return {
          getPodTaskBoardProposals,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setPodTaskHasMore]);

  useEffect(() => {
    const proposalBoardStatuses =
      statuses?.length > 0
        ? statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
        : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED];
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search && podId && !calendarView)
      getPodTaskProposals({
        variables: {
          input: {
            podId,
            statuses: proposalBoardStatuses,
            offset: 0,
            labelId,
            limit: LIMIT,
          },
        },
      });
  }, [getPodTaskProposals, podId, statuses, entityType, labelId, calendarView]);
  return { fetchMore: getProposalsFetchMore };
};

const useGetPodTaskBoard = ({
  view,
  section,
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  entityType,
  setIsLoading,
  search,
  statuses,
  labelId,
  date,
  privacyLevel,
  userId,
  fromDate,
  toDate,
}) => {
  const listView = view === ViewType.List;
  const calendarView = view === ViewType.Calendar;
  const board = {
    tasks: useGetPodTaskBoardTasks({
      columns,
      setColumns,
      setPodTaskHasMore,
      podId,
      statuses,
      entityType,
      setIsLoading,
      search,
      labelId,
      date,
      privacyLevel,
      userId,
      calendarView,
    }),
    proposals: useGetPodTaskProposals({
      listView,
      section,
      setColumns,
      columns,
      podId,
      statuses,
      entityType,
      setIsLoading,
      setPodTaskHasMore,
      search,
      labelId,
      date,
      privacyLevel,
      calendarView,
    }),
    calendarTasks: useGetPodTaskBoardCalendar({
      setColumns,
      podId,
      userId,
      entityType,
      setIsLoading,
      search,
      statuses,
      privacyLevel,
      calendarView,
      fromDate,
      toDate,
    }),
  };
  const { fetchMore, fetchPerStatus }: any = entityType === ENTITIES_TYPES.PROPOSAL ? board.proposals : board.tasks;
  return { fetchMore, fetchPerStatus };
};

const BoardsPage = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { podId, search, userId, view = ViewType.Grid, entity } = router.query;
  const activeEntityFromQuery = (Array.isArray(entity) ? entity[0] : entity) || ENTITIES_TYPES.TASK;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [entityType, setEntityType] = useState(activeEntityFromQuery);
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const [searchString, setSearchString] = useState('');
  const [activeView, setActiveView] = useState(view);
  const [isLoading, setIsLoading] = useState(true);
  const [getUser, { data: getUserData }] = useLazyQuery(GET_USER);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(lastDay);

  const [filters, setFilters] = useState<TaskFilter>({
    statuses: [],
    labelId: null,
    date: null,
    privacyLevel: null,
  });
  const handleCalendarDatesChange = (date) => {
    setFromDate(date);
    setToDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  };

  const [podTaskHasMore, setPodTaskHasMore] = useState(true);
  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const pod = podData?.getPodById;
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const { statuses, labelId, date, privacyLevel } = filters;

  const { fetchMore, fetchPerStatus } = useGetPodTaskBoard({
    section,
    view: activeView,
    columns,
    setColumns,
    setPodTaskHasMore,
    podId,
    statuses,
    userId,
    entityType,
    setIsLoading,
    search,
    labelId,
    date,
    privacyLevel,
    fromDate,
    toDate,
  });

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

  const [searchPodTaskProposals] = useLazyQuery(SEARCH_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const boardColumns = [...columns];
      boardColumns[0].tasks = [...boardColumns[0].tasks, ...data?.searchProposalsForPodBoardView];
      setColumns(boardColumns);
      setIsLoading(false);
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

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

  const [getPodBoardTaskCount, { data: podTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD);

  const [getTasksRelatedToUser] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_POD, {
    onCompleted: (data) => {
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(data?.getTasksRelatedToUserInPod);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(data?.getTasksRelatedToUserInPod, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const searchPodTaskProposalsArgs = {
    variables: {
      input: {
        podId,
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: 1000,
        searchString: search,
        labelId,
      },
    },
  };

  const [searchPodTasks] = useLazyQuery(SEARCH_TASKS_FOR_POD_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForPodBoardView;
      setColumns(dedupeColumns(populateTaskColumns(tasks, ORG_POD_COLUMNS)));
      searchPodTaskProposals(searchPodTaskProposalsArgs);
      if (podTaskHasMore) {
        setPodTaskHasMore(tasks.length >= LIMIT);
      }
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (userId) {
      getUser({ variables: { userId } });
    }
  }, [userId]);

  useEffect(() => {
    if (podId) {
      getPod({ variables: { podId } });
    }
  }, []);

  useEffect(() => {
    if (podId) {
      if (search) {
        if (!firstTimeFetch) {
          const searchPodTasksArgs = {
            variables: {
              input: {
                podId,
                limit: 1000,
                offset: 0,
                labelId,
                date,

                // Needed to exclude proposals
                statuses: STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
                searchString: search,
                ...(privacyLevel === PRIVACY_LEVEL.public && {
                  onlyPublic: true,
                }),
              },
            },
          };

          searchPodTasks(searchPodTasksArgs);
          setFirstTimeFetch(true);
          setSearchString(search as string);
        }
      } else if (userId && entityType !== ENTITIES_TYPES.PROPOSAL) {
        const taskStatuses = statuses?.filter((status) => TASK_STATUSES.includes(status));

        getTasksRelatedToUser({
          variables: {
            podId,
            userId,
            limit: 1000,
            offset: 0,
            statuses: taskStatuses,
            labelId,
            types: [entityType],
            date,
            ...(privacyLevel === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        });
      } else {
        // fetch user task boards after getting orgId from username

        getPodBoardTaskCount({
          variables: {
            podId,
          },
        });
      }
    }
  }, [podId, getPodBoardTaskCount, getPod, labelId, date, privacyLevel, entityType]);

  function handleSearch(searchString: string) {
    const searchPodTaskProposalsArgs = {
      variables: {
        input: {
          podId,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString,
        },
      },
    };

    const searchPodTasksArgs = {
      variables: {
        input: {
          podId,
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
          searchString,
          ...(privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      },
    };

    const promises: any = [
      apollo.query({
        query: SEARCH_POD_USERS,
        variables: {
          podId,
          limit: LIMIT,
          offset: 0,
          queryString: searchString,
        },
      }),
      apollo.query({
        ...searchPodTaskProposalsArgs,
        query: SEARCH_POD_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchPodTasksArgs,
        query: SEARCH_TASKS_FOR_POD_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([users, proposals, tasks]: any) => ({
      users: users.data.searchPodUsers,
      proposals: proposals.data.searchProposalsForPodBoardView,
      tasks: tasks.data.searchTasksForPodBoardView,
    }));
  }

  const handleFilterChange: any = (filtersToApply = { statuses: [], labelId: null, date: null }) => {
    setFilters(filtersToApply);

    const { statuses, labelId } = filtersToApply;
    const taskStatuses = statuses?.filter((status) => TASK_STATUSES.includes(status));
    const searchProposals =
      statuses?.length !== taskStatuses?.length ||
      statuses === (STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT);
    const searchTasks = !(searchProposals && statuses?.length === 1);
    if (search) {
      const searchPodTaskProposalsArgs = {
        variables: {
          input: {
            podId,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: 1000,
            searchString: search,
          },
        },
      };

      const searchPodTasksArgs = {
        variables: {
          input: {
            podId,
            limit: 1000,
            offset: 0,
            // Needed to exclude proposals
            statuses: taskStatuses,
            labelId: labelId,
            searchString: search,
            ...(privacyLevel === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        },
      };

      if (searchTasks) {
        searchPodTasks(searchPodTasksArgs);
      } else {
        const newColumns = [...columns];
        newColumns.forEach((column: any) => {
          column.tasks = [];
        });

        setColumns(newColumns);
      }

      if (searchProposals) {
        searchPodTaskProposals(searchPodTaskProposalsArgs);
      }
    }
  };

  return (
    <PodBoardContext.Provider
      value={{
        setSection,
        statuses,
        columns,
        setColumns,
        orgId: pod?.orgId,
        pod,
        podId,
        taskCount: podTaskCountData?.getPerStatusTaskCountForPodBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        entityType,
        setEntityType: handleEntityTypeChange,
        user: getUserData?.getUser,
        deleteUserIdFilter,
        fetchPerStatus,
        activeView,
        setActiveView,
        onLoadMore: fetchMore,
        hasMore: podTaskHasMore,
      }}
    >
      {isMobile ? <MobileComingSoonModal /> : null}
      <Boards
        columns={columns}
        onLoadMore={fetchMore}
        hasMore={podTaskHasMore}
        onSearch={handleSearch}
        searchString={searchString}
        onFilterChange={handleFilterChange}
        onCalendarDateChange={handleCalendarDatesChange}
        setColumns={setColumns}
        loading={isLoading}
        entityType={entityType}
        userId={userId?.toString()}
        orgId={pod?.orgId}
        statuses={statuses}
        activeView={activeView}
      />
    </PodBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
