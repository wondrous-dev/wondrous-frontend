import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
} from '../../../graphql/queries/taskBoard';
import Boards from '../../../components/organization/boards/boards';
import SearchBoards from '../../../components/organization/boards/SearchBoards';
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
} from '../../../utils/constants';
import { GET_ORG_FROM_USERNAME, GET_ORG_BY_ID, GET_ORG_PODS } from '../../../graphql/queries/org';
import { OrgBoardContext } from '../../../utils/contexts';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
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

export const populateTaskColumns = (tasks, columns) => {
  if (!columns) {
    return [];
  }

  const newColumns = columns.map((column) => {
    column.tasks = [];
    column.statuses = {};

    return (
      tasks &&
      tasks.reduce((column, task) => {
        if (column.status === task.status) {
          column.tasks = [...column.tasks, task];
          column.statuses = {
            [task.status]: (column.statuses[task.status] || 0) + 1,
          };
        } else if (task?.status === TASK_STATUS_ARCHIVED && column.section.filter.taskType === TASK_STATUS_ARCHIVED) {
          column.section.tasks = [...column.section.tasks, task];
          column.statuses = {
            [task.status]: (column.statuses[task.status] || 0) + 1,
          };
        }

        return column;
      }, column)
    );
  });
  return newColumns;
};

export const addToTaskColumns = (newResults, columns) => {
  if (!columns) return [];
  const newColumns = columns.map((column) => {
    return newResults.reduce((column, task) => {
      if (column.status === task.status) {
        column.tasks = [...column.tasks, task];
      }
      return column;
    }, column);
  });
  return newColumns;
};

const BoardsPage = () => {
  const router = useRouter();
  const [columns, setColumns] = useState(COLUMNS);
  const [filter, setFilter] = useState({});
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const [podIds, setPodIds] = useState([]);
  const [orgData, setOrgData] = useState(null);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const { username, orgId, search } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(false);
  const [getOrgPods, { data: { getOrgPods: orgPods = [] } = {} }] = useLazyQuery(GET_ORG_PODS);

  const [getOrgTaskProposals] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const newColumns = [...columns];
      const taskProposals = data?.getOrgTaskBoardProposals;
      newColumns[0].section.tasks = [];
      taskProposals?.forEach((taskProposal) => {
        newColumns[0].section.tasks.push(taskProposal);
      });
      setColumns(newColumns);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgTaskSubmissions] = useLazyQuery(GET_ORG_TASK_BOARD_SUBMISSIONS, {
    onCompleted: (data) => {
      const newColumns = [...columns];
      const taskSubmissions = data?.getOrgTaskBoardSubmissions;
      newColumns[1].section.tasks = [];
      taskSubmissions?.forEach((taskSubmission) => {
        newColumns[1].section.tasks.push(taskSubmission);
      });
      setColumns(newColumns);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgBoardTaskCount, { data: orgTaskCountData, variables: getOrgBoardTaskCountVariables }] = useLazyQuery(
    GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD
  );

  const [searchOrgTasks] = useLazyQuery(SEARCH_TASKS_FOR_ORG_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForOrgBoardView;
      const newColumns = populateTaskColumns(tasks, columns);
      setColumns(dedupeColumns(newColumns));
      setOrgTaskHasMore(tasks.length >= LIMIT);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgTasks, { fetchMore, variables: getOrgTasksVariables }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      if (!firstTimeFetch) {
        const tasks = data?.getOrgTaskBoardTasks;
        const newColumns = populateTaskColumns(tasks, columns);
        setColumns(dedupeColumns(newColumns));
        setOrgTaskHasMore(tasks.length >= LIMIT);
        setFirstTimeFetch(true);
      }
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

      getOrgPods({
        variables: {
          orgId: id,
        },
      });

      getOrgTasks({
        variables: {
          orgId: id,
          statuses,
          offset: 0,
          limit: LIMIT,
        },
      });
      getOrgTaskProposals({
        variables: {
          orgId: id,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
        },
      });
      getOrgTaskSubmissions({
        variables: {
          orgId: id,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
        },
      });
      getOrgBoardTaskCount({
        variables: {
          orgId: id,
        },
      });
    }
  }, [orgData, orgId, getOrgBoardTaskCount, getOrgTaskSubmissions, getOrgTaskProposals, getOrgTasks]);

  // EFFECT FOR SEARCH + FILTERS
  // Update tasks when search or filters is changed
  useEffect(() => {
    if (!firstTimeFetch) {
      return;
    }

    if (orgId || orgData?.id) {
      const id = orgId || orgData?.id;

      searchOrgTasks({
        variables: {
          statuses,
          podIds,
          orgId: id,
          limit: 1000,
          offset: 0,
          searchString: search,
        },
      });
    }
  }, [orgData, statuses, orgId, searchOrgTasks, search, podIds]);

  const handleSearch = useCallback(
    (searchString) => {
      const id = orgId || orgData?.id;

      if (search) {
        router.replace(`${delQuery(router.asPath)}?search=${searchString}&view=list`);

        return Promise.resolve([]);
      } else {
        return apollo
          .query({
            query: SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
            variables: {
              orgId: id,
              limit: LIMIT,
              statuses,
              podIds,
              offset: 0,
              searchString,
            },
          })
          .then((result) => result.data.searchTasksForOrgBoardView);
      }
    },
    [orgId, orgData]
  );

  const handleFilterChange = ({ statuses, pods }: TaskFilter) => {
    setStatuses(statuses || []);
    setPodIds(pods || []);
  };

  const handleLoadMore = useCallback(() => {
    if (orgTaskHasMore) {
      fetchMore({
        variables: {
          offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
          limit: LIMIT,
        },
      }).then((fetchMoreResult) => {
        const results = fetchMoreResult?.data?.getOrgTaskBoardTasks;
        if (results && results?.length > 0) {
          const newColumns = addToTaskColumns(results, columns);
          setColumns(dedupeColumns(newColumns));
        } else {
          setOrgTaskHasMore(false);
        }
      });
    }
  }, [orgTaskHasMore, columns, fetchMore]);

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
        statuses,
        setStatuses,
        columns,
        setColumns,
        orgId: orgData?.id,
        taskCount: orgTaskCountData?.getPerStatusTaskCountForOrgBoard,
        getOrgBoardTaskCountVariables,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        getOrgTasksVariables,
        setFirstTimeFetch,
      }}
    >
      {search ? (
        <SearchBoards
          orgPods={orgPods}
          selectOptions={SELECT_OPTIONS}
          columns={columns}
          onLoadMore={handleLoadMore}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          hasMore={orgTaskHasMore}
          orgData={orgData}
        />
      ) : (
        <Boards
          orgPods={orgPods}
          selectOptions={SELECT_OPTIONS}
          columns={columns}
          onLoadMore={handleLoadMore}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          hasMore={orgTaskHasMore}
          orgData={orgData}
        />
      )}
    </OrgBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
