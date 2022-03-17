import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import Boards from '../../../components/Pod/boards';
import { GET_USER_PERMISSION_CONTEXT, SEARCH_POD_USERS } from '../../../graphql/queries';
import { GET_POD_BY_ID } from '../../../graphql/queries/pod';
import {
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_SUBMISSIONS,
  GET_POD_TASK_BOARD_TASKS,
  GET_TASKS_RELATED_TO_USER_IN_POD,
  SEARCH_POD_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_POD_BOARD_VIEW,
} from '../../../graphql/queries/taskBoard';
import apollo from '../../../services/apollo';
import { addToTaskColumns, COLUMNS, LIMIT, populateTaskColumns, SELECT_OPTIONS } from '../../../services/board';
import { TaskFilter } from '../../../types/task';
import { dedupeColumns } from '../../../utils';
import {
  DEFAULT_STATUS_ARR,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
} from '../../../utils/constants';
import { PodBoardContext } from '../../../utils/contexts';

const BoardsPage = () => {
  const [columns, setColumns] = useState(COLUMNS);
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const router = useRouter();
  const { boardType } = router.query;
  const { username, podId, search, userId } = router.query;
  const [searchString, setSearchString] = useState('');

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [podTaskHasMore, setPodTaskHasMore] = useState(true);
  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const pod = podData?.getPodById;
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const bindTasksToCols = (tasks) => {
    const newColumns = populateTaskColumns(tasks, columns);
    setColumns(dedupeColumns(newColumns));
    if (podTaskHasMore) {
      setPodTaskHasMore(tasks.length >= LIMIT);
    }
  };

  const bindProposalsToCols = (taskProposals) => {
    const newColumns = [...columns];
    newColumns[0].section.tasks = [];
    taskProposals?.forEach((taskProposal) => {
      newColumns[0].section.tasks.push(taskProposal);
    });
    setColumns(newColumns);
  };

  const [getPodTaskProposals] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => bindProposalsToCols(data?.getPodTaskBoardProposals),
    fetchPolicy: 'cache-and-network',
  });

  const [searchPodTaskProposals] = useLazyQuery(SEARCH_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForPodBoardView),
    fetchPolicy: 'cache-and-network',
  });

  const [getPodTaskSubmissions] = useLazyQuery(GET_POD_TASK_BOARD_SUBMISSIONS, {
    onCompleted: (data) => {
      const newColumns = [...columns];
      const taskSubmissions = data?.getPodTaskBoardSubmissions;
      newColumns[1].section.tasks = [];
      taskSubmissions?.forEach((taskSubmission) => {
        newColumns[1].section.tasks.push(taskSubmission);
      });
      setColumns(newColumns);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getPodBoardTaskCount, { data: podTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD);

  const [getPodTasks, { fetchMore, variables: getPodTasksVariables }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardTasks;
      const newColumns = populateTaskColumns(tasks, columns);
      setColumns(dedupeColumns(newColumns));
      if (podTaskHasMore) {
        setPodTaskHasMore(tasks.length >= LIMIT);
      }
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

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
        getPodTasks({
          variables: {
            input: {
              podId,
              statuses,
              offset: 0,
              limit: LIMIT,
              ...(boardType === PRIVACY_LEVEL.public && {
                onlyPublic: true,
              }),
            },
          },
        });
        getPodTaskProposals({
          variables: {
            input: {
              podId,
              statuses: [STATUS_OPEN],
              offset: 0,
              limit: LIMIT,
            },
          },
        });
        getPodTaskSubmissions({
          variables: {
            input: {
              podId,
              statuses: [STATUS_OPEN],
              offset: 0,
              limit: LIMIT,
            },
          },
        });
        getPodBoardTaskCount({
          variables: {
            podId,
          },
        });
      }
    }
  }, [podId, getPodTasks, getPodTaskSubmissions, getPodTaskProposals, getPodBoardTaskCount, getPod, boardType]);

  const handleLoadMore = useCallback(() => {
    if (podTaskHasMore) {
      fetchMore({
        variables: {
          input: {
            offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
            limit: LIMIT,
            podId,
            statuses,
          },
        },
      }).then((fetchMoreResult) => {
        const results = fetchMoreResult?.data?.getPodTaskBoardTasks;
        if (results && results?.length > 0) {
          const newColumns = addToTaskColumns(results, columns);
          setColumns(dedupeColumns(newColumns));
        } else {
          setPodTaskHasMore(false);
        }
      });
    }
  }, [podTaskHasMore, columns, fetchMore]);

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

  const handleFilterChange: any = ({ statuses = DEFAULT_STATUS_ARR }: TaskFilter) => {
    const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const searchTasks = !(searchProposals && statuses.length === 1);

    setStatuses(statuses);

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
    } else {
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
        getPodTasksVariables,
      }}
    >
      <Boards
        selectOptions={SELECT_OPTIONS}
        searchString={searchString}
        columns={columns}
        onLoadMore={handleLoadMore}
        hasMore={podTaskHasMore}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
    </PodBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
