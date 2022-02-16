import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import {
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_SUBMISSIONS,
  GET_POD_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  SEARCH_TASKS_FOR_POD_BOARD_VIEW,
  GET_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW, SEARCH_POD_TASK_BOARD_PROPOSALS,
} from '../../../graphql/queries/taskBoard';
import Boards from '../../../components/Pod/boards';
import { InReview, Requested, Archived } from '../../../components/Icons/sections';
import {
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_ARCHIVED,
  DEFAULT_STATUS_ARR,
  STATUS_OPEN,
  TASK_STATUSES,
} from '../../../utils/constants';

import { PodBoardContext } from '../../../utils/contexts';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { GET_POD_BY_ID } from '../../../graphql/queries/pod';
import { addToTaskColumns, populateTaskColumns } from '../../organization/[username]/boards';
import { dedupeColumns, delQuery } from '../../../utils';
import * as Constants from '../../../utils/constants';
import apollo from '../../../services/apollo';
import { TaskFilter } from '../../../types/task';

const TO_DO = {
  status: TASK_STATUS_TODO,
  tasks: [],
  section: {
    title: 'Proposals',
    icon: Requested,
    id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
    filter: {
      taskType: TASK_STATUS_REQUESTED,
    },
    expandable: true,
    action: {
      text: 'Proposal',
    },
    tasks: [],
  },
};

const IN_PROGRESS = {
  status: TASK_STATUS_IN_PROGRESS,
  tasks: [],
  section: {
    title: 'In Review',
    icon: InReview,
    id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
    filter: {
      taskType: TASK_STATUS_IN_REVIEW,
    },
    expandable: true,
    action: {
      text: 'Review',
    },
    tasks: [],
  },
};

const DONE = {
  status: TASK_STATUS_DONE,
  tasks: [],
  section: {
    title: 'Archived',
    icon: Archived,
    id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
    filter: {
      taskType: TASK_STATUS_ARCHIVED,
    },
    expandable: true,
    action: {
      text: 'Restore',
    },
    tasks: [],
  },
};

const COLUMNS = [TO_DO, IN_PROGRESS, DONE];

const SELECT_OPTIONS = [
  '#copywriting (23)',
  '#growth (23)',
  '#design (23)',
  '#community (11)',
  '#sales (23)',
  '#tiktok (13)',
  '#analytics (23)',
];

const LIMIT = 10;

const BoardsPage = () => {
  const [columns, setColumns] = useState(COLUMNS);
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const router = useRouter();
  const { username, podId, search } = router.query;
  const [searchString, setSearchString] = useState('');

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [podTaskHasMore, setPodTaskHasMore] = useState(false);
  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const pod = podData?.getPodById;
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

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
      setPodTaskHasMore(tasks.length >= LIMIT);
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
      setPodTaskHasMore(tasks.length >= LIMIT);
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
          setSearchString(search as string);
          setFirstTimeFetch(true);
        }
      } else {
        // fetch user task boards after getting orgId from username
        getPodTasks({
          variables: {
            input: {
              podId,
              statuses,
              offset: 0,
              limit: LIMIT,
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
  }, [podId, getPodTasks, statuses, getPodTaskSubmissions, getPodTaskProposals, getPodBoardTaskCount, getPod]);

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

  function searchTasks(searchString: string, returnResult = false) {
    const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const searchTasks = !(searchProposals && statuses.length === 1);

    const getPodTaskProposalsArgs = {
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
          limit: 1000,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses.length ? taskStatuses : DEFAULT_STATUS_ARR,
          searchString,
        },
      },
    };

    if (returnResult) {
      const promises: any = [
        searchProposals
          ? apollo.query({
              ...getPodTaskProposalsArgs,
              query: SEARCH_POD_TASK_BOARD_PROPOSALS,
            })
          : { data: { searchPodTaskProposals: [] } },

        searchTasks
          ? apollo.query({
              ...searchPodTasksArgs,
              query: SEARCH_TASKS_FOR_POD_BOARD_VIEW,
            })
          : { data: { searchTasksForPodBoardView: [] } },
      ];

      return Promise.all(promises).then(([proposals, tasks]: any) => [
        ...proposals.data.searchProposalsForPodBoardView,
        ...tasks.data.searchTasksForPodBoardView,
      ]);
    } else {
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
        searchPodTaskProposals(getPodTaskProposalsArgs);
      }

      return Promise.resolve([]);
    }
  }

  useEffect(() => {
    if (firstTimeFetch) {
      searchTasks(searchString);
    }
  }, [searchString, podId, statuses, searchPodTasks, getPodTaskProposals]);

  const handleSearch = useCallback(
    (searchString) => {
      if (search) {
        history.pushState({}, '', `${delQuery(router.asPath)}?search=${searchString}&view=list`);
        setSearchString(searchString);

        return Promise.resolve([]);
      } else {
        return searchTasks(searchString, true);
      }
    },
    [podId]
  );

  const handleFilterChange: any = ({ statuses }: TaskFilter) => {
    setStatuses(statuses || DEFAULT_STATUS_ARR);
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
