import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

import { ColumnsContext } from 'utils/contexts';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';
import { splitColsByType } from 'services/board';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { Chevron } from '../../Icons/sections';
import {
  BoardsContainer,
  ResultsCount,
  ResultsCountRight,
  SearchType,
  ShowAllButton,
  ShowAllSearchResults,
} from './styles';

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
  const [totalCount, setTotalCount] = useState(0);
  const [searchResults, setSearchResults] = useState({});
  const { search: searchQuery } = router.query;
  const view = activeView || String(router.query.view ?? ViewType.Grid);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    const { splitCols, totalCount } = splitColsByType(columns);
    setTotalCount(totalCount);
    setSearchResults(splitCols);
  }, [columns, searchQuery]);

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

  function renderSearchResults() {
    return (
      <>
        <ResultsCount>
          <div>
            Showing <span>{totalCount}</span> results {searchQuery ? `for ‘${searchQuery}’` : null}
          </div>
          <ResultsCountRight>
            {Object.values(searchResults).map(({ name, columns }) =>
              columns.tasksCount ? (
                <div key={name}>
                  <span>{columns.tasksCount}</span> {pluralize(name, columns.tasksCount)}
                </div>
              ) : null
            )}
          </ResultsCountRight>
        </ResultsCount>

        {Object.keys(searchResults).map((type) => {
          const { name, icon, columns, showAll } = searchResults[type];
          if (!columns.tasksCount) {
            return null;
          }

          return (
            <div key={name}>
              <SearchType>
                {icon}
                {columns.tasksCount} {pluralize(name, columns.tasksCount)}
              </SearchType>

              <Suspense>
                <Table columns={columns} limit={!showAll ? 5 : undefined} onLoadMore={onLoadMore} hasMore={false} />
              </Suspense>

              {columns.tasksCount > 5 && !showAll ? (
                <ShowAllSearchResults>
                  <ShowAllButton
                    onClick={() => {
                      setSearchResults({ ...searchResults, [type]: { ...searchResults[type], showAll: true } });
                    }}
                  >
                    Show all {columns.tasksCount} task results
                    <Chevron />
                  </ShowAllButton>
                </ShowAllSearchResults>
              ) : null}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <ColumnsContext.Provider value={{ columns, setColumns }}>
      <BoardsContainer>{searchQuery ? renderSearchResults() : renderBoard()}</BoardsContainer>
    </ColumnsContext.Provider>
  );
}

export default Boards;
