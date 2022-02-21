import { useLazyQuery, useQuery } from '@apollo/client';
import { InputAdornment } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  GET_AUTOCOMPLETE_USERS,
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_PODS,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_SUBMISSIONS,
  GET_USER_TASK_BOARD_TASKS,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
  SEARCH_TASKS_FOR_USER_BOARD_VIEW,
} from '../../../graphql/queries';
import {
  GET_PROPOSALS_USER_CAN_REVIEW,
  GET_SUBMISSIONS_USER_CAN_REVIEW,
} from '../../../graphql/queries/workflowBoards';
import { dedupeColumns, delQuery } from '../../../utils';
import { updateTaskColumns } from '../../../utils/board';
import {
  DEFAULT_STATUS_ARR,
  STATUS_OPEN,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_TODO,
  TASK_STATUSES,
} from '../../../utils/constants';
import { UserBoardContext } from '../../../utils/contexts';
import { useMe } from '../../Auth/withAuth';
import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Requested } from '../../Icons';
import SearchIcon from '../../Icons/search';
import { Archived } from '../../Icons/sections';
import { InReviewIcon } from '../../Icons/statusIcons';
import { Table } from '../../Table';
import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles';
import Boards from '../../Common/Boards';
import { TaskFilter } from '../../../types/task';
import { FILTER_STATUSES, LIMIT, populateTaskColumns } from '../../../services/board';
import apollo from '../../../services/apollo';
import CreatePodIcon from '../../Icons/createPod';

enum ViewType {
  List = 'list',
  Grid = 'grid',
}

const limit = 10;

const taskStatuses = [TASK_STATUS_TODO, TASK_STATUS_IN_PROGRESS, TASK_STATUS_DONE, TASK_STATUS_ARCHIVED];

const todo = {
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

const inProgress = {
  status: TASK_STATUS_IN_PROGRESS,
  tasks: [],
  section: {
    title: 'In Review',
    icon: InReviewIcon,
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

const done = {
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

const baseColumns = [todo, inProgress, done];

const proposal = {
  status: TASK_STATUS_PROPOSAL_REQUEST,
  tasks: [],
};

const submissions = {
  status: TASK_STATUS_SUBMISSION_REQUEST,
  tasks: [],
};

const awaitingPayment = {
  // NOTE: Per Terry's instruction, payments will be hidden for now in Admin View
  status: TASK_STATUS_AWAITING_PAYMENT,
  tasks: [],
};

const baseColumnsAdmin = [proposal, submissions];

const filterColumnsByStatus = (columns, status) => {
  if (!status) return columns;
  return columns.filter((column) => column.status === status);
};

const BoardsPage = (props) => {
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const { isAdmin, selectedStatus } = props;
  const router = useRouter();
  const [view, setView] = useState(null);
  const [orgsWithPods, setOrgsWithPods] = useState({});
  const loggedInUser = useMe();
  const [contributorColumns, setContributorColumns] = useState([]);
  const [adminColumns, setAdminColumns] = useState([]);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [searchString, setSearchString] = useState('');
  const { search } = router.query;

  const [getUserPods, { data: podData, fetchMore: fetchMorePods }] = useLazyQuery(GET_USER_PODS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {},
  });

  const [getTasks, { fetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    variables: {
      userId: loggedInUser?.id,
      statuses: taskStatuses,
      limit,
      offset: 0,
    },
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks;
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : baseColumns);

      setContributorColumns(dedupeColumns(newColumns));
      setHasMoreTasks(tasks?.length >= limit);
    },
  });

  const bindProposalsToCols = (taskProposals) => {
    const newColumns = [...contributorColumns];
    newColumns[0].section.tasks = [];
    taskProposals?.forEach((taskProposal) => {
      newColumns[0].section.tasks.push(taskProposal);
    });
    setContributorColumns(newColumns);
  };

  const [searchTasks] = useLazyQuery(SEARCH_TASKS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForUserBoardView;
      const newColumns = populateTaskColumns(tasks, contributorColumns);
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

      setContributorColumns(dedupeColumns(newColumns));
      setHasMoreTasks(tasks.length >= LIMIT);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [searchProposals] = useLazyQuery(SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForUserBoardView),
    fetchPolicy: 'cache-and-network',
  });

  const [filterSchema, setFilterSchema] = useState([
    // {
    //   name: 'podIds',
    //   label: 'Pods',
    //   multiChoice: true,
    //   items: orgPods.map((pod) => ({
    //     ...pod,
    //     icon: <CreatePodIcon />,
    //     count: pod.contributorCount,
    //   })),
    // },
    FILTER_STATUSES,
  ]);

  const [getUserTaskBoardProposals] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    variables: {
      userId: loggedInUser?.id,
      statuses: [STATUS_OPEN],
      limit,
      offset: 0,
    },
    onCompleted: (data) => {
      const taskProposals = data?.getUserTaskBoardProposals;
      const newColumns = contributorColumns[0]?.section ? [...contributorColumns] : [...baseColumns];
      newColumns[0].section.tasks = [...taskProposals];
      setContributorColumns(newColumns);
    },
  });

  useEffect(() => {
    if (search) {
      const searchTaskProposalsArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString,
        },
      };

      const searchTasksArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: DEFAULT_STATUS_ARR,
          searchString,
        },
      };

      searchTasks(searchTasksArgs);
      searchProposals(searchTaskProposalsArgs);
    } else {
      getTasks();
      getUserTaskBoardProposals();
    }

    getUserPods({
      variables: {
        userId: loggedInUser?.id,
      },
    });
  }, []);

  const getUserTaskBoardSubmissions = useQuery(GET_USER_TASK_BOARD_SUBMISSIONS, {
    variables: {
      userId: loggedInUser?.id,
      statuses: [STATUS_OPEN],
      limit,
      offset: 0,
    },
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardSubmissions;
      if (tasks?.length > 0) {
        const newColumns = contributorColumns[1]?.section ? [...contributorColumns] : [...baseColumns];
        newColumns[1].section.tasks = [...tasks];
        setContributorColumns(newColumns);
      }
    },
  });
  const getProposalsUserCanReview = useQuery(GET_PROPOSALS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getProposalsUserCanReview || [];
      const newColumns = adminColumns[0]?.tasks ? [...adminColumns] : [...baseColumnsAdmin];
      newColumns[0].tasks = [...tasks];
      setAdminColumns(newColumns);
    },
  });
  const getSubmissionsUserCanReview = useQuery(GET_SUBMISSIONS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getSubmissionsUserCanReview;
      const newColumns = adminColumns[1]?.tasks ? [...adminColumns] : [...baseColumnsAdmin];
      newColumns[1].tasks = [...tasks];
      setAdminColumns(newColumns);
    },
  });
  const { data: userTaskCountData } = useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD, {
    variables: {
      userId: loggedInUser?.id,
    },
  });
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const handleLoadMore = useCallback(() => {
    if (hasMoreTasks) {
      fetchMore({
        variables: {
          offset: Math.max(...contributorColumns.map(({ tasks }) => tasks.length)),
          limit,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        }),
      })
        .then((fetchMoreResult) => {
          const results = fetchMoreResult?.data?.getUserTaskBoardTasks;
          if (results && results?.length > 0) {
            const newColumns = updateTaskColumns(results, contributorColumns);
            setContributorColumns(dedupeColumns(newColumns));
          } else {
            setHasMoreTasks(false);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [hasMoreTasks, contributorColumns, fetchMore]);

  function handleSearch(searchString: string) {
    const searchTaskProposalsArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: LIMIT,
        searchString,
      },
    };

    const searchTasksArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        limit: LIMIT,
        offset: 0,
        // Needed to exclude proposals
        statuses: DEFAULT_STATUS_ARR,
        searchString,
      },
    };

    const promises: any = [
      apollo.query({
        ...searchTaskProposalsArgs,
        query: SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
      }),

      apollo.query({
        ...searchTasksArgs,
        query: SEARCH_TASKS_FOR_USER_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([proposals, tasks]: any) => ({
      proposals: proposals.data.searchProposalsForUserBoardView,
      tasks: tasks.data.searchTasksForUserBoardView,
    }));
  }

  const handleFilterChange: any = ({ statuses, podIds }: TaskFilter) => {
    const taskStatuses = (statuses || DEFAULT_STATUS_ARR).filter((status) => TASK_STATUSES.includes(status));
    const shouldSearchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const shouldSearchTasks = !(searchProposals && statuses.length === 1);

    setStatuses(statuses || DEFAULT_STATUS_ARR);

    if (search) {
      const searchTaskProposalsArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString,
        },
      };

      const searchTasksArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses,
          searchString,
        },
      };

      if (shouldSearchTasks) {
        searchTasks(searchTasksArgs);
      } else {
        const newColumns = [...contributorColumns];
        newColumns.forEach((column) => {
          column.tasks = [];
          column.section.tasks = [];
        });

        setContributorColumns(newColumns);
      }

      if (shouldSearchProposals) {
        searchProposals(searchTaskProposalsArgs);
      }
    } else {
      getTasks({
        variables: {
          userId: loggedInUser?.id,
          statuses: taskStatuses,
          limit,
          offset: 0,
        },
      });
    }
  };

  return (
    <UserBoardContext.Provider
      value={{
        columns: contributorColumns,
        setColumns: setContributorColumns,
        taskCount: userTaskCountData?.getPerStatusTaskCountForUserBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        loggedInUserId: loggedInUser?.id,
      }}
    >
      <Boards
        filterSchema={filterSchema}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        columns={isAdmin ? filterColumnsByStatus(adminColumns, selectedStatus) : contributorColumns}
        onLoadMore={handleLoadMore}
        hasMore={hasMoreTasks}
        searchString={searchString}
      />
    </UserBoardContext.Provider>
  );
};

export default BoardsPage;
