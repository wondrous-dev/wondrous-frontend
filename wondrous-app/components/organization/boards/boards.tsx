import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';

import Wrapper from '../wrapper/wrapper';
import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';

import {
  BoardsActivity,
  BoardsContainer,
  ResultsCount,
  ResultsCountRight,
  SearchType,
  ShowAllButton,
  ShowAllSearchResults,
} from './styles';
import Filter from '../../Common/Filter';
import CreatePodIcon from '../../Icons/createPod';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Table } from '../../Table';
import {
  BOUNTY_TYPE,
  COLUMN_TITLE_ARCHIVED,
  MILESTONE_TYPE,
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
import { Proposal } from '../../Icons';
import { MilestoneIcon, TaskIcon, UserIcon } from '../../Icons/Search/types';
import { Chevron } from '../../Icons/sections';

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
  const [totalCount, setTotalCount] = useState(0);
  const [searchResults, setSearchResults] = useState({});
  const board = useBoard();
  const { taskCount = {} } = board;
  const { search: searchQuery } = router.query;

  useEffect(() => {
    if (router.isReady) {
      setView((router.query.view || ViewType.Grid) as ViewType);
    }
  }, [router.query.view, router.isReady]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    let totalCount = 0;

    const searchResults = {
      [TASK_TYPE]: {
        name: 'task',
        showAll: false,
        items: [],
        icon: <TaskIcon />,
      },
      [BOUNTY_TYPE]: {
        name: 'bounties',
        showAll: false,
        items: [],
        icon: <UserIcon />,
      },
      [MILESTONE_TYPE]: {
        name: 'milestone',
        showAll: false,
        items: [],
        icon: <MilestoneIcon />,
      },
    };

    columns.forEach((column) => {
      const tasks = [...column.section.tasks, ...column.tasks];

      tasks.forEach((task) => {
        totalCount++;
        searchResults[task.type || TASK_TYPE].items.push(task);
      });
    });

    setTotalCount(totalCount);
    setSearchResults(searchResults);
  }, [columns]);

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
        // Back-end doesn't support statuses below
        // {
        //   id: TASK_STATUS_REQUESTED,
        //   name: 'Membership requests',
        //   icon: <TaskStatus status={TASK_STATUS_REQUESTED} />,
        //   count: 0,
        // },
        {
          id: TASK_STATUS_REQUESTED,
          name: 'Proposals',
          icon: <Proposal />,
          count: taskCount.proposal || 0,
        },
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
        // Back-end doesn't support statuses below
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

  function renderBoard() {
    return view ? (
      <>
        {view === ViewType.Grid ? (
          <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        ) : (
          <Table columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        )}
      </>
    ) : null;
  }

  function renderSearchResults() {
    return (
      <>
        <ResultsCount>
          <div>
            Showing <span>{totalCount}</span> results for &apos;{searchQuery}&apos;
          </div>
          <ResultsCountRight>
            {Object.values(searchResults).map(({ name, items }) =>
              items.length ? (
                <div key={name}>
                  <span>{items.length}</span> {pluralize(name, items.length)}
                </div>
              ) : null
            )}
          </ResultsCountRight>
        </ResultsCount>

        {Object.keys(searchResults).map((type) => {
          const { name, items, icon, showAll } = searchResults[type];
          const slicedItems = items.slice(0, 5);

          if (!items.length) {
            return null;
          }

          return (
            <>
              <SearchType>
                {icon}
                {items.length} {pluralize(name, items.length)}
              </SearchType>

              <Table tasks={showAll ? items : slicedItems} onLoadMore={onLoadMore} hasMore={false} />

              {items.length > slicedItems.length && !showAll ? (
                <ShowAllSearchResults>
                  <ShowAllButton
                    onClick={() => {
                      setSearchResults({ ...searchResults, [type]: { ...searchResults[type], showAll: true } });
                    }}
                  >
                    Show all {items.length} task results
                    <Chevron />
                  </ShowAllButton>
                </ShowAllSearchResults>
              ) : null}
            </>
          );
        })}
      </>
    );
  }

  return (
    <Wrapper orgData={orgData}>
      <BoardsContainer>
        <BoardsActivity>
          <SearchTasks onSearch={onSearch} />
          <Filter filterSchema={filterSchema} filter={filter} onChange={onFilterChange} setFilter={setFilter} />
          {view ? <ToggleViewButton options={listViewOptions} /> : null}
        </BoardsActivity>

        {searchQuery ? renderSearchResults() : renderBoard()}
      </BoardsContainer>
    </Wrapper>
  );
};

export default Boards;
