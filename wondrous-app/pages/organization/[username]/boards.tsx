import { useLazyQuery, useQuery } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import Boards from 'components/organization/boards/boards';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, GET_ORG_PODS, SEARCH_ORG_USERS } from 'graphql/queries/org';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_TASKS_RELATED_TO_USER_IN_ORG,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
} from 'graphql/queries/taskBoard';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import apollo from 'services/apollo';
import {
  LIMIT,
  populateTaskColumns,
  populateProposalColumns,
  ORG_POD_COLUMNS,
  ORG_POD_PROPOSAL_COLUMNS,
} from 'services/board';
import { ViewType } from 'types/common';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import { bindSectionToColumns, sectionOpeningReducer } from 'utils/board';
import {
  STATUSES_ON_ENTITY_TYPES,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  ENTITIES_TYPES,
  STATUS_APPROVED,
  STATUS_CHANGE_REQUESTED,
  PROPOSAL_STATUS_LIST,
} from 'utils/constants';
import { OrgBoardContext } from 'utils/contexts';
import { useRouterQuery } from 'utils/hooks';
import { insertUrlParam } from 'utils';

const useGetOrgTaskBoardTasks = ({
  columns,
  setColumns,
  setOrgTaskHasMore,
  orgId,
  boardType,
  userId,
  entityType,
  setIsLoading,
  search,
  filters,
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
    if (!userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : //double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getOrgTaskBoardTasks({
        variables: {
          orgId,
          podIds: filters?.podIds,
          offset: 0,
          onlyPublic: filters?.onlyPublic === PRIVACY_LEVEL.public,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          labelId: filters?.labelId,
          date: filters?.date,
          types: [entityType],
          ...(boardType === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [boardType, getOrgTaskBoardTasks, orgId, filters, setOrgTaskHasMore, userId, entityType]);
  return { fetchMore: getOrgTaskBoardTasksFetchMore };
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
    },
  });

  const getTasksRelatedToUserFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset:
          entityType === ENTITIES_TYPES.TASK ? Math.max(...columns.map(({ tasks }) => tasks.length)) : columns.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getTasksRelatedToUserInOrg.length >= LIMIT);
        const getTasksRelatedToUserInOrg = _.uniqBy(
          [...prev.getTasksRelatedToUserInOrg, ...fetchMoreResult.getTasksRelatedToUserInOrg],
          'id'
        );
        return {
          getTasksRelatedToUserInOrg,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (userId && entityType !== ENTITIES_TYPES.PROPOSAL && !search) {
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
          types: [entityType],
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [getTasksRelatedToUserInOrg, orgId, userId, setOrgTaskHasMore, entityType, filters]);
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
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search) {
      const proposalBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
          : [STATUS_OPEN, STATUS_CHANGE_REQUESTED, STATUS_APPROVED];
      getOrgTaskProposals({
        variables: {
          podIds: filters?.podIds,
          orgId,
          statuses: proposalBoardStatuses,
          offset: 0,
          labelId: filters?.labelId,
          limit: filters?.statuses?.length === 0 || !filters?.statuses ? LIMIT : 0,
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
  boardType,
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
      boardType,
      orgId,

      userId,
      entityType,
      setIsLoading,
      search,
      filters,
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
  const { fetchMore } =
    entityType === ENTITIES_TYPES.PROPOSAL ? board.proposals : userId ? board[userId] : board.withoutUserId;

  return { fetchMore };
};

const BoardsPage = () => {
  const router = useRouter();
  const { username, orgId, search, userId, boardType, view = ViewType.Grid, entity } = router.query;
  const activeEntityFromQuery = (Array.isArray(entity) ? entity[0] : entity) || ENTITIES_TYPES.TASK;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    labelId: null,
    date: null,
    onlyPublic: null,
  });
  const [orgData, setOrgData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [entityType, setEntityType] = useState(activeEntityFromQuery);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState(view);
  const [section, setSection] = useReducer(sectionOpeningReducer, '');

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(true);

  const { fetchMore } = useGetOrgTaskBoard({
    view: activeView,
    section,
    columns,
    setColumns,
    setOrgTaskHasMore,
    boardType,
    orgId: orgId ?? orgData?.id,
    userId,
    entityType,
    setIsLoading,
    search,
    filters,
  });

  const handleEntityTypeChange = (type) => {
    if (type !== entityType) {
      setIsLoading(true);
    }
    insertUrlParam('entity', type);
    setEntityType(type);
  };

  const [searchOrgTaskProposals] = useLazyQuery(SEARCH_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const boardColumns = [...columns];
      boardColumns[0].tasks = [...boardColumns[0].tasks, ...data?.searchProposalsForOrgBoardView];
      setColumns(boardColumns);
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
      orgId: orgId || orgData?.id,
      statuses: [STATUS_OPEN],
      offset: 0,
      limit: 100,
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
              limit: 100,
              offset: 0,
              // Needed to exclude proposals
              statuses: STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
              searchString: search,
              ...(boardType === PRIVACY_LEVEL.public && {
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
  }, [orgData, orgId, getOrgBoardTaskCount, boardType]);

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
        ...(boardType === PRIVACY_LEVEL.public && {
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
          limit: 100,
          labelId: filtersToApply?.labelId,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses,
          search,
          ...(boardType === PRIVACY_LEVEL.public && {
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
      }}
    >
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
    </OrgBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
