import dynamic from 'next/dynamic';
import React, { Suspense, useMemo } from 'react';

import Accordion from 'components/Common/ListViewAccordion';
import { Title, TitleWrapper, Wrapper } from 'components/SearchResultUserCreatedTasks/styles';
import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { ColumnsContext } from 'utils/contexts';

import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { BoardsContainer } from './styles';

const KanbanBoard = dynamic(() => import('../KanbanBoard/kanbanBoard'), { suspense: true });
const Table = dynamic(() => import('components/Table'), { suspense: true });
const ListView = dynamic(() => import('components/ListView'), { suspense: true });

const PROPOSAL_STATUSES = ['proposalOpen', 'proposalApproved', 'proposalClosed'];

const TITLES = {
  [ENTITIES_TYPES.TASK]: 'Tasks',
  [ENTITIES_TYPES.PROPOSAL]: 'Proposals',
};

const SearchResults = ({ searchColumns = {}, searchQuery }) => {
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();

  const { taskCount } = orgBoard || userBoard || podBoard;

  const counts = useMemo(() => {
    const taskAndProposalCount = {
      [ENTITIES_TYPES.TASK]: 0,
      [ENTITIES_TYPES.PROPOSAL]: 0,
      total: 0,
    };
    if (taskCount) {
      Object.keys(taskCount).forEach((key) => {
        if (PROPOSAL_STATUSES.includes(key) && searchColumns[ENTITIES_TYPES.PROPOSAL]) {
          return (taskAndProposalCount[ENTITIES_TYPES.PROPOSAL] += taskCount[key]);
        }
        if (!PROPOSAL_STATUSES.includes(key) && Number(taskCount[key]) && searchColumns[ENTITIES_TYPES.TASK]) {
          return (taskAndProposalCount[ENTITIES_TYPES.TASK] += taskCount[key]);
        }
      });
      taskAndProposalCount.total =
        taskAndProposalCount[ENTITIES_TYPES.PROPOSAL] + taskAndProposalCount[ENTITIES_TYPES.TASK];
    }
    return taskAndProposalCount;
  }, [taskCount]);

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>
          Showing {counts.total} results {searchQuery ? `for ‘${searchQuery}’` : null}
        </Title>
      </TitleWrapper>
      {Object.keys(searchColumns).map((entityType) => {
        const columns = searchColumns[entityType];
        return (
          <Accordion title={TITLES[entityType]} count={counts[entityType]}>
            <ListView
              key={entityType}
              entityType={entityType}
              columns={columns}
              hasMore={false}
              onLoadMore={() => null}
            />
          </Accordion>
        );
      })}
    </Wrapper>
  );
};

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
  searchColumns?: any;
};

const LIST_VIEW_MAP = {
  [ENTITIES_TYPES.TASK]: ListView,
};
function Boards(props: Props) {
  const {
    columns,
    onLoadMore,
    hasMore,
    isAdmin,
    setColumns,
    activeView,
    entityType = ENTITIES_TYPES.TASK,
    searchColumns,
  } = props;
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
      <BoardsContainer>
        {searchQuery ? <SearchResults searchQuery={searchQuery} searchColumns={searchColumns} /> : renderBoard()}
      </BoardsContainer>
    </ColumnsContext.Provider>
  );
}

export default Boards;
