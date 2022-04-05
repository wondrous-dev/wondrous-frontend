import { ColumnsContext } from 'utils/contexts';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';
import React, { useEffect, useState } from 'react';
import { splitColsByType } from '../../../services/board';
import { ViewType } from '../../../types/common';
import { delQuery } from '../../../utils';
import { useOrgBoard, useSelectMembership } from '../../../utils/hooks';
import Filter from '../../Common/Filter';
import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Chevron } from '../../Icons/sections';
import { GridViewIcon } from '../../Icons/ViewIcons/gridView';
import { ListViewIcon } from '../../Icons/ViewIcons/listView';
import SearchTasks from '../../SearchTasks';
import { Table } from '../../Table';
import { MembershipRequestTable } from '../../Table/MembershipRequests';
import SelectMenuBoardType from '../SelectMenuBoardType';
import {
  BoardsActivity,
  BoardsContainer,
  ResultsCount,
  ResultsCountRight,
  SearchType,
  ShowAllButton,
  ShowAllSearchResults,
} from './styles';

type Props = {
  filterSchema: any;
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: ({}) => void;
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  isAdmin?: boolean;
  statuses: string[];
  podIds?: string[];
  userId?: string;
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
};

const Boards = (props: Props) => {
  const {
    columns,
    onLoadMore,
    hasMore,
    filterSchema,
    onSearch,
    onFilterChange,
    isAdmin,
    statuses,
    podIds = [],
    setColumns,
    userId,
  } = props;
  const router = useRouter();
  const orgBoard = useOrgBoard();
  const [totalCount, setTotalCount] = useState(0);
  const [searchResults, setSearchResults] = useState({});
  const { search: searchQuery } = router.query;
  const selectMembershipHook = useSelectMembership();
  const { boardType } = router.query;
  const selectMembershipRequests = selectMembershipHook?.selectMembershipRequests;
  const view = String(router.query.view ?? ViewType.Grid);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const { splitCols, totalCount } = splitColsByType(columns);

    setTotalCount(totalCount);
    setSearchResults(splitCols);
  }, [columns]);

  const statusesQuery = statuses?.length ? `&statuses=${statuses.join(',')}` : '';
  const podIdsQuery = podIds?.length ? `&podIds=${podIds.join(',')}` : '';
  const userIdQuery = userId ? `&userId=${userId}` : '';

  const listViewOptions = [
    {
      name: 'List',
      icon: <ListViewIcon />,
      active: view === ViewType.List,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.List}${statusesQuery}${podIdsQuery}${userIdQuery}`);
      },
    },
    {
      name: 'Grid',
      icon: <GridViewIcon />,
      active: view === ViewType.Grid,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Grid}${statusesQuery}${podIdsQuery}${userIdQuery}`);
      },
    },
  ];

  function renderBoard() {
    if (isAdmin) {
      return <Table columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} isAdmin={isAdmin} />;
    }
    return view ? (
      <>
        {view === ViewType.Grid ? (
          <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} setColumns={setColumns} />
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

              <Table columns={columns} limit={!showAll ? 5 : undefined} onLoadMore={onLoadMore} hasMore={false} />

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
      <BoardsContainer>
        <BoardsActivity>
          <SearchTasks onSearch={onSearch} />
          <Filter filterSchema={filterSchema} onChange={onFilterChange} statuses={statuses} podIds={podIds} />
          {orgBoard && <SelectMenuBoardType router={router} view={view} />}
          {view && !searchQuery && !isAdmin ? <ToggleViewButton options={listViewOptions} /> : null}
        </BoardsActivity>
        {selectMembershipRequests && (
          <MembershipRequestTable isAdmin={isAdmin} requests={selectMembershipHook?.requests} />
        )}
        {!selectMembershipRequests && <>{searchQuery ? renderSearchResults() : renderBoard()}</>}
      </BoardsContainer>
    </ColumnsContext.Provider>
  );
};

export default Boards;
