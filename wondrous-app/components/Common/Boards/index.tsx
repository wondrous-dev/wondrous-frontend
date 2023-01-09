import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { ColumnsContext } from 'utils/contexts';
import BoardSearch from 'components/Common/BoardSearch';
import { BoardsContainer } from './styles';

const KanbanBoard = dynamic(() => import('../KanbanBoard/kanbanBoard'), { suspense: true });
const ListView = dynamic(() => import('components/ListView'), { suspense: true });
const CalendarBoard = dynamic(() => import('components/Common/CalendarBoard'), { suspense: true });

type Props = {
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  isAdmin?: boolean;
  setColumns?: React.Dispatch<React.SetStateAction<{}>>;
  activeView?: string;
  onSearch?: any;
  onFilterChange?: any;
  statuses?: any;
  filterSchema?: any;
  userId?: string;
  entityType?: string;
};

function Boards(props: Props) {
  const { columns, onLoadMore, hasMore, isAdmin, setColumns, activeView, entityType = ENTITIES_TYPES.TASK } = props;
  const router = useRouter();
  const { search: searchQuery } = router.query;
  const view = activeView || String(router.query.view ?? ViewType.Grid);

  function renderBoard() {
    let board;

    if (view === ViewType.Calendar) {
      board = <CalendarBoard />;
    } else if (view === ViewType.Grid || entityType === ENTITIES_TYPES.PROPOSAL) {
      board = <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} setColumns={setColumns} />;
    } else {
      board = <ListView entityType={entityType} columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />;
    }

    return <Suspense>{board}</Suspense>;
  }

  return (
    <ColumnsContext.Provider value={{ columns, setColumns }}>
      <BoardsContainer>{searchQuery ? <BoardSearch searchQuery={searchQuery} /> : renderBoard()}</BoardsContainer>
    </ColumnsContext.Provider>
  );
}

export default Boards;
