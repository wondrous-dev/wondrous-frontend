import { useQuery } from '@apollo/client';
import { InputAdornment } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_SUBMISSIONS,
  GET_USER_TASK_BOARD_TASKS,
} from '../../../graphql/queries';
import {
  GET_PROPOSALS_USER_CAN_REVIEW,
  GET_SUBMISSIONS_USER_CAN_REVIEW,
} from '../../../graphql/queries/workflowBoards';
import { dedupeColumns, delQuery } from '../../../utils';
import { updateTaskColumns } from '../../../utils/board';
import {
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
} from '../../../utils/constants';
import { UserBoardContext } from '../../../utils/contexts';
import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Requested } from '../../Icons';
import SearchIcon from '../../Icons/search';
import { Archived } from '../../Icons/sections';
import { InReviewIcon } from '../../Icons/statusIcons';
import { Table } from '../../Table';
import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles';

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

const Boards = (props) => {
  const { isAdmin, selectedStatus } = props;
  const router = useRouter();
  const [view, setView] = useState(null);
  const [columns, setColumns] = useState([]);
  const [adminColumns, setAdminColumns] = useState([]);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const { fetchMore } = useQuery(GET_USER_TASK_BOARD_TASKS, {
    variables: {
      statuses: taskStatuses,
      limit,
      offset: 0,
    },
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks;
      const newColumns = updateTaskColumns(tasks, columns.length > 0 ? columns : baseColumns);
      setColumns(dedupeColumns(newColumns));
      setHasMoreTasks(tasks?.length >= limit);
    },
  });
  const getUserTaskBoardProposals = useQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    variables: {
      statuses: [STATUS_OPEN],
      limit,
      offset: 0,
    },
    onCompleted: (data) => {
      const taskProposals = data?.getUserTaskBoardProposals;
      const newColumns = columns[0]?.section ? [...columns] : [...baseColumns];
      newColumns[0].section.tasks = [...taskProposals];
      setColumns(newColumns);
    },
  });
  const getUserTaskBoardSubmissions = useQuery(GET_USER_TASK_BOARD_SUBMISSIONS, {
    variables: {
      statuses: [STATUS_OPEN],
      limit,
      offset: 0,
    },
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardSubmissions;
      if (tasks?.length > 0) {
        const newColumns = columns[1]?.section ? [...columns] : [...baseColumns];
        newColumns[1].section.tasks = [...tasks];
        setColumns(newColumns);
      }
    },
  });
  const getProposalsUserCanReview = useQuery(GET_PROPOSALS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getProposalsUserCanReview;
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
  const { data: userTaskCountData } = useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const listViewOptions = [
    {
      name: 'List',
      active: view === ViewType.List,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.List}`);
      },
    },
    {
      name: 'Grid',
      active: view === ViewType.Grid,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Grid}`);
      },
    },
  ];

  useEffect(() => {
    if (router.isReady && !isAdmin) {
      setView((router.query.view || ViewType.Grid) as ViewType);
    }
    if (router.isReady && isAdmin) {
      setView(ViewType.List as ViewType);
    }
  }, [router.query.view, router.isReady, isAdmin]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreTasks) {
      fetchMore({
        variables: {
          offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
          limit,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        }),
      })
        .then((fetchMoreResult) => {
          const results = fetchMoreResult?.data?.getUserTaskBoardTasks;
          if (results && results?.length > 0) {
            const newColumns = updateTaskColumns(results, columns);
            setColumns(dedupeColumns(newColumns));
          } else {
            setHasMoreTasks(false);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [hasMoreTasks, columns, fetchMore]);

  return (
    <UserBoardContext.Provider
      value={{
        columns: isAdmin ? filterColumnsByStatus(adminColumns, selectedStatus) : columns,
        setColumns: isAdmin ? setAdminColumns : setColumns,
        taskCount: userTaskCountData?.getPerStatusTaskCountForUserBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <BoardsContainer>
        <BoardsActivity>
          <BoardsActivityInput
            style={{ visibility: 'hidden' }}
            placeholder="Search people or pods..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/*<Filter style={{ visibility: 'hidden' }} filterSchema={filterSchema} filter={filter} setFilter={setFilter} />*/}
          {view && !isAdmin ? <ToggleViewButton options={listViewOptions} /> : null}
        </BoardsActivity>

        {view ? (
          <>
            {view === ViewType.Grid ? (
              <KanbanBoard columns={columns} onLoadMore={handleLoadMore} hasMore={hasMoreTasks} isAdmin={isAdmin} />
            ) : (
              <Table
                columns={isAdmin ? filterColumnsByStatus(adminColumns, selectedStatus) : columns}
                onLoadMore={handleLoadMore}
                hasMore={hasMoreTasks}
                isAdmin={isAdmin}
              />
            )}
          </>
        ) : null}
      </BoardsContainer>
    </UserBoardContext.Provider>
  );
};

export default Boards;
