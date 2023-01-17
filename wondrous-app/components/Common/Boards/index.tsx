import React, { Suspense, useContext } from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { ColumnsContext, IsMobileContext, IsTabletContext } from 'utils/contexts';
import BoardSearch from 'components/Common/BoardSearch';
import { BoardsContainer } from './styles';

const KanbanBoard = dynamic(() => import('../KanbanBoard/kanbanBoard'), { suspense: true });
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

function Boards(props: Props) {
  const { columns, onLoadMore, hasMore, isAdmin, setColumns, activeView, entityType = ENTITIES_TYPES.TASK } = props;
  const isMobile = useContext(IsMobileContext);
  const isTablet = useContext(IsTabletContext);
  const router = useRouter();
  const { search: searchQuery } = router.query;
  const view = activeView || String(router.query.view ?? ViewType.Grid);

  function renderBoard() {
    return view ? (
      <Suspense>
        {/* TEMPORARY until we come up with a list view for proposals */}
        {view === ViewType.Grid || entityType === ENTITIES_TYPES.PROPOSAL ? (
          <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} setColumns={setColumns} />
        ) : (
          <ListView entityType={entityType} columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        )}
      </Suspense>
    ) : null;
  }

  const dashboardPage = router.asPath.includes('/dashboard');

  return (
    <ColumnsContext.Provider value={{ columns, setColumns }}>
      <BoardsContainer isMobile={isMobile} isTablet={isTablet} dashboardPage={dashboardPage}>
        {searchQuery ? <BoardSearch searchQuery={searchQuery} /> : renderBoard()}
      </BoardsContainer>
    </ColumnsContext.Provider>
  );
}

export default Boards;
