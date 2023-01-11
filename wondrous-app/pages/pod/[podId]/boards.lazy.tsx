import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { ViewType } from 'types/common';
import Boards from 'components/Pod/boards';
import { extendFiltersByView, sectionOpeningReducer } from 'utils/board';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import { GET_USER_PERMISSION_CONTEXT, SEARCH_POD_USERS } from 'graphql/queries';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import { GET_USER } from 'graphql/queries/user';

import {
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
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
  DEFAULT_ENTITY_STATUS_FILTER,
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
import EntitySidebar from 'components/Common/SidebarEntity';
import { usePageDataContext } from 'utils/hooks';

const useGetPodTaskBoardTasks = ({
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  userId,
  entityType,
  setIsLoading,
  search,
  filters,
  view,
}) => {
  const [getPodTaskBoardTasks, { variables, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getPodTaskBoardTasks }) => {
      if (userId) return;
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(getPodTaskBoardTasks);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(getPodTaskBoardTasks, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getPodTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables?.input,
          offset:
            entityType === ENTITIES_TYPES.TASK ? Math.max(...columns.map(({ tasks }) => tasks.length)) : columns.length,
        },
      },
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

  useEffect(() => {
    if (!userId && entityType !== ENTITIES_TYPES.PROPOSAL && podId && !search && podId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES[entityType].includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;

      const taskBoardStatusesIsNotEmpty = taskBoardStatuses?.length > 0;
      getPodTaskBoardTasks({
        variables: {
          input: {
            podId,
            statuses: taskBoardStatuses,
            priorities: filters?.priorities,
            limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
            offset: 0,
            labelId: filters?.labelId,
            date: filters?.date,
            category: filters?.category,
            types: [entityType],
            ...extendFiltersByView(view, filters),
            ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        },
      });
      setPodTaskHasMore(true);
    }
  }, [getPodTaskBoardTasks, podId, filters, setPodTaskHasMore, entityType, userId]);

  const fetchPerStatus = async (status, limit) => {
    const columnIdx = columns?.findIndex((column) => column.status === status);
    fetchMore({
      variables: {
        input: {
          ...variables?.input,
          podId,
          offset: columns[columnIdx]?.tasks?.length,
          statuses: [status],
          ...(limit ? { limit } : {}),
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodTaskBoardTasks.length >= LIMIT);
        return {
          getPodTaskBoardTasks: [...prev.getPodTaskBoardTasks, ...fetchMoreResult.getPodTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchMore: getPodTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetTaskRelatedToUser = ({
  userId,
  podId,
  setColumns,
  columns,
  setPodTaskHasMore,
  entityType,
  setIsLoading,
  search,
  filters,
}) => {
  const [getTasksRelatedToUserInPod, { fetchMore }] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_POD, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getTasksRelatedToUserInPod }) => {
      if (!userId) return;
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(getTasksRelatedToUserInPod);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(getTasksRelatedToUserInPod, ORG_POD_COLUMNS);
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
        setPodTaskHasMore(fetchMoreResult?.getTasksRelatedToUserInPod.length >= LIMIT);
        const getTasksRelatedToUserInPod = [
          ...prev.getTasksRelatedToUserInPod,
          ...fetchMoreResult.getTasksRelatedToUserInPod,
        ];
        return {
          getTasksRelatedToUserInPod,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setPodTaskHasMore]);

  useEffect(() => {
    if (userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search && podId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getTasksRelatedToUserInPod({
        variables: {
          priorities: filters?.priorities,
          userId,
          podId,
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
      setPodTaskHasMore(true);
    }
  }, [podId, userId, entityType, filters]);
  return { fetchMore: getTasksRelatedToUserFetchMore };
};

const useGetPodTaskProposals = ({
  listView,
  section,
  setColumns,
  columns,
  podId,
  entityType,
  setIsLoading,
  setPodTaskHasMore,
  search,
  filters,
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
          [...prev.getPodTaskBoardProposals, ...fetchMoreResult.getPodTaskBoardProposals],
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
      filters?.statuses?.length > 0
        ? filters?.statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
        : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED];
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search && podId) {
      getPodTaskProposals({
        variables: {
          input: {
            podId,
            priorities: filters?.priorities,
            statuses: proposalBoardStatuses,
            offset: 0,
            labelId: filters?.labelId,
            limit: LIMIT,
          },
        },
      });
    }
  }, [getPodTaskProposals, podId, setPodTaskHasMore, entityType, filters]);
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
  userId,
  filters,
}) => {
  const listView = view === ViewType.List;
  const board = {
    [userId]: useGetTaskRelatedToUser({
      columns,
      setColumns,
      setPodTaskHasMore,
      podId,
      entityType,
      setIsLoading,
      search,
      userId,
      filters,
    }),
    withoutUserId: useGetPodTaskBoardTasks({
      columns,
      setColumns,
      setPodTaskHasMore,
      podId,
      entityType,
      setIsLoading,
      search,
      userId,
      filters,
      view,
    }),
    proposals: useGetPodTaskProposals({
      listView,
      section,
      setColumns,
      columns,
      podId,
      entityType,
      setIsLoading,
      setPodTaskHasMore,
      search,
      filters,
    }),
  };
  const { fetchMore, fetchPerStatus }: any =
    entityType === ENTITIES_TYPES.PROPOSAL ? board.proposals : userId ? board[userId] : board.withoutUserId;
  return { fetchMore, fetchPerStatus };
};

type Props = {
  meta: {
    title: string;
    img: string;
    description: string;
  };
};

function BoardsPage({ meta }: Props) {
  const router = useRouter();
  const { setPageData } = usePageDataContext();
  const { podId, search, userId, view = ViewType.Grid, entity } = router.query;
  const activeEntityFromQuery = (Array.isArray(entity) ? entity[0] : entity) || ENTITIES_TYPES.TASK;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [filters, setFilters] = useState<TaskFilter>({
    statuses: DEFAULT_ENTITY_STATUS_FILTER[activeEntityFromQuery],
    priorities: [],
    labelId: null,
    date: null,
    privacyLevel: null,
    // for the calendar view
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
  });
  const [searchString, setSearchString] = useState('');
  const [entityType, setEntityType] = useState(activeEntityFromQuery);
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const [activeView, setActiveView] = useState(view);
  const [isLoading, setIsLoading] = useState(true);
  const [getUser, { data: getUserData }] = useLazyQuery(GET_USER);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [podTaskHasMore, setPodTaskHasMore] = useState(true);
  const [getPod, { data: podData, loading: isPodDataLoading }] = useLazyQuery(GET_POD_BY_ID, {
    onCompleted: ({ getPodById }) => {
      setPageData({ pod: getPodById, entityType });
    },
  });
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
    filters,
    userId,
    entityType,
    setIsLoading,
    search,
  });

  const handleEntityTypeChange = (type) => {
    if (type !== entityType) {
      setIsLoading(true);
    }

    const query: any = { ...router.query, entity: type };

    delete query.cause;
    setEntityType(type);
    setFilters({
      statuses: DEFAULT_ENTITY_STATUS_FILTER[type],
      fromDate: startOfMonth(new Date()),
      toDate: endOfMonth(new Date()),
    });
    if (type === ENTITIES_TYPES.PROPOSAL && activeView !== ViewType.Grid) {
      setActiveView(ViewType.Grid);
      query.view = ViewType.Grid;
    }
    setPageData({ pod: podData?.getPodById, entityType: type });
    router.push({ query }, undefined, { shallow: true, scroll: false });
  };

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

  useEffect(() => {
    if (userId) {
      getUser({ variables: { userId } });
    }
  }, [userId]);

  useEffect(() => {
    // Load only once or when you switch POD
    if (!isPodDataLoading && ((podId && !podData) || (podData && podData.getPodById.id !== podId))) {
      getPod({ variables: { podId } });
    }
  }, [podId, podData, isPodDataLoading]);

  useEffect(() => {
    if (podId) {
      if (search) {
        if (!firstTimeFetch) {
          setFirstTimeFetch(true);
          setSearchString(search as string);
        }
      } else {
        getPodBoardTaskCount({
          variables: {
            podId,
          },
        });
      }
    }
  }, [podId, getPodBoardTaskCount, getPod, labelId, date, privacyLevel, entityType, search]);

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
          searchString,
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

  const handleFilterChange: any = (
    filtersToApply = { statuses: [], labelId: null, date: null, fromDate: null, toDate: null }
  ) => {
    setFilters({
      ...filtersToApply,
      fromDate: filtersToApply.fromDate ?? filters.fromDate,
      toDate: filtersToApply.toDate ?? filters.toDate,
    });
  };

  const handleActiveViewChange = (newView: ViewType) => {
    setActiveView(newView);

    if ([activeView, newView].includes(ViewType.Calendar)) {
      setFilters({ ...filters });
    }
  };

  const hasActiveFilters = useMemo(
    () => !!Object.keys(filters).filter((filterKey) => !!filters[filterKey]?.length)?.length,
    [filters]
  );

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
        setActiveView: handleActiveViewChange,
        onLoadMore: fetchMore,
        hasMore: podTaskHasMore,
        hasActiveFilters,
        filters,
        handleFilterChange,
      }}
    >
      <EntitySidebar>
        <Boards
          columns={columns}
          onLoadMore={fetchMore}
          hasMore={podTaskHasMore}
          onSearch={handleSearch}
          searchString={searchString}
          onFilterChange={handleFilterChange}
          setColumns={setColumns}
          loading={isLoading}
          entityType={entityType}
          userId={userId?.toString()}
          orgId={pod?.orgId}
          statuses={statuses}
          activeView={activeView}
        />
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
}

export default withAuth(BoardsPage);
