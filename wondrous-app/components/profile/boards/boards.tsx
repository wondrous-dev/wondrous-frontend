import React, { useEffect, useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import { useRouter } from 'next/router';

import SearchIcon from '../../Icons/search';
import Wrapper from '../wrapper/wrapper';

import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';
import { ButtonGroup } from '../../Common/ButtonGroup';

import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles';

import { Table } from '../../Table';
import { ToDo, InProgress, Done } from '../../Icons';
import CreatePodIcon from '../../Icons/createPod';
import Filter from '../../Common/Filter';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { delQuery } from 'utils';

enum ViewType {
  List = 'list',
  Grid = 'grid',
}

const Boards = (props) => {
  const { selectOptions, columns, tasks, onLoadMore, hasMore } = props;
  const [selected, setSelected] = useState(0);
  const buttons = ['List', 'Grid'];
  const router = useRouter();
  const [view, setView] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setView((router.query.view || ViewType.Grid) as ViewType);
    }
  }, [router.query.view]);

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

  return (
    <Wrapper userProfileData={{}}>
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
          {view ? <ToggleViewButton options={listViewOptions} /> : null}
        </BoardsActivity>

        {view ? (
          <>
            {view === ViewType.Grid ? (
              <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
            ) : (
              <Table columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
            )}
          </>
        ) : null}
      </BoardsContainer>
    </Wrapper>
  );
};

export default Boards;
