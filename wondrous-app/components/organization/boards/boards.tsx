import React, { useEffect, useState } from 'react';
import { InputAdornment } from '@material-ui/core';

import SearchIcon from '../../Icons/search';
import Wrapper from '../wrapper/wrapper';

import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';
import { ButtonGroup } from '../../Common/ButtonGroup';

import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles';
import Filter from '../../Common/Filter';
import { ToDo, InProgress, Done } from '../../Icons';
import CreatePodIcon from '../../Icons/createPod';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Table } from '../../Table';
import { TASK_STATUS_TODO } from '../../../utils/constants';

const Boards = (props) => {
  const { selectOptions, columns, onLoadMore, hasMore, orgData, tasks } = props;
  const [filter, setFilter] = useState([]);
  const [isGridView, setGridView] = useState(false);

  const filterSchema = [
    {
      name: 'Pods',
      multiChoice: true,
      items: [
        {
          id: 'designPod',
          name: 'Design Pod',
          icon: <CreatePodIcon />,
          count: 12,
        },
        {
          id: 'growthTeam',
          name: 'Growth Team',
          icon: <CreatePodIcon />,
          count: 4,
        },
        {
          id: 'analytics',
          name: 'Analytics',
          icon: <CreatePodIcon />,
          count: 1,
        },
        { id: 'dataPod', name: 'Data Pod', icon: <CreatePodIcon />, count: 0 },
        {
          id: 'prDreamTeam',
          name: 'PR Dream Team',
          icon: <CreatePodIcon />,
          count: 2,
        },
        {
          id: 'twitterPod',
          name: 'Twitter Pod',
          icon: <CreatePodIcon />,
          count: 10,
        },
        { id: 'blogPod', name: 'Blog Pod', icon: <CreatePodIcon />, count: 2 },
      ],
    },
    {
      name: 'Status',
      multiChoice: false,
      items: [
        {
          id: 'membershipRequests',
          name: 'Membership requests',
          icon: <Done />,
          count: 4,
        },
        { id: 'proposals', name: 'Proposals', icon: <Done />, count: 22 },
        { id: 'toDo', name: 'To-Do', icon: <ToDo />, count: 8 },
        {
          id: 'inProgress',
          name: 'In Progress',
          icon: <InProgress />,
          count: 232,
        },
        { id: 'inReview', name: 'In Review', icon: <Done />, count: 324 },
        {
          id: 'awaitingPayment',
          name: 'Awaiting Payment',
          icon: <Done />,
          count: 340,
        },
        { id: 'completed', name: 'Completed', icon: <Done />, count: 1120 },
      ],
    },
  ];

  const listViewOptions = [
    {
      name: 'List',
      active: true,
      action: () => setGridView(false),
    },
    {
      name: 'Grid',
      action: () => setGridView(true),
    },
  ];

  return (
    <Wrapper orgData={orgData}>
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
          <ToggleViewButton options={listViewOptions} />
        </BoardsActivity>

        {isGridView ? (
          <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        ) : (
          <Table columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        )}
      </BoardsContainer>
    </Wrapper>
  );
};

export default Boards;
