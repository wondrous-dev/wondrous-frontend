import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { ViewType } from 'types/common';
import Boards from 'components/Pod/boards';
import { sectionOpeningReducer } from 'utils/board';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import { GET_USER_PERMISSION_CONTEXT, SEARCH_POD_USERS } from 'graphql/queries';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import { GET_USER } from 'graphql/queries/user';

import {
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  SEARCH_POD_TASK_BOARD_PROPOSALS,
} from 'graphql/queries/taskBoard';
import apollo from 'services/apollo';
import { ORG_POD_COLUMNS, LIMIT, DEFAULT_ENTITY_STATUS_FILTER } from 'services/board';
import { TaskFilter } from 'types/task';
import {
  PRIVACY_LEVEL,
  STATUS_OPEN,
  ENTITIES_TYPES,
  STATUSES_ON_ENTITY_TYPES,
  ONLY_GRANTS_ENABLED_ORGS,
} from 'utils/constants';
import { PodBoardContext } from 'utils/contexts';
import { useGetPodTaskBoard } from 'utils/board/podGetTasksHooks';
import EntitySidebar from 'components/Common/SidebarEntity';
import { usePageDataContext } from 'utils/hooks';

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
    if (
      ONLY_GRANTS_ENABLED_ORGS.includes(podData?.getPodById?.orgId) &&
      podId &&
      entityType !== ENTITIES_TYPES.PROPOSAL
    ) {
      router.push(`/pod/${podId}/grants`, undefined, {
        shallow: true,
      });
    }
  }, [podData?.getPodById?.orgId, podId, entityType]);
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
        query: GET_POD_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchPodTasksArgs,
        query: GET_POD_TASK_BOARD_TASKS,
      }),
    ];

    return Promise.all(promises).then(([users, proposals, tasks]: any) => ({
      users: users.data.searchPodUsers,
      proposals: proposals.data.getPodTaskBoardProposals,
      tasks: tasks.data.getPodTaskBoardTasks,
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
