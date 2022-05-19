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
import {
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_SUBMISSIONS,
  GET_POD_TASK_BOARD_TASKS,
  GET_TASKS_RELATED_TO_USER_IN_POD,
  SEARCH_POD_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_POD_BOARD_VIEW,
} from 'graphql/queries/taskBoard';
import apollo from 'services/apollo';
import { ORG_POD_COLUMNS, FILTER_STATUSES, LIMIT, populateTaskColumns } from 'services/board';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import {
  DEFAULT_STATUS_ARR,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  ENTITIES_TYPES,
} from 'utils/constants';
import { PodBoardContext } from 'utils/contexts';
import _ from 'lodash';

const useGetPodTaskBoardTasks = ({
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  statuses,
  boardType,
  entityType,
  setIsLoading,
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
          entityType === ENTITIES_TYPES.TASK ? Math.max(...columns.map(({ tasks }) => tasks.length)) : columns.length,
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
  useEffect(() => {
    if (entityType !== ENTITIES_TYPES.PROPOSAL && podId) {
      const taskBoardStatuses =
        statuses.length > 0 ? statuses?.filter((status) => DEFAULT_STATUS_ARR.includes(status)) : DEFAULT_STATUS_ARR;
      const taskBoardStatusesIsNotEmpty = taskBoardStatuses.length > 0;
      getPodTaskBoardTasks({
        variables: {
          input: {
            podId,
            statuses: taskBoardStatuses,
            limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
            offset: 0,
            types: [entityType],
            ...(boardType === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        },
      });
      setPodTaskHasMore(true);
    }
  }, [getPodTaskBoardTasks, podId, statuses, boardType, setPodTaskHasMore, entityType]);
  return { fetchMore: getPodTaskBoardTasksFetchMore };
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
}) => {
  const [getPodTaskProposals, { data, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getPodTaskBoardProposals,
        section: TASK_STATUS_REQUESTED,
      });
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
        const getPodTaskBoardProposals = _.uniqBy(
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
    if (entityType === ENTITIES_TYPES.PROPOSAL)
      getPodTaskProposals({
        variables: {
          input: {
            podId,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: statuses.length === 0 || statuses.includes(TASK_STATUS_REQUESTED) ? LIMIT : 0,
          },
        },
      });
  }, [getPodTaskProposals, podId, statuses, section, listView, data, entityType]);
  return { fetchMore: getProposalsFetchMore };
};

const useGetPodTaskBoard = ({
  view,
  section,
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  statuses,
  boardType,
  entityType,
  setIsLoading,
}) => {
  const listView = view === ViewType.List;
  const board = {
    tasks: useGetPodTaskBoardTasks({
      columns,
      setColumns,
      setPodTaskHasMore,
      podId,
      statuses,
      boardType,
      entityType,
      setIsLoading,
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
    }),
  };
  const { fetchMore } = entityType === ENTITIES_TYPES.PROPOSAL ? board.proposals : board.tasks;
  return { fetchMore };
};

const BoardsPage = () => {
  const router = useRouter();
  const { username, podId, search, userId, view = ViewType.Grid, boardType } = router.query;
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  const [entityType, setEntityType] = useState(ENTITIES_TYPES.TASK);
  const [statuses, setStatuses] = useRouterQuery({ router, query: 'statuses' });
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const [searchString, setSearchString] = useState('');
  const [activeView, setActiveView] = useState(view);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [podTaskHasMore, setPodTaskHasMore] = useState(true);
  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const pod = podData?.getPodById;
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const { fetchMore } = useGetPodTaskBoard({
    section,
    view: activeView,
    columns,
    setColumns,
    setPodTaskHasMore,
    podId,
    statuses,
    boardType,
    entityType,
    setIsLoading,
  });

  const bindTasksToCols = (tasks) => {
    const newColumns = populateTaskColumns(tasks, columns);
    setColumns(dedupeColumns(newColumns));
    if (podTaskHasMore) {
      setPodTaskHasMore(tasks.length >= LIMIT);
    }
  };

  const handleEntityTypeChange = (type) => {
    setIsLoading(true);
    setEntityType(type);
  };

  const [searchPodTaskProposals] = useLazyQuery(SEARCH_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.searchProposalsForPodBoardView,
        section: TASK_STATUS_REQUESTED,
      });
      setColumns(newColumns);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getPodBoardTaskCount, { data: podTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD);

  const [getTasksRelatedToUser] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_POD, {
    onCompleted: (data) => {
      bindTasksToCols(data?.getTasksRelatedToUserInPod);
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [searchPodTasks] = useLazyQuery(SEARCH_TASKS_FOR_POD_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForPodBoardView;
      const newColumns = populateTaskColumns(tasks, columns);
      newColumns[0].section.tasks = [];
      newColumns[1].section.tasks = [];
      newColumns[2].section.tasks = [];

      tasks.forEach((task) => {
        if (task.status === TASK_STATUS_IN_REVIEW) {
          newColumns[1].section.tasks.push(task);
        }
      });

      if (statuses.length) {
        newColumns.forEach((column) => {
          if (!statuses.includes(column.section.filter.taskType)) {
            column.section.tasks = [];
          }
        });
      }

      setColumns(dedupeColumns(newColumns));
      if (podTaskHasMore) {
        setPodTaskHasMore(tasks.length >= LIMIT);
      }
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (podId) {
      getPod({
        variables: {
          podId,
        },
      });
      if (search) {
        if (!firstTimeFetch) {
          const searchPodTaskProposalsArgs = {
            variables: {
              input: {
                podId,
                statuses: [STATUS_OPEN],
                offset: 0,
                limit: 100,
                searchString: search,
              },
            },
          };

          const searchPodTasksArgs = {
            variables: {
              input: {
                podId,
                limit: 100,
                offset: 0,
                // Needed to exclude proposals
                statuses: DEFAULT_STATUS_ARR,
                searchString: search,
              },
            },
          };

          searchPodTasks(searchPodTasksArgs);
          searchPodTaskProposals(searchPodTaskProposalsArgs);
          setFirstTimeFetch(true);
          setSearchString(search as string);
        }
      } else if (userId) {
        const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));

        getTasksRelatedToUser({
          variables: {
            podId,
            userId,
            limit: 1000,
            offset: 0,
            statuses: taskStatuses,
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
  }, [podId, getPodBoardTaskCount, getPod, boardType]);

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
          statuses: DEFAULT_STATUS_ARR,
          searchString,
          ...(boardType === PRIVACY_LEVEL.public && {
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

  const handleFilterChange: any = ({ statuses = [] }: TaskFilter) => {
    setStatuses(statuses);

    const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const searchTasks = !(searchProposals && statuses.length === 1);
    if (userId) {
      getTasksRelatedToUser({
        variables: {
          podId,
          userId,
          statuses: taskStatuses,
          limit: 1000,
          offset: 0,
        },
      });
    }
    if (search) {
      const searchPodTaskProposalsArgs = {
        variables: {
          input: {
            podId,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: 100,
            searchString: search,
          },
        },
      };

      const searchPodTasksArgs = {
        variables: {
          input: {
            podId,
            limit: 100,
            offset: 0,
            // Needed to exclude proposals
            statuses: taskStatuses,
            searchString: search,
            ...(boardType === PRIVACY_LEVEL.public && {
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
          column.section.tasks = [];
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
        setStatuses,
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
      }}
    >
      <Boards
        columns={columns}
        onLoadMore={fetchMore}
        hasMore={podTaskHasMore}
        onSearch={handleSearch}
        searchString={searchString}
        onFilterChange={handleFilterChange}
        statuses={statuses}
        setColumns={setColumns}
        loading={isLoading}
        entityType={entityType}
        userId={userId?.toString()}
        activeView={activeView}
      />
    </PodBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
