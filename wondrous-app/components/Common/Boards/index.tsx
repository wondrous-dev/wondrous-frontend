import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { ColumnsContext } from 'utils/contexts';
import BoardSearch from 'components/Common/BoardSearch';
import { BoardsContainer } from './styles';

const KanbanBoard = dynamic(() => import('../KanbanBoard/kanbanBoard'), { suspense: true });
const Table = dynamic(() => import('components/Table'), { suspense: true });
const ListView = dynamic(() => import('components/ListView'), { suspense: true });

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

const LIST_VIEW_MAP = {
  [ENTITIES_TYPES.TASK]: ListView,
};
function Boards(props: Props) {
  const { columns, onLoadMore, hasMore, isAdmin, setColumns, activeView, entityType = ENTITIES_TYPES.TASK } = props;
  const router = useRouter();
  const { search: searchQuery } = router.query;
  const view = activeView || String(router.query.view ?? ViewType.Grid);

  function renderBoard() {
    const ListViewComponent = LIST_VIEW_MAP[entityType] || Table;

    return view ? (
      <Suspense>
        {/* TEMPORARY until we come up with a list view for proposals */}
        {view === ViewType.Grid || entityType === ENTITIES_TYPES.PROPOSAL ? (
          <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} setColumns={setColumns} />
        ) : (
          <ListViewComponent entityType={entityType} columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        )}
      </Suspense>
    ) : null;
  }

  return (
    <ColumnsContext.Provider value={{ columns, setColumns }}>
      <BoardsContainer>{searchQuery ? <BoardSearch searchQuery={searchQuery} /> : renderBoard()}</BoardsContainer>
    </ColumnsContext.Provider>
  );
}

export default Boards;
