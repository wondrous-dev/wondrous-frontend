import React, { useEffect, useMemo, useReducer, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import { useLazyQuery, useQuery } from '@apollo/client';

import { withAuth } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, SEARCH_ORG_USERS } from 'graphql/queries/org';
import { useGetOrgTaskBoard } from 'utils/board/orgGetTasksHooks';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
} from 'graphql/queries/taskBoard';
import { GET_USER } from 'graphql/queries/user';
import { useRouter } from 'next/router';
import apollo from 'services/apollo';
import { LIMIT, ORG_POD_COLUMNS, DEFAULT_ENTITY_STATUS_FILTER } from 'services/board';
import { ViewType } from 'types/common';
import { TaskFilter } from 'types/task';
import { sectionOpeningReducer } from 'utils/board';
import { ENTITIES_TYPES, PRIVACY_LEVEL, STATUS_OPEN, STATUSES_ON_ENTITY_TYPES } from 'utils/constants';
import { OrgBoardContext } from 'utils/contexts';
import { usePageDataContext } from 'utils/hooks';
import Boards from 'components/organization/boards/boards';

function BoardsPage() {
  const router = useRouter();
  const { setPageData } = usePageDataContext();
  const { username, orgId, search, view = ViewType.Grid, userId, entity } = router.query;
  const activeEntityFromQuery = (Array.isArray(entity) ? entity[0] : entity) || ENTITIES_TYPES.TASK;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: DEFAULT_ENTITY_STATUS_FILTER[activeEntityFromQuery],
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

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(true);

  const { fetchMore, fetchPerStatus } = useGetOrgTaskBoard({
    view: activeView,
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

    router.push({ query }, undefined, { shallow: true });
  };

  const [getOrgBoardTaskCount, { data: orgTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD);

  const searchOrgTaskProposalsArgs = {
    variables: {
      input: {
        podIds: filters?.podIds,
        priorities: filters?.priorities,
        orgId: orgId || orgData?.id,
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: 1000,
        searchString: search,
      },
    },
  };

  useEffect(() => {
    if (orgData) {
      setPageData({ orgData, entityType });
    }
  }, [orgData, entityType]);

  useEffect(() => () => setPageData({}), []);

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

  // We need this hook when you switch between orgs
  useEffect(() => {
    if (orgData && orgData.username !== username) {
      setFirstTimeFetch(true);
      setIsLoading(true);
      // Get orgId from username
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username]);

  useEffect(() => {
    if (orgId || orgData?.id) {
      const id = orgId || orgData?.id;

      if (search) {
        if (!firstTimeFetch) {
          const id = orgId || orgData?.id;
          getOrgBoardTaskCount({
            variables: {
              orgId: id,
            },
          });
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
  }, [orgData, orgId, getOrgBoardTaskCount, search, filters]);

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
        query: GET_ORG_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchOrgTasksArgs,
        query: GET_ORG_TASK_BOARD_TASKS,
      }),
    ];

    return Promise.all(promises).then(([users, proposals, tasks]: any) => ({
      users: users.data.searchOrgUsers,
      proposals: proposals.data.getOrgTaskBoardProposals,
      tasks: tasks.data.getOrgTaskBoardTasks,
    }));
  }

  const handleFilterChange: any = (
    filtersToApply = {
      statuses: [],
      podIds: [],
      labelId: null,
      date: null,
      category: null,
      fromDate: null,
      toDate: null,
    }
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

  if (!process.env.NEXT_PUBLIC_PRODUCTION) {
    console.log(
      'user permissions context',
      userPermissionsContext?.getUserPermissionContext
        ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
        : null
    );
  }

  const hasActiveFilters = useMemo(
    () => !!Object.keys(filters).filter((filterKey) => !!filters[filterKey]?.length)?.length,
    [filters]
  );

  return (
    <OrgBoardContext.Provider
      value={{
        columns,
        setColumns,
        filters,
        handleFilterChange,
        hasActiveFilters,
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
