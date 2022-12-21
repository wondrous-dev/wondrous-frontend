import React, { Suspense, useMemo, Fragment, useState } from 'react';
import dynamic from 'next/dynamic';

import Accordion from 'components/Common/ListViewAccordion';
import { Title, TitleWrapper, Wrapper } from 'components/SearchResultUserCreatedTasks/styles';
import { useRouter } from 'next/router';
import { ViewType } from 'types/common';
import {
  COLUMNS_CONFIGURATION,
  ENTITIES_TYPES,
  PRIVACY_LEVEL,
  STATUSES_ON_ENTITY_TYPES,
  STATUS_OPEN,
} from 'utils/constants';
import { ColumnsContext } from 'utils/contexts';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { BoardsContainer } from './styles';
import { useLazyQuery, useQuery } from '@apollo/client';
import { SEARCH_ORG_TASK_BOARD_PROPOSALS, SEARCH_TASKS_FOR_ORG_BOARD_VIEW } from 'graphql/queries';
import {
  populateTaskColumns,
  generateColumns,
  populateProposalColumns,
  ORG_POD_PROPOSAL_COLUMNS,
} from 'services/board';
import { useEffect } from 'react';

const KanbanBoard = dynamic(() => import('../KanbanBoard/kanbanBoard'), { suspense: true });
const Table = dynamic(() => import('components/Table'), { suspense: true });
const ListView = dynamic(() => import('components/ListView'), { suspense: true });

const TITLES = {
  [ENTITIES_TYPES.TASK]: 'Tasks',
  [ENTITIES_TYPES.PROPOSAL]: 'Proposals',
  [ENTITIES_TYPES.MILESTONE]: 'Milestones',
  [ENTITIES_TYPES.BOUNTY]: 'Bounties',
};

const ENTITIES_LIST = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.PROPOSAL, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY];

const SearchResults = ({ searchQuery }) => {
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const { filters, entityType, orgId } = orgBoard || userBoard || podBoard;
  const searchOrgTasksArgs = {  
    variables: {
      podIds: filters?.podIds,
      priorities: filters?.priorities,
      orgId: orgId,
      limit: 1000,
      offset: 0,
      // Needed to exclude proposals
      statuses: filters?.statuses || STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
      searchString: searchQuery,
      ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
        onlyPublic: true,
      }),
    },
  };

  const searchOrgProposalArgs = {
    variables: {
      podIds: filters?.podIds,
      priorities: filters?.priorities,
      orgId: orgId,
      statuses: [STATUS_OPEN],
      offset: 0,
      limit: 1000,
      searchString: searchQuery,
    },
  };
  const [getOrgTasks, { data: orgTasksData, refetch: refetchOrgTasksData }] = useLazyQuery(
    SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getOrgProposals, { data: orgProposalData, refetch: refetchOrgProposalsData }] = useLazyQuery(
    SEARCH_ORG_TASK_BOARD_PROPOSALS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (orgBoard && !orgTasksData && !orgProposalData) {
      getOrgTasks(searchOrgTasksArgs);
      getOrgProposals(searchOrgProposalArgs);
    }
  }, [orgBoard, podBoard, userBoard]);

  useEffect(() => {
    if (orgBoard) {
      refetchOrgTasksData(searchOrgTasksArgs.variables);
      refetchOrgProposalsData(searchOrgProposalArgs.variables);
    }
  }, [filters, searchQuery, entityType]);

  const dataColumns = useMemo(() => {
    if (orgTasksData && orgProposalData) {
      const tasks = orgTasksData?.searchTasksForOrgBoardView;
      const proposals = orgProposalData?.searchProposalsForOrgBoardView;
      let columnsPerTaskType = tasks?.reduce((acc, next) => {
        const { type } = next;
        if (next) {
          acc[type] = [...(acc[type] || []), next];
        }
        return acc;
      }, {});

      const columnsPerStatus = Object.keys(columnsPerTaskType).reduce((acc, next) => {
        if (next === ENTITIES_TYPES.TASK) {
          const columns = populateTaskColumns(
            columnsPerTaskType[next],
            generateColumns(false, COLUMNS_CONFIGURATION.ORG),
            true,
            true
          );
          acc[next] = columns;
          return acc;
        }
        acc[next] = columnsPerTaskType[next];
        return acc;
      }, {});

      const proposalColumns = populateProposalColumns(proposals, ORG_POD_PROPOSAL_COLUMNS, true, true);
      columnsPerStatus[ENTITIES_TYPES.PROPOSAL] = proposalColumns;
      return columnsPerStatus;
    }
  }, [orgTasksData, orgProposalData]);
  
  const counts = useMemo(() => {
    if(!dataColumns) return null
    const taskAndProposalCount = {
      [ENTITIES_TYPES.TASK]: 0,
      [ENTITIES_TYPES.PROPOSAL]: 0,
      [ENTITIES_TYPES.MILESTONE]: 0,
      [ENTITIES_TYPES.BOUNTY]: 0,
      total: 0,
    };

    ENTITIES_LIST.forEach((entity) => {
      if (dataColumns[entity] && (entity === ENTITIES_TYPES.MILESTONE || entity === ENTITIES_TYPES.BOUNTY)) {
        taskAndProposalCount[entity] = dataColumns[entity].length;
        taskAndProposalCount.total += dataColumns[entity].length;
      }
      else {
        dataColumns[entity]?.forEach((column) => {
          taskAndProposalCount[entity] += column?.tasks?.length;
        })
        taskAndProposalCount.total += taskAndProposalCount[entity];
      }
    })
    return taskAndProposalCount;
  }, [dataColumns]);

  console.log(dataColumns, 'dataColumns')
  if (!dataColumns) return null;
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>
          Showing {counts.total} results {searchQuery ? `for ‘${searchQuery}’` : null}
        </Title>
      </TitleWrapper>
      {Object.keys(dataColumns).map((entityType) => {
        const columns = dataColumns[entityType];
        const singleColumnData = entityType === ENTITIES_TYPES.BOUNTY || entityType === ENTITIES_TYPES.MILESTONE;
        const Wrapper = singleColumnData
          ? Fragment
          : ({ children }) => (
              <Accordion title={TITLES[entityType]} count={counts[entityType]}>
                {children}
              </Accordion>
            );
        return (
          <Wrapper>
            <ListView
              key={entityType}
              entityType={entityType}
              columns={columns}
              singleColumnData={singleColumnData}
              hasMore={false}
              onLoadMore={() => null}
            />
          </Wrapper>
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
      <BoardsContainer>{searchQuery ? <SearchResults searchQuery={searchQuery} /> : renderBoard()}</BoardsContainer>
    </ColumnsContext.Provider>
  );
}

export default Boards;
