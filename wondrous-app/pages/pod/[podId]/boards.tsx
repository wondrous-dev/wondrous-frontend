import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ViewType } from 'types/common';
import Boards from 'components/Common/Boards';
import Wrapper from 'components/Pod/wrapper';
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
import { COLUMNS, FILTER_STATUSES, LIMIT, populateTaskColumns } from 'services/board';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import {
  DEFAULT_STATUS_ARR,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from 'utils/constants';
import { PodBoardContext } from 'utils/contexts';

const useGetPodTaskBoardTasks = ({ columns, setColumns, setPodTaskHasMore, podId, statuses, boardType }) => {
  const [getPodTaskBoardTasks, { variables, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardTasks;
      const newColumns = populateTaskColumns(tasks, columns);
      setColumns(dedupeColumns(newColumns));
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
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
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
          ...(boardType === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      },
    });
    setPodTaskHasMore(true);
  }, [getPodTaskBoardTasks, podId, statuses, boardType, setPodTaskHasMore]);
  return { getPodTaskBoardTasksFetchMore };
};

const useGetPodTaskProposals = ({ listView, section, setColumns, columns, podId, statuses }) => {
  const [getPodTaskProposals, { data }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getPodTaskBoardProposals,
        section: TASK_STATUS_REQUESTED,
      });
      setColumns(newColumns);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (section === TASK_STATUS_REQUESTED || listView || data)
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
  }, [getPodTaskProposals, podId, statuses, section, listView, data]);
};

const useGetPodTaskSubmissions = ({ listView, section, setColumns, columns, podId, statuses }) => {
  const [getPodTaskSubmissions, { data }] = useLazyQuery(GET_POD_TASK_BOARD_SUBMISSIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getPodTaskBoardSubmissions,
        section: TASK_STATUS_IN_REVIEW,
      });
      setColumns(newColumns);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (section === TASK_STATUS_IN_REVIEW || listView || data)
      getPodTaskSubmissions({
        variables: {
          input: {
            podId,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: statuses.length === 0 || statuses.includes(TASK_STATUS_IN_REVIEW) ? LIMIT : 0,
          },
        },
      });
  }, [getPodTaskSubmissions, podId, statuses, section, listView, data]);
};

const useGetPodTaskBoard = ({ view, section, columns, setColumns, setPodTaskHasMore, podId, statuses, boardType }) => {
  const listView = view === ViewType.List;
  useGetPodTaskSubmissions({ listView, section, setColumns, columns, podId, statuses });
  useGetPodTaskProposals({ listView, section, setColumns, columns, podId, statuses });
  const { getPodTaskBoardTasksFetchMore } = useGetPodTaskBoardTasks({
    columns,
    setColumns,
    setPodTaskHasMore,
    podId,
    statuses,
    boardType,
  });
  return { getPodTaskBoardTasksFetchMore };
};

const BoardsPage = () => {
  const router = useRouter();
  const [columns, setColumns] = useState(COLUMNS);
  const [statuses, setStatuses] = useRouterQuery({ router, query: 'statuses' });
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const { username, podId, search, userId, view, boardType } = router.query;
  const [searchString, setSearchString] = useState('');

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [podTaskHasMore, setPodTaskHasMore] = useState(true);
  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const pod = podData?.getPodById;
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const { getPodTaskBoardTasksFetchMore } = useGetPodTaskBoard({
    section,
    view,
    columns,
    setColumns,
    setPodTaskHasMore,
    podId,
    statuses,
    boardType,
  });

  const bindTasksToCols = (tasks) => {
    const newColumns = populateTaskColumns(tasks, columns);
    setColumns(dedupeColumns(newColumns));
    if (podTaskHasMore) {
      setPodTaskHasMore(tasks.length >= LIMIT);
    }
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
        newColumns.forEach((column) => {
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
      }}
    >
      <Wrapper>
        <Boards
          columns={columns}
          onLoadMore={getPodTaskBoardTasksFetchMore}
          hasMore={podTaskHasMore}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          statuses={statuses}
          filterSchema={[FILTER_STATUSES]}
          setColumns={setColumns}
          userId={userId?.toString()}
        />
      </Wrapper>
    </PodBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
