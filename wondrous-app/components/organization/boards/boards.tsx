import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Wrapper from '../wrapper/wrapper';

import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';

import {
  BoardsActivity,
  BoardsContainer,
} from './styles';
import Filter from '../../Common/Filter';
import CreatePodIcon from '../../Icons/createPod';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Table } from '../../Table';
import {
  COLUMN_TITLE_ARCHIVED,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PAID,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
  TASK_TYPE,
} from '../../../utils/constants';
import { delQuery } from '../../../utils';
import SearchTasks from '../../SearchTasks';
import { OrgPod } from '../../../types/pod';
import TaskStatus from '../../Icons/TaskStatus';
import { useBoard } from '../../../utils/hooks';

enum ViewType {
  List = 'list',
  Grid = 'grid',
}

type Props = {
  orgPods: OrgPod[];
  onSearch: (searchString: string) => Promise<any>;
  onFiltersChange: (searchString: string) => Promise<any>;
};

const Boards = (props: Props) => {
  const { columns, onLoadMore, hasMore, orgData, orgPods, onSearch, onFilterChange } = props;
  const [filter, setFilter] = useState([]);
  const router = useRouter();
  const [view, setView] = useState(null);
  const board = useBoard();
  const { taskCount = {} } = board;

  useEffect(() => {
    if (router.isReady) {
      setView((router.query.view || ViewType.Grid) as ViewType);
    }
  }, [router.query.view, router.isReady]);

  const filterSchema = [
    {
      name: 'pods',
      label: 'Pods',
      multiChoice: true,
      items: orgPods.map((pod) => ({
        ...pod,
        icon: <CreatePodIcon />,
        count: pod.contributorCount,
      })),
    },
    {
      name: 'statuses',
      label: 'Status',
      multiChoice: true,
      items: [
        // {
        //   id: TASK_STATUS_REQUESTED,
        //   name: 'Membership requests',
        //   icon: <TaskStatus status={TASK_STATUS_REQUESTED} />,
        //   count: 0,
        // },
        // { id: 'proposals', name: 'Proposals', icon: <Proposal />, count: taskCount.proposal || 0 },
        {
          id: TASK_STATUS_TODO,
          name: 'To-Do',
          icon: <TaskStatus status={TASK_STATUS_TODO} />,
          count: taskCount.created || 0,
        },
        {
          id: TASK_STATUS_IN_PROGRESS,
          name: 'In-progress',
          icon: <TaskStatus status={TASK_STATUS_IN_PROGRESS} />,
          count: taskCount.inProgress || 0,
        },
        {
          id: TASK_STATUS_IN_REVIEW,
          name: 'In-review',
          icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
          count: taskCount.inReview || 0,
        },
        {
          id: TASK_STATUS_DONE,
          name: 'Completed',
          icon: <TaskStatus status={TASK_STATUS_DONE} />,
          count: taskCount.completed || 0,
        },
        // {
        //   id: TASK_STATUS_AWAITING_PAYMENT,
        //   name: 'Awaiting payment',
        //   icon: <TaskStatus status={TASK_STATUS_AWAITING_PAYMENT} />,
        //   count: 0,
        // },
        // {
        //   id: TASK_STATUS_PAID,
        //   name: 'Completed and paid',
        //   icon: <TaskStatus status={TASK_STATUS_PAID} />,
        //   count: 0,
        // },
        {
          id: TASK_STATUS_ARCHIVED,
          name: 'Archived',
          icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
          count: 0,
        },
      ],
    },
  ];

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

  const tasks = columns.reduce((acc, column) => {
    let tasks = [...column.section.tasks, ...column.tasks];
    // Don't show archived tasks
    if (column.section.title === COLUMN_TITLE_ARCHIVED) {
      tasks = column.tasks;
    }

    return [...acc, ...tasks];
  }, []);

  return (
    <Wrapper orgData={orgData}>
      <BoardsContainer>
        <BoardsActivity>
          <SearchTasks onSearch={onSearch} />
          <Filter filterSchema={filterSchema} filter={filter} onChange={onFilterChange} setFilter={setFilter} />
          {view ? <ToggleViewButton options={listViewOptions} /> : null}
        </BoardsActivity>

        {view ? (
          <>
            {view === ViewType.Grid ? (
              <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
            ) : (
              <Table tasks={tasks} onLoadMore={onLoadMore} hasMore={hasMore} />
            )}
          </>
        ) : null}
      </BoardsContainer>
    </Wrapper>
  );
};

export default Boards;
