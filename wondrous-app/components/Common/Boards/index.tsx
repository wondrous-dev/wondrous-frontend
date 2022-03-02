import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';

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
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { Table } from '../../Table';
import { delQuery } from '../../../utils';
import SearchTasks from '../../SearchTasks';
import { OrgPod } from '../../../types/pod';
import { Chevron } from '../../Icons/sections';
import { splitColsByType } from '../../../services/board';
import { ViewType } from '../../../types/common';
import { useSelectMembership } from '../../../utils/hooks';
import { MembershipRequestTable } from '../../Table/MembershipRequests';

type Props = {
  filterSchema: any;
  onSearch: (searchString: string) => Promise<any>;
  onFilterChange: (searchString: string) => Promise<any>;
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  isAdmin?: boolean;
};

const Boards = (props: Props) => {
  const { columns, onLoadMore, hasMore, filterSchema, onSearch, onFilterChange, isAdmin } = props;
  const router = useRouter();
  const [view, setView] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchResults, setSearchResults] = useState({});
  const { search: searchQuery } = router.query;
  const selectMembershipHook = useSelectMembership();

  const selectMembershipRequests = selectMembershipHook?.selectMembershipRequests;
  useEffect(() => {
    if (router.isReady) {
      setView((router.query.view || ViewType.Grid) as ViewType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const { splitCols, totalCount } = splitColsByType(columns);

    setTotalCount(totalCount);
    setSearchResults(splitCols);
  }, [columns]);

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
    if (isAdmin) {
      return <Table columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} isAdmin={isAdmin} />;
    }
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
    <BoardsContainer>
      <BoardsActivity>
        <SearchTasks onSearch={onSearch} />
        <Filter filterSchema={filterSchema} onChange={onFilterChange} />
        {view && !searchQuery && !isAdmin ? <ToggleViewButton options={listViewOptions} /> : null}
      </BoardsActivity>
      {selectMembershipRequests && (
        <MembershipRequestTable isAdmin={isAdmin} requests={selectMembershipHook?.requests} />
      )}
      {!selectMembershipRequests && <>{searchQuery ? renderSearchResults() : renderBoard()}</>}
    </BoardsContainer>
  );
};

export default Boards;
